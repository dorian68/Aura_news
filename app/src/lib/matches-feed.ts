// Aggregator — merges the data sources into WCMatch[] and attaches the
// probability model that powers the in-card drawer.
//
//   football-data.org  → authoritative fixtures / scores / status / form
//   thesportsdb        → venue + live fallback + standalone fixtures (keyless)
//   api-football       → exact minute, event feed, momentum (optional)
//   polymarket         → 1X2 "market" when a match market exists (opportunistic)
//
// AlphaLens probabilities (1X2 + correct score) come from one Poisson model
// (score-model.ts) fed by a team-strength differential. The "crowd" baseline is
// reputation, or a real Polymarket market when available. The gap is the edge.

import type { WCMatch } from './types'
import { fetchFdMatches, fetchFdStandings, type BaseMatch, type FdStandingRow } from './football-data'
import { fetchSportsdbDay, fetchSportsdbFixtures, lookupSdb, type SdbInfo } from './thesportsdb'
import { fetchApiFootballDay, lookupAf, type AfInfo } from './api-football'
import { fetchWcMarkets, lookupWcMarket, type WcMarket } from './polymarket-wc'
import { computeScoreProbs, type ScoreLine } from './score-model'

// ── FIFA-ranking-ish reputation tiers (crowd/consensus baseline) ──
const REPUTATION: Record<string, number> = {
  BRA: 5, FRA: 5, ARG: 5, ESP: 5, ENG: 5, POR: 4.8, GER: 4.8, NED: 4.6, BEL: 4.5,
  CRO: 4.2, URU: 4.2, COL: 4.2, MAR: 4.1, USA: 4, MEX: 4, JPN: 4, SUI: 3.9, SEN: 3.9, KOR: 3.8,
  ECU: 3.7, AUS: 3.6, NOR: 3.6, AUT: 3.6, SWE: 3.6, TUR: 3.6, EGY: 3.5, CIV: 3.5, IRN: 3.5, CAN: 3.5, PAR: 3.4,
  QAT: 3, KSA: 3, TUN: 3.2, ALG: 3.3, GHA: 3.2, SCO: 3.3, PAN: 3, NZL: 3, UZB: 3, IRQ: 3,
  JOR: 3, CPV: 2.9, COD: 3.1, BIH: 3.2, HAI: 2.8, CUW: 2.7, RSA: 3.1,
}
const REP_DEFAULT = 3.2

// Strength centered around 0, bounded so Poisson λ stays sane.
function clampStrength(x: number): number {
  return Math.min(2.2, Math.max(-2.2, x))
}

function reputationStrength(code: string): number {
  return clampStrength((REPUTATION[code] ?? REP_DEFAULT) - REP_DEFAULT)
}

/** Blended team strength: live tournament form (if any) over reputation. */
function teamStrength(code: string, standings: Record<string, FdStandingRow>): number {
  const rep = reputationStrength(code)
  const row = standings[code]
  if (!row || row.playedGames === 0) return rep
  const ppg = row.points / row.playedGames                 // 0..3
  const gdpg = row.goalDifference / row.playedGames         // ~ -4..4
  const form = (ppg - 1.0) * 0.6 + gdpg * 0.22             // centered ~ -2..2
  return clampStrength(0.6 * form + 0.4 * rep)
}

function buildSignal(aCode: string, bCode: string, edge: number): string | undefined {
  const ABS = 6
  if (Math.abs(edge) < ABS) return undefined
  if (edge >= ABS) return `ALPHALENS OVERWEIGHTS ${aCode} (+${Math.round(edge)} vs CROWD)`
  return `ALPHALENS OVERWEIGHTS ${bCode} (+${Math.round(-edge)} vs CROWD)`
}

