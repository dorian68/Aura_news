// General Polymarket access for the digest: fetch active markets once and
// fuzzy-match a free-text claim to the most relevant market. Returns the real
// implied probability; matching is conservative (returns null when unsure).

const GAMMA = 'https://gamma-api.polymarket.com'

export interface PolyMarket {
  id: string
  question: string
  yesPct: number      // 0-100 implied probability of "Yes"
  volume: number
  url: string
}

interface GammaRaw {
  id?: string | number
  question?: string
  title?: string
  outcomePrices?: string | string[]
  volumeNum?: number
  volume?: number | string
  slug?: string
  active?: boolean
  closed?: boolean
}

function asArray(v: string | string[] | undefined): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : [] } catch { return [] }
}

/** Top active markets by volume, normalized. Returns [] on error. */
export async function fetchActiveMarkets(limit = 120): Promise<PolyMarket[]> {
  try {
    const res = await fetch(
      `${GAMMA}/markets?active=true&closed=false&limit=${limit}&order=volume&ascending=false`,
      { headers: { Accept: 'application/json' }, next: { revalidate: 300 } },
    )
    if (!res.ok) return []
    const raw: GammaRaw[] = await res.json()
    return raw
      .filter(m => m.active && !m.closed && m.outcomePrices)
      .map((m): PolyMarket => {
        const prices = asArray(m.outcomePrices).map(Number)
        const yes = Math.round((prices[0] ?? 0.5) * 100)
        return {
          id: String(m.id ?? ''),
          question: String(m.question ?? m.title ?? ''),
          yesPct: yes,
          volume: Number(m.volumeNum ?? m.volume ?? 0),
          url: `https://polymarket.com/event/${m.slug ?? m.id ?? ''}`,
        }
      })
      .filter(m => m.question)
  } catch {
    return []
  }
}

const STOP = new Set(['the', 'a', 'an', 'of', 'to', 'in', 'on', 'for', 'and', 'or', 'is', 'are',
  'will', 'be', 'by', 'with', 'at', 'as', 'this', 'that', 'from', 'it', 'its', 'may', 'more', 'than'])

function tokens(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/)
    .filter(w => w.length > 3 && !STOP.has(w))
}

/**
 * Best market for a free-text claim, by token overlap. Conservative: requires
 * at least `minOverlap` shared meaningful tokens, else returns null.
 */
export function matchMarket(claim: string, markets: PolyMarket[], minOverlap = 2): PolyMarket | null {
  const want = new Set(tokens(claim))
  if (want.size === 0) return null
  let best: PolyMarket | null = null
  let bestScore = 0
  for (const m of markets) {
    const have = new Set(tokens(m.question))
    let score = 0
    for (const w of want) if (have.has(w)) score++
    // small bonus for higher-volume (more meaningful) markets
    if (score > bestScore || (score === bestScore && best && m.volume > best.volume)) {
      bestScore = score
      best = m
    }
  }
  return bestScore >= minOverlap ? best : null
}
