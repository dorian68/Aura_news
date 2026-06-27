// Frozen Signal + live overlay — the scale layer.
//
//   • The expensive editorial Signal is generated ONCE (LLM) and stored in
//     Supabase (watchlist-agnostic) → served to N users without re-generating.
//   • The fresh bits (Polymarket %, asset moves) are hydrated at read time from
//     shared, short-TTL caches keyed by market-id / ticker — fetched once per
//     window and fanned out to everyone, so freshness scales independently.

import { getDb } from '../supabase'
import { fetchAssetQuotes, fetchSparklines, fetchNormalizedSeries, fetchFundamentals, MACRO_TICKERS, type AssetQuote, type SeriesPoint, type Fundamental } from '../market-data'
import { generateSignal, generateSignalStreaming, type StreamHandlers } from './signal-engine'
import type { TradeReport, MacroItem, Exhibit } from './trade-prompt'
import type { NewsItem } from '../types'

// ── Frozen store ──

export async function getStoredSignal(newsId: string): Promise<TradeReport | null> {
  const db = getDb()
  if (!db) return null
  const { data, error } = await db.from('alphalens_signals').select('payload').eq('news_id', newsId).maybeSingle()
  if (error || !data) return null
  return data.payload as TradeReport
}

async function storeSignal(report: TradeReport): Promise<void> {
  const db = getDb()
  if (!db) return
  await db.from('alphalens_signals').upsert(
    { news_id: report.newsId, payload: report, updated_at: new Date().toISOString() },
    { onConflict: 'news_id' },
  )
}

export interface SignalFetch { report: TradeReport; generated: boolean; usage?: { input: number; output: number } }

/** Stored frozen signal, or generate-once-and-store. Watchlist-agnostic (shared).
 *  Si `handlers` est fourni et qu'il faut générer, on utilise le moteur STREAMING
 *  (narration + article token-par-token). En cache : retour instantané, pas de stream. */
export async function getOrCreateSignal(item: NewsItem, handlers?: StreamHandlers): Promise<SignalFetch | null> {
  const stored = await getStoredSignal(item.id)
  if (stored) return { report: stored, generated: false }
  const res = handlers
    ? await generateSignalStreaming(item, [], handlers)
    : await generateSignal(item, [])
  if (!res) return null
  await storeSignal(res.report)
  return { report: res.report, generated: true, usage: res.usage }
}

// ── Live overlay: shared caches keyed by market-id / ticker ──

const GAMMA = 'https://gamma-api.polymarket.com'
const TTL = 60_000
const priceCache = new Map<string, { v: number; ts: number }>()
const quoteCache = new Map<string, { v: AssetQuote; ts: number }>()

async function getMarketPrices(ids: string[]): Promise<Map<string, number>> {
  const out = new Map<string, number>()
  const now = Date.now()
  const stale: string[] = []
  for (const id of ids) {
    const c = priceCache.get(id)
    if (c && now - c.ts < TTL) out.set(id, c.v)
    else stale.push(id)
  }
  await Promise.all(stale.map(async id => {
    try {
      const res = await fetch(`${GAMMA}/markets?id=${encodeURIComponent(id)}`, { headers: { Accept: 'application/json' }, next: { revalidate: 60 } })
      if (!res.ok) return
      const arr = await res.json()
      const m = Array.isArray(arr) ? arr[0] : arr
      if (!m) return
      let prices: number[] = []
      try { prices = JSON.parse(m.outcomePrices).map(Number) } catch { /* skip */ }
      const yesPct = Math.round((prices[0] ?? 0.5) * 100)
      priceCache.set(id, { v: yesPct, ts: now })
      out.set(id, yesPct)
    } catch { /* keep frozen value */ }
  }))
  return out
}

// Sparklines (séries historiques) — cache plus long (donnée journalière).
const SPARK_TTL = 30 * 60 * 1000
const sparkCache = new Map<string, { v: number[]; ts: number }>()

async function getSparklines(syms: string[]): Promise<Map<string, number[]>> {
  const out = new Map<string, number[]>()
  const now = Date.now()
  const stale: string[] = []
  for (const s of syms.map(x => x.toUpperCase())) {
    const c = sparkCache.get(s)
    if (c && now - c.ts < SPARK_TTL) { if (c.v.length) out.set(s, c.v) }
    else stale.push(s)
  }
  if (stale.length) {
    const fresh = await fetchSparklines(stale)
    for (const s of stale) {                       // mémorise aussi les vides (évite de re-fetch en boucle)
      const v = fresh.get(s) ?? []
      sparkCache.set(s, { v, ts: now })
      if (v.length) out.set(s, v)
    }
  }
  return out
}

// Caches exhibits (données plus lourdes, journalières) — TTL long.
const EXH_TTL = 30 * 60 * 1000
const seriesCache = new Map<string, { v: number[]; ts: number }>()
const fundCache = new Map<string, { v: Fundamental | null; ts: number }>()

