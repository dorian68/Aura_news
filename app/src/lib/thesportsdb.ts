// Keyless enrichment — thesportsdb.com (free test key "3").
// Provides venue/city (football-data free tier omits them) and acts as a
// complementary fallback for live minute + score, indexed by team-pair.

import { normTeam, flagForTla, tlaForName, matchSlug } from './football-meta'
import type { BaseMatch } from './football-data'

const SDB_BASE = 'https://www.thesportsdb.com/api/v1/json/3'
const WC_LEAGUE_ID = '4429' // FIFA World Cup

export interface SdbInfo {
  venue?: string
  city?: string
  progress?: string      // live minute, e.g. "67"
  homeScore?: number
  awayScore?: number
  status?: string
}

interface SdbEvent {
  idEvent?: string
  idLeague?: string
  strLeague?: string
  strHomeTeam?: string
  strAwayTeam?: string
  strVenue?: string
  strCity?: string
  strCountry?: string
  strProgress?: string
  strStatus?: string
  strTimestamp?: string
  dateEvent?: string
  strTime?: string
  intHomeScore?: string | null
  intAwayScore?: string | null
}

const SDB_LIVE = new Set(['1H', '2H', 'ET', 'HT', 'BT', 'P', 'LIVE'])
const SDB_DONE = new Set(['FT', 'AET', 'PEN', 'Match Finished'])

function sdbStatus(status?: string, progress?: string): 'upcoming' | 'live' | 'finished' {
  const s = (status ?? '').trim()
  if (SDB_DONE.has(s)) return 'finished'
  if (SDB_LIVE.has(s) || (progress && /^\d/.test(progress))) return 'live'
  return 'upcoming'
}

function pairKey(home?: string, away?: string): string {
  return `${normTeam(home)}|${normTeam(away)}`
}

function toInt(v: string | null | undefined): number | undefined {
  if (v == null || v === '') return undefined
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? undefined : n
}

/**
 * Index every WC event on `dateISO` (YYYY-MM-DD) by normalized team pair, in
 * both home|away and away|home order so look-ups are direction-agnostic.
 * Returns {} on any error — purely additive enrichment.
 */
export async function fetchSportsdbDay(dateISO: string): Promise<Record<string, SdbInfo>> {
  try {
    const res = await fetch(`${SDB_BASE}/eventsday.php?d=${dateISO}&s=Soccer`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return {}
    const data = await res.json()
    const events: SdbEvent[] = data?.events ?? []
    const out: Record<string, SdbInfo> = {}
    for (const e of events) {
      const isWc = e.idLeague === WC_LEAGUE_ID || /world cup/i.test(e.strLeague ?? '')
      if (!isWc) continue
      const info: SdbInfo = {
        venue: e.strVenue || undefined,
        city: e.strCity || e.strCountry || undefined,
        progress: e.strProgress || undefined,
        homeScore: toInt(e.intHomeScore),
        awayScore: toInt(e.intAwayScore),
        status: e.strStatus || undefined,
      }
      out[pairKey(e.strHomeTeam, e.strAwayTeam)] = info
      out[pairKey(e.strAwayTeam, e.strHomeTeam)] = info
    }
    return out
  } catch {
    return {}
  }
}

/**
 * Standalone fixtures fallback — rebuild WC matches straight from thesportsdb
 * when football-data.org returns nothing. Less authoritative (no group/crest,
 * looser live status) but keeps the desk populated. Returns [] on error.
 */
export async function fetchSportsdbFixtures(dateISO: string): Promise<BaseMatch[]> {
  try {
    const res = await fetch(`${SDB_BASE}/eventsday.php?d=${dateISO}&s=Soccer`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await res.json()
    const events: SdbEvent[] = data?.events ?? []
    return events
      .filter(e => e.idLeague === WC_LEAGUE_ID || /world cup/i.test(e.strLeague ?? ''))
      .map((e): BaseMatch => {
        const aCode = tlaForName(e.strHomeTeam)
        const bCode = tlaForName(e.strAwayTeam)
        const status = sdbStatus(e.strStatus, e.strProgress)
        const utcDate = e.strTimestamp
          ? `${e.strTimestamp}${e.strTimestamp.endsWith('Z') ? '' : 'Z'}`
          : `${e.dateEvent}T${e.strTime || '00:00:00'}Z`
        return {
          id: matchSlug(aCode, bCode, e.idEvent),
          fdId: e.idEvent ? parseInt(e.idEvent, 10) : 0,
          utcDate,
          fdStatus: status === 'finished' ? 'FINISHED' : status === 'live' ? 'IN_PLAY' : 'TIMED',
          status,
          matchday: 0,
          stage: 'GROUP_STAGE',
          group: '',
          aName: e.strHomeTeam ?? '', aCode, aFlag: flagForTla(aCode), aCrest: '',
          bName: e.strAwayTeam ?? '', bCode, bFlag: flagForTla(bCode), bCrest: '',
          homeGoals: toInt(e.intHomeScore) ?? null,
          awayGoals: toInt(e.intAwayScore) ?? null,
        }
      })
      .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
  } catch {
    return []
  }
}

/** Look up enrichment for a fixture given both team names. */
export function lookupSdb(
  index: Record<string, SdbInfo>,
  homeName: string,
  awayName: string,
): SdbInfo | undefined {
  return index[pairKey(homeName, awayName)]
}
