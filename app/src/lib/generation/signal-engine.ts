// The single Signal engine. One news item → one grounded Signal (anchoring +
// analysis). Used by BOTH the single-Signal route (/api/news-trade) and the
// Briefings digest (/api/generate-digest = a digest of N Signals). This is the
// fusion point: there is exactly one generator.

import OpenAI from 'openai'
import { fetchQuotes } from '../market-data'
import { retrieveRelatedMarkets } from '../polymarket-index'
import {
  buildTradeSystemPrompt, buildTradeUserPrompt,
  type TradeReport, type TradeRelatedMarket, type TradeAsset, type TradeScenario, type WatchItem,
} from './trade-prompt'
import type { NewsItem } from '../types'

export interface SignalResult {
  report: TradeReport
  usage: { input: number; output: number }
}

const arr = <T,>(x: unknown): T[] => (Array.isArray(x) ? x as T[] : [])

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
