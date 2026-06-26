// Live market search over real Polymarket markets — powers the search bar's
// autocomplete dropdown and the trending "desk" cards. Real question, YES %,
// volume, close date, 24h move, derived category + a directional sparkline.

const GAMMA = 'https://gamma-api.polymarket.com'

export interface MarketHit {
  id: string
  question: string
  yesPct: number
  vol: string
  volNum: number
  closes: string
  delta: number       // 24h move, percentage points
  up: boolean
  category: string
  catCol: string
  spark: number[]     // 8 points, 0-100
}

const CATS: { re: RegExp; cat: string; col: string }[] = [
  { re: /bitcoin|\bbtc\b|ethereum|\beth\b|crypto|solana|\bxrp\b|dogecoin|stablecoin|blockchain|hyperliquid/i, cat: 'Crypto', col: '#f59e0b' },
  { re: /\bfed\b|rate cut|rate hike|interest rate|inflation|\bcpi\b|\bgdp\b|recession|powell|fomc|jobs report|treasury|ecb/i, cat: 'Macro', col: '#2469a6' },
  { re: /\bai\b|openai|\bgpt\b|nvidia|\bchip|semiconductor|\bllm\b|anthropic|model release/i, cat: 'AI / Tech', col: '#5b50d8' },
  { re: /world cup|\bfifa\b|football|soccer|\bnba\b|\bnfl\b|super bowl|champions league|premier league|tennis|win the|reach the|finals|grand slam|olympic|\bvs\.?\b|\bo\/u\b|games o\/u/i, cat: 'Sports', col: '#2f9488' },
  { re: /election|president|senate|congress|trump|governor|primary|nominee|parliament|prime minister|premier of|mayor/i, cat: 'Politics', col: '#c43d34' },
  { re: /spacex|starship|rocket|nasa|\bmoon\b|\bmars\b|satellite/i, cat: 'Space', col: '#7c3aed' },
  { re: /temperature|climate|hurricane|weather|emissions|global warming/i, cat: 'Climate', col: '#0f7d56' },
  { re: /silver|\bgold\b|\boil\b|copper|crude|\bwti\b|natural gas/i, cat: 'Commodities', col: '#8a6d1e' },
  { re: /market cap|\bstock|s&p|nasdaq|\bipo\b|earnings|tesla|apple\b/i, cat: 'Equities', col: '#b9572b' },
]
function classify(q: string) {
  for (const c of CATS) if (c.re.test(q)) return c
  return { cat: 'Markets', col: '#8b93a1' }
}

function fmtVol(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${Math.round(n / 1e3)}K`
  return `$${Math.round(n)}`
}
function fmtCloses(iso?: string): string {
  if (!iso) return ''
  try { return 'closes ' + new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) } catch { return '' }
}
function sparkFrom(p: number, weekChange: number): number[] {
  const start = Math.max(2, Math.min(98, p - weekChange * 100))
  const pts: number[] = []
  for (let i = 0; i < 8; i++) {
    const t = i / 7
    pts.push(Math.max(1, Math.min(99, start + (p - start) * t + Math.sin(i * 1.7) * 1.2)))
  }
  pts[7] = p
  return pts.map(x => Math.round(x))
}

interface Raw {
  id?: string | number; question?: string; outcomePrices?: string
  volumeNum?: number; volume24hr?: number; endDate?: string
  oneDayPriceChange?: number; oneWeekPriceChange?: number
}

let cache: { ts: number; items: MarketHit[] } | null = null

async function allMarkets(): Promise<MarketHit[]> {
  if (cache && Date.now() - cache.ts < 120_000) return cache.items
  const items: MarketHit[] = []
  for (let off = 0; off < 300; off += 100) {
    try {
      const res = await fetch(`${GAMMA}/markets?active=true&closed=false&limit=100&offset=${off}&order=volume24hr&ascending=false`, { headers: { Accept: 'application/json' }, next: { revalidate: 120 } })
      if (!res.ok) break
      const raw: Raw[] = await res.json()
      for (const m of raw) {
        if (!m.question || !m.outcomePrices) continue
        let prices: number[] = []
        try { prices = JSON.parse(m.outcomePrices).map(Number) } catch { /* skip */ }
        const yesPct = Math.round((prices[0] ?? 0.5) * 100)
        const volNum = Number(m.volume24hr ?? m.volumeNum ?? 0)
        const day = Number(m.oneDayPriceChange ?? 0) * 100
        const c = classify(m.question)
        items.push({
          id: String(m.id), question: m.question, yesPct, vol: fmtVol(volNum), volNum,
          closes: fmtCloses(m.endDate), delta: Math.round(day * 10) / 10, up: day >= 0,
          category: c.cat, catCol: c.col, spark: sparkFrom(yesPct, Number(m.oneWeekPriceChange ?? 0)),
        })
      }
      if (raw.length < 100) break
    } catch { break }
  }
  cache = { ts: Date.now(), items }
  return items
}

const STOP = new Set(['will', 'the', 'a', 'an', 'of', 'to', 'in', 'on', 'by', 'be', 'at', 'before', 'reach', 'win', 'than', 'this', 'and', 'for'])
const toks = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP.has(w))

/** Search real markets by token overlap; q='' returns trending (top volume). */
export async function searchMarkets(q: string, limit = 6): Promise<MarketHit[]> {
  const all = await allMarkets()
  const want = toks(q.trim())
  if (!want.length) return all.slice(0, limit)
  const scored = all
    .map(m => { const hay = toks(m.question); let s = 0; for (const w of want) if (hay.some(h => h.includes(w))) s++; return { m, s } })
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s || b.m.volNum - a.m.volNum)
  return (scored.length ? scored.map(x => x.m) : all).slice(0, limit)
}
