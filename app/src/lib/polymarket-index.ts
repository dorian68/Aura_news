// [A] RAG over Polymarket — fetch a broad set of active markets, embed their
// questions once (cached in-memory with a TTL), and retrieve the markets most
// semantically related to a news item. No fabrication: this only *finds* real
// markets; the implied % shown later comes straight from the market object.

import OpenAI from 'openai'
import type { PolyMarket } from './polymarket'

const GAMMA = 'https://gamma-api.polymarket.com'
const EMBED_MODEL = 'text-embedding-3-small'
const TTL_MS = 30 * 60 * 1000     // refresh the market index every 30 min
const MAX_MARKETS = 600           // top markets by volume

interface GammaRaw {
  id?: string | number; question?: string; title?: string
  outcomePrices?: string | string[]; volumeNum?: number; volume?: number | string
  slug?: string; active?: boolean; closed?: boolean
}

function asArray(v: string | string[] | undefined): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : [] } catch { return [] }
}

async function fetchBroadMarkets(): Promise<PolyMarket[]> {
  const out: PolyMarket[] = []
  for (let offset = 0; offset < MAX_MARKETS; offset += 100) {
    try {
      const res = await fetch(
        `${GAMMA}/markets?active=true&closed=false&limit=100&offset=${offset}&order=volume&ascending=false`,
        { headers: { Accept: 'application/json' }, next: { revalidate: 600 } },
      )
      if (!res.ok) break
      const raw: GammaRaw[] = await res.json()
      for (const m of raw) {
        if (!m.question || !m.outcomePrices) continue
        const prices = asArray(m.outcomePrices).map(Number)
        out.push({
          id: String(m.id ?? ''),
          question: String(m.question),
          yesPct: Math.round((prices[0] ?? 0.5) * 100),
          volume: Number(m.volumeNum ?? m.volume ?? 0),
          url: `https://polymarket.com/event/${m.slug ?? m.id ?? ''}`,
        })
      }
      if (raw.length < 100) break
    } catch { break }
  }
  return out
}

// ── In-memory embedding index (one process) ──
interface Index { markets: PolyMarket[]; vectors: number[][]; ts: number }
let cache: Index | null = null
let building: Promise<Index> | null = null

function client(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY
  return key ? new OpenAI({ apiKey: key, maxRetries: 4 }) : null
}

async function embed(texts: string[], oa: OpenAI): Promise<number[][]> {
  const res = await oa.embeddings.create({ model: EMBED_MODEL, input: texts })
  return res.data.map(d => d.embedding as number[])
}

async function buildIndex(): Promise<Index> {
  const oa = client()
  const markets = await fetchBroadMarkets()
  if (!oa || !markets.length) return { markets, vectors: [], ts: Date.now() }
  // Embed in chunks to stay well within request limits.
  const vectors: number[][] = []
  for (let i = 0; i < markets.length; i += 200) {
    const chunk = markets.slice(i, i + 200).map(m => m.question)
    vectors.push(...await embed(chunk, oa))
  }
  return { markets, vectors, ts: Date.now() }
}

async function getIndex(): Promise<Index> {
  if (cache && Date.now() - cache.ts < TTL_MS) return cache
  if (building) return building
  building = buildIndex().then(idx => { cache = idx; building = null; return idx })
    .catch(e => { building = null; throw e })
  return building
}

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1)
}

export interface MarketCandidate { market: PolyMarket; score: number }

/**
 * Top-k Polymarket markets semantically related to `newsText`. Fully fault
 * tolerant: returns [] on any failure (no key, index build error, embed error)
 * so a transient RAG hiccup degrades to "no markets" instead of killing the report.
 */
export async function retrieveRelatedMarkets(newsText: string, k = 12): Promise<MarketCandidate[]> {
  try {
    const oa = client()
    if (!oa) return []
    const idx = await getIndex()
    if (!idx.vectors.length) return []
    const [q] = await embed([newsText], oa)
    return idx.markets
      .map((market, i) => ({ market, score: cosine(q, idx.vectors[i]) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
  } catch {
    return []
  }
}
