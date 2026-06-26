// Correct-score model — independent Poisson on each team's goals.
//
// Expected goals (λ) come from a team-strength differential; the same λ drive
// both the 1X2 outcome and the scoreline distribution, so the card's headline
// and the drawer always agree. For an in-play match the model conditions on the
// current score and the minutes remaining (future goals ~ Poisson(λ · remain)).

export interface ScoreLine { home: number; away: number; prob: number }

export interface ScoreProbs {
  lambdaHome: number
  lambdaAway: number
  base?: { home: number; away: number } // live score the distribution is anchored on
  scores: ScoreLine[]                    // top scorelines, prob desc
  outcome: { a: number; draw: number; b: number }
}

const BASE_GOALS = 1.35   // avg goals per team in a neutral match
const STRENGTH_K = 0.32   // strength → goals sensitivity
const HOME_ADV_GOALS = 0.10
const MAX_GOALS = 6       // grid cap per team
const TOP_N = 7

function factorial(n: number): number {
  let f = 1
  for (let i = 2; i <= n; i++) f *= i
  return f
}

function poissonPmf(k: number, lambda: number): number {
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k)
}

function clampLambda(x: number): number {
  return Math.min(4.5, Math.max(0.15, x))
}

/** Strength differential (sA−sB, already centered) → per-team expected goals. */
export function teamLambdas(sA: number, sB: number): { home: number; away: number } {
  const diff = sA - sB
  return {
    home: clampLambda(BASE_GOALS * Math.exp(STRENGTH_K * diff + HOME_ADV_GOALS)),
    away: clampLambda(BASE_GOALS * Math.exp(-STRENGTH_K * diff)),
  }
}

function round3(a: number, draw: number, b: number) {
  let ra = Math.round(a * 100)
  let rd = Math.round(draw * 100)
  let rb = 100 - ra - rd
  if (rb < 0) { rb = 0; const s = ra + rd || 1; ra = Math.round((ra / s) * 100); rd = 100 - ra }
  return { a: ra, draw: rd, b: rb }
}

interface ComputeOpts {
  sA: number
  sB: number
  isLive?: boolean
  currentHome?: number
  currentAway?: number
  minute?: number
}

/**
 * Full correct-score distribution + derived 1X2. Live matches are conditioned
 * on the current score and remaining time; pre-match starts from 0-0 over 90'.
 */
export function computeScoreProbs(opts: ComputeOpts): ScoreProbs {
  const { sA, sB, isLive } = opts
  const full = teamLambdas(sA, sB)

  const baseH = isLive ? (opts.currentHome ?? 0) : 0
  const baseA = isLive ? (opts.currentAway ?? 0) : 0
  const remain = isLive ? Math.min(1, Math.max(0.02, (90 - (opts.minute ?? 0)) / 90)) : 1

  // Goals still to come for each side over the remaining fraction of the match.
  const lh = full.home * remain
  const la = full.away * remain

  const homePmf = Array.from({ length: MAX_GOALS + 1 }, (_, k) => poissonPmf(k, lh))
  const awayPmf = Array.from({ length: MAX_GOALS + 1 }, (_, k) => poissonPmf(k, la))

  const lines: ScoreLine[] = []
  let pA = 0, pDraw = 0, pB = 0
  for (let h = 0; h <= MAX_GOALS; h++) {
    for (let a = 0; a <= MAX_GOALS; a++) {
      const prob = homePmf[h] * awayPmf[a]
      const finalH = baseH + h
      const finalA = baseA + a
      lines.push({ home: finalH, away: finalA, prob })
      if (finalH > finalA) pA += prob
      else if (finalH === finalA) pDraw += prob
      else pB += prob
    }
  }

  const total = pA + pDraw + pB || 1
  const scores = lines
    .sort((x, y) => y.prob - x.prob)
    .slice(0, TOP_N)
    .map(s => ({ ...s, prob: Math.round((s.prob / total) * 1000) / 10 })) // 1-decimal %

  return {
    lambdaHome: Math.round(full.home * 100) / 100,
    lambdaAway: Math.round(full.away * 100) / 100,
    base: isLive ? { home: baseH, away: baseA } : undefined,
    scores,
    outcome: round3(pA / total, pDraw / total, pB / total),
  }
}
