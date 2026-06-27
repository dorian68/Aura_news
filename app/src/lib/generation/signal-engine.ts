// The single Signal engine. One news item → one grounded Signal (anchoring +
// analysis). Used by BOTH the single-Signal route (/api/news-trade) and the
// Briefings digest (/api/generate-digest = a digest of N Signals). This is the
// fusion point: there is exactly one generator.

import OpenAI from 'openai'
import { fetchQuotes } from '../market-data'
import { retrieveRelatedMarkets } from '../polymarket-index'
import {
  buildTradeSystemPrompt, buildTradeUserPrompt,
  buildPlanSystemPrompt, buildPlanUserPrompt, buildArticleSystemPrompt, buildArticleUserPrompt,
  type TradeReport, type TradeRelatedMarket, type TradeAsset, type TradeScenario, type WatchItem, type SectionPlan, type Exhibit,
} from './trade-prompt'
import type { NewsItem } from '../types'

export interface SignalResult {
  report: TradeReport
  usage: { input: number; output: number }
}

// Callbacks pour l'expérience streaming (narration réelle + article token-par-token).
export interface StreamHandlers {
  onStatus?: (s: { step: string; pct: number }) => void
  onArticleDelta?: (delta: string) => void
}

const arr = <T,>(x: unknown): T[] => (Array.isArray(x) ? x as T[] : [])

// Découpe le texte streamé ("## Heading\n body…") en sections {heading, body}.
function parseSections(text: string): { heading: string; body: string }[] {
  return text.split(/^##\s+/m).map(s => s.trim()).filter(Boolean).map(p => {
    const nl = p.indexOf('\n')
    return nl < 0 ? { heading: p.trim(), body: '' } : { heading: p.slice(0, nl).trim(), body: p.slice(nl + 1).trim() }
  })
}

/**
 * Generate one grounded Signal for a news item. Returns null on any failure
 * (no key, bad LLM response, transient error) so callers degrade gracefully —
 * a single failed item never kills a digest.
 */
export async function generateSignal(item: NewsItem, watchlist: string[] = []): Promise<SignalResult | null> {
  try {
    if (!process.env.OPENAI_API_KEY) return null

    const candidates = await retrieveRelatedMarkets(`${item.title}. ${item.summary ?? ''}`, 12)

    let watchItems: WatchItem[] = watchlist.map(sym => ({ sym }))
    const tdKey = process.env.TWELVE_DATA_API_KEY || ''
    if (tdKey && watchlist.length) {
      try {
        const quotes = await fetchQuotes(watchlist, tdKey)
        const byS = new Map(quotes.map(q => [q.sym, q.changePct]))
        watchItems = watchlist.map(sym => ({ sym, changePct: byS.get(sym) }))
      } catch { /* keep symbols without quotes */ }
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 4 })
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 6000,   // article long-form GS (~1500-2500 mots) + données structurées
      messages: [
        { role: 'system', content: buildTradeSystemPrompt() },
        { role: 'user', content: buildTradeUserPrompt(item, candidates, watchItems) },
      ],
      response_format: { type: 'json_object' },
    })

    const raw = response.choices[0]?.message?.content || ''
    const m = raw.match(/\{[\s\S]*\}/)
    if (!m) return null
    const parsed = JSON.parse(m[0])

    // Attach real market data to selected candidates (never trust LLM %).
    const relatedMarkets: TradeRelatedMarket[] = arr<TradeRelatedMarket>(parsed.relatedMarkets)
      .filter(r => candidates[r.idx])
      .map(r => {
        const c = candidates[r.idx].market
        return { ...r, marketId: c.id, question: c.question, yesPct: c.yesPct, url: c.url, volume: c.volume }
      })

    const wlMoves = new Map(watchItems.map(w => [w.sym, w.changePct]))
    const assets: TradeAsset[] = arr<TradeAsset>(parsed.assets).map(a => ({
      ...a,
      inWatchlist: wlMoves.has(a.sym),
      changePct: wlMoves.get(a.sym),
    }))

    // Scenarios carry a % ONLY when the model mapped a real market.
    const scenarios: TradeScenario[] = arr<TradeScenario>(parsed.scenarios).map(s => {
      const c = typeof s.marketIdx === 'number' ? candidates[s.marketIdx] : undefined
      return c
        ? { label: s.label, impact: s.impact, marketId: c.market.id, prob: c.market.yesPct, marketUrl: c.market.url }
        : { label: s.label, impact: s.impact }
    })

    const report: TradeReport = {
      id: `trd_${Date.now()}_${item.id}`,
      newsId: item.id,
      newsTitle: item.title,
      newsSource: item.source,
      headline: parsed.headline ?? item.title,
      thesis: parsed.thesis ?? '',
      keyTakeaways: arr<string>(parsed.keyTakeaways),
      relatedMarkets,
      assets,
      portfolioImpact: parsed.portfolioImpact ?? '',
      scenarios,
      pricedIn: arr<string>(parsed.pricedIn),
      notPricedIn: arr<string>(parsed.notPricedIn),
      sections: arr<{ heading: string; body: string }>(parsed.sections),
      watch: arr<string>(parsed.watch),
      finalTake: parsed.finalTake ?? '',
      createdAt: new Date().toISOString(),
    }

    return {
      report,
      usage: {
        input: response.usage?.prompt_tokens ?? 0,
        output: response.usage?.completion_tokens ?? 0,
      },
    }
  } catch {
    return null
  }
}