function elapsedMinutes(afInfo?: AfInfo, sdbInfo?: SdbInfo, utcDate?: string): number | undefined {
  if (typeof afInfo?.elapsed === 'number') return afInfo.elapsed
  if (sdbInfo?.progress && /^\d+/.test(sdbInfo.progress)) return parseInt(sdbInfo.progress, 10)
  if (utcDate) {
    const mins = Math.floor((Date.now() - new Date(utcDate).getTime()) / 60000)
    if (mins >= 0 && mins <= 130) return Math.min(mins, 90)
  }
  return undefined
}

function scoreString(home: number | null | undefined, away: number | null | undefined): string {
  if (home == null || away == null) return '– – –'
  return `${home} – ${away}`
}

function localTime(utcDate: string): string {
  try {
    return new Date(utcDate).toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false,
    })
  } catch { return '' }
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Merge one base match with the enrichment indexes into a full WCMatch. */
function assemble(
  base: BaseMatch,
  standings: Record<string, FdStandingRow>,
  sdb: Record<string, SdbInfo>,
  af: Record<string, AfInfo>,
  poly: Record<string, WcMarket>,
): WCMatch {
  const sdbInfo = lookupSdb(sdb, base.aName, base.bName)
  const afInfo = af[`${normPair(base.aName, base.bName)}`]

  const sources = ['football-data.org']
  if (sdbInfo) sources.push('thesportsdb')
  if (afInfo) sources.push('api-football')

  const home = base.homeGoals ?? afInfo?.homeScore ?? sdbInfo?.homeScore ?? null
  const away = base.awayGoals ?? afInfo?.awayScore ?? sdbInfo?.awayScore ?? null

  const isLive = base.status === 'live' || afInfo?.live === true
  const minuteNum = isLive ? elapsedMinutes(afInfo, sdbInfo, base.utcDate) : undefined

  // ── Probability model (1X2 + correct score from one Poisson) ──
  const sA = teamStrength(base.aCode, standings)
  const sB = teamStrength(base.bCode, standings)
  const model = computeScoreProbs({
    sA, sB, isLive,
    currentHome: home ?? 0, currentAway: away ?? 0, minute: minuteNum,
  })

  // Crowd: real Polymarket market if found, else reputation Poisson.
  const wc = lookupWcMarket(poly, base.aCode, base.bCode)
  const polyOutcome = wcMoneyline(wc, base.aCode, base.bCode)
  const crowd = polyOutcome ?? computeScoreProbs({
    sA: reputationStrength(base.aCode), sB: reputationStrength(base.bCode),
  }).outcome
  if (polyOutcome) sources.push('polymarket')
  const crowdScores = wcCrowdScores(wc, base.aCode)
  const edge = model.outcome.a - crowd.a

  const m: WCMatch = {
    id: base.id,
    group: base.group,
    phase: base.stage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    aName: base.aName, aFlag: base.aFlag, aCode: base.aCode, aCrest: base.aCrest,
    bName: base.bName, bFlag: base.bFlag, bCode: base.bCode, bCrest: base.bCrest,
    time: localTime(base.utcDate),
    status: isLive ? 'live' : base.status,
    score: scoreString(home, away),
    minute: isLive && typeof minuteNum === 'number' ? `${minuteNum}'` : undefined,
    venue: sdbInfo?.venue ?? '',
    city: sdbInfo?.city ?? '',
    probA: model.outcome.a, probDraw: model.outcome.draw, probB: model.outcome.b,
    crowdA: crowd.a, crowdDraw: crowd.draw, crowdB: crowd.b,
    utcDate: base.utcDate,
    sources,
    edge: Math.round(edge),
    scoreProbs: model,
    crowdScores,
    marketSource: polyOutcome ? 'polymarket' : 'reputation',
  }
  m.signal = buildSignal(base.aCode, base.bCode, edge)
  if (afInfo?.feed?.length) m.feed = afInfo.feed
  if (isLive && typeof afInfo?.momentumHome === 'number') {
    m.momentum = `${base.aCode} ${afInfo.momentumHome}% — ${base.bCode} ${100 - afInfo.momentumHome}%`
  }
  return m
}

