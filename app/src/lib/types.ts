export interface Chip {
  sym: string
  chg: string
  bg: string
  col: string
  bd: string
}

export interface NewsItem {
  id: string
  title: string
  dek?: string
  summary?: string
  source: string
  time?: string
  publishedAt?: string
  category?: string
  section?: string        // editorial rubric: Markets / Macro / World / Tech / Crypto / Deals
  tickers?: string[]
  chips?: Chip[]
  intensity?: number
}

export interface WCMatch {
  id: string
  group: string
  phase: string
  aName: string; aFlag: string; aCode: string
  bName: string; bFlag: string; bCode: string
  time: string
  status: 'upcoming' | 'live' | 'finished'
  score: string
  minute?: string
  venue: string; city: string
  probA: number; probDraw: number; probB: number
  crowdA: number; crowdDraw: number; crowdB: number
  signal?: string
  momentum?: string
  feed?: { time: string; text: string; icon: string }[]
  // Enrichment (optional, populated when live data is available)
  aCrest?: string; bCrest?: string
  utcDate?: string
  sources?: string[]        // which data providers contributed
  edge?: number             // AlphaLens(A) − crowd(A), percentage points
  // Probability detail (drives the in-card drawer)
  scoreProbs?: import('./score-model').ScoreProbs   // model correct-score dist
  crowdScores?: import('./score-model').ScoreLine[] // market correct-score, if any
  marketSource?: 'polymarket' | 'reputation'        // where the 1X2 "crowd" came from
}

export interface MatchWarmup {
  id: string
  matchId: string
  angleId: string
  createdAt: string
  title: string
  subtitle: string
  executiveSummary: string
  probA: number; probDraw: number; probB: number
  alphaA: number; alphaDraw: number; alphaB: number
  gap: string; gapNote: string
  scenarios: { label: string; prob: number; detail: string }[]
  keyBattles: { topic: string; edge: string; winner: string }[]
  teamForm: { team: string; last5: string; note: string }[]
  marketImplications: { asset: string; direction: string; reason: string }[]
  finalTake: string
  confPct: string
  aName: string; bName: string; aFlag: string; bFlag: string
  score?: string; status?: string
}