/**
 * Variante STREAMING : même résultat que generateSignal, mais émet une narration
 * réelle (onStatus) et l'article token-par-token (onArticleDelta). Génération en
 * 2 temps : Phase A (données + plan, JSON rapide) puis Phase B (article streamé).
 */
export async function generateSignalStreaming(item: NewsItem, watchlist: string[] = [], h: StreamHandlers = {}): Promise<SignalResult | null> {
  try {
    if (!process.env.OPENAI_API_KEY) return null
    h.onStatus?.({ step: 'Reading the story…', pct: 8 })

    h.onStatus?.({ step: 'Searching related prediction markets…', pct: 16 })
    const candidates = await retrieveRelatedMarkets(`${item.title}. ${item.summary ?? ''}`, 12)
    h.onStatus?.({ step: `${candidates.length} candidate markets retrieved`, pct: 24 })

    let watchItems: WatchItem[] = watchlist.map(sym => ({ sym }))
    const tdKey = process.env.TWELVE_DATA_API_KEY || ''
    if (tdKey && watchlist.length) {
      try {
        const quotes = await fetchQuotes(watchlist, tdKey)
        const byS = new Map(quotes.map(q => [q.sym, q.changePct]))
        watchItems = watchlist.map(sym => ({ sym, changePct: byS.get(sym) }))
      } catch { /* keep symbols */ }
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 4 })

    // ── Phase A : données structurées + plan ──
    h.onStatus?.({ step: 'Mapping markets & affected assets…', pct: 34 })
    const planResp = await client.chat.completions.create({
      model: 'gpt-4o-mini', max_tokens: 1500, response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildPlanSystemPrompt() },
        { role: 'user', content: buildPlanUserPrompt(item, candidates, watchItems) },
      ],
    })
    const rawPlan = planResp.choices[0]?.message?.content || ''
    const pm = rawPlan.match(/\{[\s\S]*\}/)
    if (!pm) return null
    const parsed = JSON.parse(pm[0])

    const relatedMarkets: TradeRelatedMarket[] = arr<TradeRelatedMarket>(parsed.relatedMarkets)
      .filter(r => candidates[r.idx])
      .map(r => {
        const c = candidates[r.idx].market
        return { ...r, marketId: c.id, question: c.question, yesPct: c.yesPct, url: c.url, volume: c.volume }
      })
    const wlMoves = new Map(watchItems.map(w => [w.sym, w.changePct]))
    const assets: TradeAsset[] = arr<TradeAsset>(parsed.assets).map(a => ({
      ...a, inWatchlist: wlMoves.has(a.sym), changePct: wlMoves.get(a.sym),
    }))
    const scenarios: TradeScenario[] = arr<TradeScenario>(parsed.scenarios).map(s => {
      const c = typeof s.marketIdx === 'number' ? candidates[s.marketIdx] : undefined
      return c
        ? { label: s.label, impact: s.impact, marketId: c.market.id, prob: c.market.yesPct, marketUrl: c.market.url }
        : { label: s.label, impact: s.impact }
    })
    h.onStatus?.({ step: `Assets mapped: ${assets.map(a => a.sym).join(', ') || '—'}`, pct: 46 })

    // Exhibits (specs) — tickers limités aux actifs réels listés.
    const assetSyms = new Set(assets.map(a => a.sym.toUpperCase()))
    const exhibits: Exhibit[] = arr<Exhibit>(parsed.exhibits)
      .filter(e => e && typeof e.id === 'number' && e.type)
      .map(e => {
        if ('tickers' in e && Array.isArray(e.tickers)) {
          const t = e.tickers.map(x => String(x).toUpperCase()).filter(x => assetSyms.has(x))
          return { ...e, tickers: t.length ? t : assets.slice(0, 4).map(a => a.sym) }
        }
        return e
      })

    // ── Phase B : rédaction de l'article EN STREAMING ──
    h.onStatus?.({ step: 'Writing the briefing…', pct: 56 })
    const plan: SectionPlan[] = arr<SectionPlan>(parsed.sectionPlan)
    const stream = await client.chat.completions.create({
      model: 'gpt-4o-mini', max_tokens: 6000, stream: true, stream_options: { include_usage: true },
      messages: [
        { role: 'system', content: buildArticleSystemPrompt() },
        { role: 'user', content: buildArticleUserPrompt(item, relatedMarkets.map(r => ({ idx: r.idx, question: r.question ?? '', yesPct: r.yesPct ?? 0 })), assets.map(a => ({ sym: a.sym, direction: a.direction, reason: a.reason })), plan, exhibits.map(e => ({ id: e.id, type: e.type, title: 'title' in e ? e.title : undefined }))) },
      ],
    })
    let articleText = ''
    let streamUsage = { input: 0, output: 0 }
    for await (const chunk of stream) {
      const d = chunk.choices[0]?.delta?.content || ''
      if (d) { articleText += d; h.onArticleDelta?.(d) }
      if (chunk.usage) streamUsage = { input: chunk.usage.prompt_tokens ?? 0, output: chunk.usage.completion_tokens ?? 0 }
    }
    const sections = parseSections(articleText)
    h.onStatus?.({ step: 'Finalizing…', pct: 78 })

    const report: TradeReport = {
      id: `trd_${Date.now()}_${item.id}`,
      newsId: item.id,
      newsTitle: item.title,
      newsSource: item.source,
      headline: parsed.headline ?? item.title,
      thesis: parsed.thesis ?? '',
      keyTakeaways: arr<string>(parsed.keyTakeaways),
      relatedMarkets,
      assets,
      portfolioImpact: parsed.portfolioImpact ?? '',
      scenarios,
      pricedIn: arr<string>(parsed.pricedIn),
      notPricedIn: arr<string>(parsed.notPricedIn),
      sections,
      watch: arr<string>(parsed.watch),
      finalTake: parsed.finalTake ?? '',
      createdAt: new Date().toISOString(),
      exhibits,
    }
    return {
      report,
      usage: {
        input: (planResp.usage?.prompt_tokens ?? 0) + streamUsage.input,
        output: (planResp.usage?.completion_tokens ?? 0) + streamUsage.output,
      },
    }
  } catch {
    return null
  }
}