function round3frac(a: number, draw: number, b: number) {
  let ra = Math.round(a * 100), rd = Math.round(draw * 100)
  let rb = 100 - ra - rd
  if (rb < 0) { rb = 0; const s = ra + rd || 1; ra = Math.round((ra / s) * 100); rd = 100 - ra }
  return { a: ra, draw: rd, b: rb }
}

// Real Polymarket 1X2 oriented to our a/b, or undefined if no moneyline market.
function wcMoneyline(wc: WcMarket | undefined, aCode: string, bCode: string) {
  if (!wc?.winByTla) return undefined
  const wa = wc.winByTla[aCode], wb = wc.winByTla[bCode]
  if (wa == null || wb == null) return undefined
  const dr = wc.draw ?? Math.max(0, 1 - wa - wb)
  const sum = wa + wb + dr || 1
  return round3frac(wa / sum, dr / sum, wb / sum)
}

// Real Polymarket exact-score distribution oriented to our a/b, top 7. undefined if none.
function wcCrowdScores(wc: WcMarket | undefined, aCode: string): ScoreLine[] | undefined {
  if (!wc?.scores?.length) return undefined
  const flip = wc.homeTla !== aCode
  const oriented = wc.scores.map(s => flip
    ? { home: s.away, away: s.home, prob: s.prob }
    : { home: s.home, away: s.away, prob: s.prob })
  const tot = oriented.reduce((x, s) => x + s.prob, 0) || 1
  return oriented
    .map(s => ({ home: s.home, away: s.away, prob: Math.round((s.prob / tot) * 1000) / 10 }))
    .sort((x, y) => y.prob - x.prob)
    .slice(0, 7)
}

// Local pair-key matching the normalization used by the enrichment indexes.
function normPair(a: string, b: string): string {
  const n = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/\b(fc|national team|the)\b/g, '').replace(/[^a-z0-9]/g, '')
  return `${n(a)}|${n(b)}`
}

/**
 * Top-level: assemble today's WC matches from all available sources
 * (football-data → thesportsdb). Returns [] if every live source is empty.
 */
export async function getMatches(): Promise<{ matches: WCMatch[]; live: boolean }> {
  const token = process.env.FOOTBALL_DATA_API_KEY
  if (!token) return { matches: [], live: false }

  const now = new Date()
  const today = ymd(now)
  const tomorrow = ymd(new Date(now.getTime() + 24 * 3600 * 1000))

  const [fdToday, standings] = await Promise.all([
    fetchFdMatches(token, today, tomorrow),
    fetchFdStandings(token),
  ])

  let base = fdToday
  if (!base.length) {
    const week = ymd(new Date(now.getTime() + 7 * 24 * 3600 * 1000))
    base = await fetchFdMatches(token, today, week)
  }
  if (!base.length) {
    const sdbFix = (await Promise.all([today, tomorrow].map(fetchSportsdbFixtures))).flat()
    const seen = new Set<string>()
    base = sdbFix.filter(m => !seen.has(m.id) && seen.add(m.id))
  }
  if (!base.length) return { matches: [], live: false }

  const dates = [...new Set(base.map(b => b.utcDate.slice(0, 10)))]
  const [sdbDays, afDays, poly] = await Promise.all([
    Promise.all(dates.map(d => fetchSportsdbDay(d))),
    Promise.all(dates.map(d => fetchApiFootballDay(process.env.API_FOOTBALL_KEY, d))),
    fetchWcMarkets(),
  ])
  const sdb = Object.assign({}, ...sdbDays) as Record<string, SdbInfo>
  const af = Object.assign({}, ...afDays) as Record<string, AfInfo>

  const matches = base.map(b => assemble(b, standings, sdb, af, poly))
  const live = matches.some(m => m.status === 'live')
  return { matches, live }
}
