// Primary source of truth — football-data.org (FIFA World Cup, code "WC").
// Free tier: fixtures, scores, half-time, group/stage, team crests. No venue,
// no odds, no minute. Those gaps are filled by thesportsdb / api-football.

import { flagForTla, matchSlug } from './football-meta'

const FD_BASE = 'https://api.football-data.org/v4'

export type FdStatus =
  | 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED'
  | 'SUSPENDED' | 'POSTPONED' | 'CANCELLED' | 'AWARDED'

export interface FdTeam {
  id: number; name: string; shortName: string; tla: string; crest: string
}

export interface FdMatch {
  id: number
  utcDate: string
  status: FdStatus
  matchday: number
  stage: string
  group: string | null
  homeTeam: FdTeam
  awayTeam: FdTeam
  score: {
    winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null
    fullTime: { home: number | null; away: number | null }
    halfTime: { home: number | null; away: number | null }
  }
}

// Normalized shape consumed by the aggregator.
export interface BaseMatch {
  id: string
  fdId: number
  utcDate: string
  fdStatus: FdStatus
  status: 'upcoming' | 'live' | 'finished'
  matchday: number
  stage: string
  group: string
  aName: string; aFlag: string; aCode: string; aCrest: string
  bName: string; bFlag: string; bCode: string; bCrest: string
  homeGoals: number | null
  awayGoals: number | null
}

function headers(token: string): HeadersInit {
  return { 'X-Auth-Token': token }
}

export function mapFdStatus(s: FdStatus): 'upcoming' | 'live' | 'finished' {
  if (s === 'IN_PLAY' || s === 'PAUSED') return 'live'
  if (s === 'FINISHED' || s === 'AWARDED') return 'finished'
  return 'upcoming'
}

export function prettyGroup(group: string | null, stage: string): string {
  if (group) return group.replace('GROUP_', 'Group ').replace(/_/g, ' ')
  return stage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function toBase(m: FdMatch): BaseMatch {
  return {
    id: matchSlug(m.homeTeam.tla, m.awayTeam.tla, String(m.id)),
    fdId: m.id,
    utcDate: m.utcDate,
    fdStatus: m.status,
    status: mapFdStatus(m.status),
    matchday: m.matchday,
    stage: m.stage,
    group: prettyGroup(m.group, m.stage),
    aName: m.homeTeam.name, aCode: m.homeTeam.tla, aFlag: flagForTla(m.homeTeam.tla), aCrest: m.homeTeam.crest,
    bName: m.awayTeam.name, bCode: m.awayTeam.tla, bFlag: flagForTla(m.awayTeam.tla), bCrest: m.awayTeam.crest,
    homeGoals: m.score.fullTime.home,
    awayGoals: m.score.fullTime.away,
  }
}

/** Fetch WC matches in [dateFrom, dateTo] (YYYY-MM-DD). Returns [] on any error. */
export async function fetchFdMatches(
  token: string,
  dateFrom: string,
  dateTo: string,
): Promise<BaseMatch[]> {
  try {
    const res = await fetch(
      `${FD_BASE}/competitions/WC/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
      { headers: headers(token), next: { revalidate: 30 } },
    )
    if (!res.ok) return []
    const data = await res.json()
    const matches: FdMatch[] = data?.matches ?? []
    return matches
      .map(toBase)
      .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
  } catch {
    return []
  }
}

export interface FdStandingRow {
  tla: string
  position: number
  playedGames: number
  won: number; draw: number; lost: number
  points: number
  goalsFor: number; goalsAgainst: number; goalDifference: number
}

/** Per-team tournament form from the WC standings. Keyed by TLA. [] on error. */
export async function fetchFdStandings(token: string): Promise<Record<string, FdStandingRow>> {
  try {
    const res = await fetch(`${FD_BASE}/competitions/WC/standings`, {
      headers: headers(token),
      next: { revalidate: 120 },
    })
    if (!res.ok) return {}
    const data = await res.json()
    const out: Record<string, FdStandingRow> = {}
    for (const group of data?.standings ?? []) {
      if (group.type !== 'TOTAL') continue
      for (const row of group.table ?? []) {
        const tla: string = row.team?.tla
        if (!tla) continue
        out[tla] = {
          tla,
          position: row.position,
          playedGames: row.playedGames,
          won: row.won, draw: row.draw, lost: row.lost,
          points: row.points,
          goalsFor: row.goalsFor,
          goalsAgainst: row.goalsAgainst,
          goalDifference: row.goalDifference,
        }
      }
    }
    return out
  } catch {
    return {}
  }
}
