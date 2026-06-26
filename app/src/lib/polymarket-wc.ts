// Real World Cup markets from Polymarket (gamma API), enumerated by the
// `fifa-world-cup` tag. Each match has two events:
//   • moneyline   "X vs. Y"               → 1X2 (Home / Draw / Away) implied %
//   • exact-score "X vs. Y - Exact Score" → full correct-score distribution
// Indexed by sorted FIFA-TLA pair so the matches feed can attach a real
// "crowd" 1X2 + a real correct-score "Market" tab in the drawer.

import { tlaForName } from './football-meta'

const GAMMA = 'https://gamma-api.polymarket.com'
const WC_TAG = '102232'

export interface WcScoreLine { home: number; away: number; prob: number }

export interface WcMarket {
  winByTla?: Record<string, number>   // TLA → win prob (0-1)
  draw?: number                       // draw prob (0-1)
  homeTla?: string                    // orientation for scores[]
  awayTla?: string
  scores?: WcScoreLine[]              // exact-score Yes-probs, home/away in homeTla/awayTla order
}

interface GammaChild { groupItemTitle?: string; question?: string; outcomePrices?: string | string[] }
interface GammaEvent { title?: string; markets?: GammaChild[] }

function yesPrice(c: GammaChild): number {
  const p = c.outcomePrices
  const arr = Array.isArray(p) ? p : (() => { try { return JSON.parse(p || '[]') } catch { return [] } })()
  return Number(arr[0]) || 0
}

function pairKey(t1: string, t2: string): string {
  return [t1, t2].sort().join('|')
}

/** "X vs. Y" / "X vs. Y - Exact Score" → [homeName, awayName] or null. */
function parseVs(title: string): [string, string] | null {
  const t = title.replace(/\s*-\s*Exact Score\s*$/i, '').trim()
  const m = t.split(/\s+vs\.?\s+/i)
  return m.length === 2 ? [m[0].trim(), m[1].trim()] : null
}

async function fetchAllWcEvents(): Promise<GammaEvent[]> {
  const all: GammaEvent[] = []
  for (let offset = 0; offset < 500; offset += 100) {
    try {
      const res = await fetch(`${GAMMA}/events?tag_id=${WC_TAG}&closed=false&limit=100&offset=${offset}`, {
        headers: { Accept: 'application/json' }, next: { revalidate: 300 },
      })
      if (!res.ok) break
      const page: GammaEvent[] = await res.json()
      all.push(...page)
      if (page.length < 100) break
    } catch { break }
  }
  return all
}

/** Build a TLA-pair index of real WC moneyline + exact-score markets. {} on error. */
export async function fetchWcMarkets(): Promise<Record<string, WcMarket>> {
  const events = await fetchAllWcEvents()
  const out: Record<string, WcMarket> = {}
  const get = (k: string) => (out[k] ??= {})

  for (const e of events) {
    const title = e.title || ''
    if (!/ vs\.? /i.test(title) || /halftime/i.test(title)) continue
    const teams = parseVs(title)
    if (!teams) continue
    const homeTla = tlaForName(teams[0])
    const awayTla = tlaForName(teams[1])
    if (homeTla.length !== 3 || awayTla.length !== 3) continue
    const key = pairKey(homeTla, awayTla)
    const isExact = /exact score/i.test(title)

    if (isExact) {
      const scores: WcScoreLine[] = []
      for (const c of e.markets || []) {
        const git = c.groupItemTitle || ''
        // "Ecuador 0 - 2 Germany"
        const m = git.match(/^.*?(\d+)\s*-\s*(\d+).*$/)
        if (!m) continue
        scores.push({ home: parseInt(m[1], 10), away: parseInt(m[2], 10), prob: yesPrice(c) })
      }
      if (scores.length) {
        const rec = get(key)
        rec.homeTla = homeTla; rec.awayTla = awayTla; rec.scores = scores
      }
    } else {
      const winByTla: Record<string, number> = {}
      let draw: number | undefined
      for (const c of e.markets || []) {
        const git = c.groupItemTitle || ''
        if (/^draw\b/i.test(git)) { draw = yesPrice(c); continue }
        const tla = tlaForName(git)
        if (tla.length === 3) winByTla[tla] = yesPrice(c)
      }
      if (Object.keys(winByTla).length >= 2) {
        const rec = get(key)
        rec.winByTla = winByTla
        if (draw != null) rec.draw = draw
      }
    }
  }
  return out
}

export function lookupWcMarket(index: Record<string, WcMarket>, aTla: string, bTla: string): WcMarket | undefined {
  return index[pairKey(aTla, bTla)]
}