async function getSeries(tickers: string[]): Promise<SeriesPoint[]> {
  const now = Date.now()
  const out = new Map<string, number[]>()
  const stale: string[] = []
  for (const t of tickers.map(x => x.toUpperCase())) {
    const c = seriesCache.get(t)
    if (c && now - c.ts < EXH_TTL) { if (c.v.length) out.set(t, c.v) } else stale.push(t)
  }
  if (stale.length) {
    const fresh = await fetchNormalizedSeries(stale)
    for (const t of stale) { const s = fresh.find(x => x.ticker === t); seriesCache.set(t, { v: s?.points ?? [], ts: now }); if (s) out.set(t, s.points) }
  }
  return tickers.map(t => t.toUpperCase()).filter(t => out.has(t)).map(t => ({ ticker: t, points: out.get(t)! }))
}

async function getFundamentals(tickers: string[]): Promise<Fundamental[]> {
  const now = Date.now()
  const out = new Map<string, Fundamental>()
  const stale: string[] = []
  for (const t of tickers.map(x => x.toUpperCase())) {
    const c = fundCache.get(t)
    if (c && now - c.ts < EXH_TTL) { if (c.v) out.set(t, c.v) } else stale.push(t)
  }
  if (stale.length) {
    const fresh = await fetchFundamentals(stale)
    for (const t of stale) { const f = fresh.find(x => x.ticker === t) ?? null; fundCache.set(t, { v: f, ts: now }); if (f) out.set(t, f) }
  }
  return tickers.map(t => t.toUpperCase()).filter(t => out.has(t)).map(t => out.get(t)!)
}

// Attache les données réelles à chaque exhibit (séries / fondamentaux).
async function enrichExhibits(exhibits: Exhibit[]): Promise<Exhibit[]> {
  return Promise.all(exhibits.map(async e => {
    if (e.type === 'linechart') return { ...e, series: await getSeries(e.tickers) }
    if (e.type === 'metricgrid' || e.type === 'barchart') return { ...e, fundamentals: await getFundamentals(e.tickers) }
    return e
  }))
}

// Quotes réelles (prix + % jour) par symbole, cache court partagé.
async function getAssetQuotes(syms: string[]): Promise<Map<string, AssetQuote>> {
  const out = new Map<string, AssetQuote>()
  const now = Date.now()
  const stale: string[] = []
  for (const s of syms.map(x => x.toUpperCase())) {
    const c = quoteCache.get(s)
    if (c && now - c.ts < TTL) out.set(s, c.v)
    else stale.push(s)
  }
  if (stale.length) {
    const fresh = await fetchAssetQuotes(stale)
    for (const [s, q] of fresh) { quoteCache.set(s, { v: q, ts: now }); out.set(s, q) }
  }
  return out
}

/**
 * Overlay fresh Polymarket %/asset moves onto a frozen signal and apply the
 * user's watchlist. No LLM, no per-user generation — pure hydration.
 */
export async function hydrateSignal(frozen: TradeReport, watchlist: string[] = []): Promise<TradeReport> {
  const ids = [
    ...frozen.relatedMarkets.map(m => m.marketId),
    ...frozen.scenarios.map(s => s.marketId),
  ].filter((x): x is string => !!x)

  const wl = new Set(watchlist.map(s => s.toUpperCase()))
  const quoteSyms = [...new Set([
    ...frozen.assets.map(a => a.sym),
    ...watchlist,
    ...MACRO_TICKERS.map(m => m.sym),
  ].map(s => s.toUpperCase()))]

  const [prices, quotes, sparks, exhibits] = await Promise.all([
    getMarketPrices([...new Set(ids)]),
    getAssetQuotes(quoteSyms),
    getSparklines(quoteSyms),
    enrichExhibits(frozen.exhibits ?? []),
  ])

  // Bandeau macro : niveaux réels uniquement (un proxy sans donnée est omis).
  const macro: MacroItem[] = []
  for (const m of MACRO_TICKERS) {
    const q = quotes.get(m.sym.toUpperCase())
    if (q) macro.push({ label: m.label, sym: m.sym, price: q.price, changePct: q.changePct, spark: sparks.get(m.sym.toUpperCase()) })
  }

  return {
    ...frozen,
    relatedMarkets: frozen.relatedMarkets.map(m =>
      m.marketId && prices.has(m.marketId) ? { ...m, yesPct: prices.get(m.marketId)! } : m),
    scenarios: frozen.scenarios.map(s =>
      s.marketId && prices.has(s.marketId) ? { ...s, prob: prices.get(s.marketId)! } : s),
    assets: frozen.assets.map(a => {
      const q = quotes.get(a.sym.toUpperCase())
      return {
        ...a,
        inWatchlist: wl.has(a.sym.toUpperCase()),
        price: q ? q.price : a.price,
        changePct: q ? q.changePct : a.changePct,
        spark: sparks.get(a.sym.toUpperCase()) ?? a.spark,
      }
    }),
    macro,
    exhibits,
  }
}
