// Optional deep-live layer — api-football (api-sports.io).
// Gated on API_FOOTBALL_KEY. Adds exact live minute, an event-by-event feed,
// momentum (ball possession) and market-style predictions used as the "crowd".
// Free tier is 100 req/day, so per-fixture enrichment is hard-capped.

import { normTeam } from './football-meta'

const AF_BASE = 'https://v3.football.api-sports.io'
const WC_LEAGUE = 1          // FIFA World Cup
// Season is overridable: the api-football FREE plan only exposes 2022–2024, so
// WC2026 live data needs a paid plan. Set API_FOOTBALL_SEASON to test on 2022–24.
const WC_SEASON = Number(process.env.API_FOOTBALL_SEASON) || 2026
const MAX_ENRICH = 4         // per-fixture event/prediction calls per request

export interface AfFeedItem { time: string; text: string; icon: string }

export interface AfInfo {
  fixtureId: number
  elapsed?: number
  live: boolean
  finished: boolean
  homeScore?: number
  awayScore?: number
  momentumHome?: number          // ball possession %, home
  feed?: AfFeedItem[]
  crowd?: { a: number; draw: number; b: number }  // prediction percentages
}

interface AfFixture {
  fixture: { id: number; status: { short: string; elapsed: number | null } }
  teams: { home: { name: string }; away: { name: string } }
  goals: { home: number | null; away: number | null }
}

const LIVE_STATUSES = new Set(['1H', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE', 'HT'])
const DONE_STATUSES = new Set(['FT', 'AET', 'PEN'])

function headers(key: string): HeadersInit {
  return { 'x-apisports-key': key }
}

function pairKey(home?: string, away?: string): string {
  return `${normTeam(home)}|${normTeam(away)}`
}

function iconForEvent(type: string, detail: string): string {
  const t = type.toLowerCase()
  if (t === 'goal') return '⚽'
  if (t === 'card') return /red/i.test(detail) ? '🟥' : '🟨'
  if (t === 'subst') return '🔁'
  if (t === 'var') return '📺'
  return '📊'
}

async function getJson(url: string, key: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, { headers: headers(key), next: { revalidate: 25 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function fetchFeed(fixtureId: number, key: string): Promise<AfFeedItem[]> {
  const data = await getJson(`${AF_BASE}/fixtures/events?fixture=${fixtureId}`, key) as
    | { response?: Array<Record<string, unknown>> } | null
  const events = data?.response ?? []
  return events
    .map((e): AfFeedItem => {
      const time = e.time as { elapsed?: number; extra?: number }
      const team = e.team as { name?: string }
      const player = e.player as { name?: string }
      const type = (e.type as string) ?? ''
      const detail = (e.detail as string) ?? ''
      const mins = `${time?.elapsed ?? 0}${time?.extra ? '+' + time.extra : ''}'`
      const who = [player?.name, team?.name].filter(Boolean).join(' · ')
      return { time: mins, text: `${detail}${who ? ' — ' + who : ''}`, icon: iconForEvent(type, detail) }
    })
    .reverse()
    .slice(0, 6)
}

async function fetchMomentum(fixtureId: number, key: string): Promise<number | undefined> {
  const data = await getJson(`${AF_BASE}/fixtures/statistics?fixture=${fixtureId}`, key) as
    | { response?: Array<{ statistics?: Array<{ type: string; value: unknown }> }> } | null
  const home = data?.response?.[0]?.statistics ?? []
  const poss = home.find(s => s.type === 'Ball Possession')?.value
  if (typeof poss === 'string') {
    const n = parseInt(poss.replace('%', ''), 10)
    return Number.isNaN(n) ? undefined : n
  }
  return undefined
}

async function fetchPrediction(fixtureId: number, key: string): Promise<AfInfo['crowd'] | undefined> {
  const data = await getJson(`${AF_BASE}/predictions?fixture=${fixtureId}`, key) as
    | { response?: Array<{ predictions?: { percent?: { home?: string; draw?: string; away?: string } } }> } | null
  const pct = data?.response?.[0]?.predictions?.percent
  if (!pct) return undefined
  const a = parseInt(pct.home ?? '', 10)
  const draw = parseInt(pct.draw ?? '', 10)
  const b = parseInt(pct.away ?? '', 10)
  if ([a, draw, b].some(Number.isNaN)) return undefined
  return { a, draw, b }
}

/**
 * Build a team-pair index of deep-live info for `dateISO`. One fixtures call,
 * then capped per-fixture enrichment (live games first, then upcoming for
 * predictions). Returns {} when no key or on error.
 */
export async function fetchApiFootballDay(
  key: string | undefined,
  dateISO: string,
): Promise<Record<string, AfInfo>> {
  if (!key) return {}
  const data = await getJson(
    `${AF_BASE}/fixtures?date=${dateISO}&league=${WC_LEAGUE}&season=${WC_SEASON}`,
    key,
  ) as { response?: AfFixture[] } | null
  const fixtures = data?.response ?? []
  if (!fixtures.length) return {}

  const out: Record<string, AfInfo> = {}
  // Prioritize live fixtures for the limited enrichment budget.
  const ordered = [...fixtures].sort((x, y) => {
    const lx = LIVE_STATUSES.has(x.fixture.status.short) ? 0 : 1
    const ly = LIVE_STATUSES.has(y.fixture.status.short) ? 0 : 1
    return lx - ly
  })

  let budget = MAX_ENRICH
  for (const f of ordered) {
    const short = f.fixture.status.short
    const live = LIVE_STATUSES.has(short)
    const finished = DONE_STATUSES.has(short)
    const info: AfInfo = {
      fixtureId: f.fixture.id,
      elapsed: f.fixture.status.elapsed ?? undefined,
      live, finished,
      homeScore: f.goals.home ?? undefined,
      awayScore: f.goals.away ?? undefined,
    }
    if (budget > 0 && live) {
      info.feed = await fetchFeed(f.fixture.id, key)
      info.momentumHome = await fetchMomentum(f.fixture.id, key)
      budget--
    } else if (budget > 0 && !finished) {
      info.crowd = await fetchPrediction(f.fixture.id, key)
      budget--
    }
    const k = pairKey(f.teams.home.name, f.teams.away.name)
    out[k] = info
    out[pairKey(f.teams.away.name, f.teams.home.name)] = info
  }
  return out
}

export function lookupAf(
  index: Record<string, AfInfo>,
  homeName: string,
  awayName: string,
): AfInfo | undefined {
  return index[pairKey(homeName, awayName)]
}
