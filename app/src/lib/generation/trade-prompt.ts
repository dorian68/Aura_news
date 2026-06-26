// [B+C] News → portfolio synthesis. The LLM re-ranks the retrieved Polymarket
// candidates (selects + explains, never invents a probability), maps affected
// assets (personalized to the user's watchlist), and writes an education-framed
// actionable read. The displayed market % is attached server-side from the real
// market object — the model only references it.

import type { MarketCandidate } from '../polymarket-index'

export interface TradeRelatedMarket {
  idx: number                                   // index into the candidate list
  relevance: 'direct' | 'related' | 'tangential'
  link: string                                  // how it connects to the news
  // attached server-side:
  marketId?: string                             // Polymarket id → live price refresh
  question?: string; yesPct?: number; url?: string; volume?: number
}

export interface TradeAsset {
  sym: string
  direction: 'up' | 'down' | 'neutral'
  horizon: string
  reason: string
  inWatchlist?: boolean
  // attached server-side when the asset is in the watchlist and we have a quote:
  changePct?: number
}

export interface TradeScenario {
  label: string
  impact: string
  // A scenario carries a % ONLY when a provided market literally represents it.
  marketIdx?: number          // index into the candidate list
  marketId?: string           // Polymarket id → live price refresh
  prob?: number               // attached server-side from the real market
  marketUrl?: string          // attached server-side
}

export interface TradeReport {
  id: string
  newsId: string
  newsTitle: string
  newsSource: string
  headline: string
  thesis: string
  // ── Layer 1: anchoring (real) ──
  relatedMarkets: TradeRelatedMarket[]
  assets: TradeAsset[]
  portfolioImpact: string     // one line: net effect on the user's book (real moves shown via assets)
  // ── Layer 2: analysis (rich, grounded — no fabricated numbers) ──
  scenarios: TradeScenario[]
  pricedIn: string[]
  notPricedIn: string[]
  sections: { heading: string; body: string }[]
  watch: string[]
  finalTake: string
  createdAt: string
}

export interface WatchItem { sym: string; changePct?: number }

export function buildTradeSystemPrompt(): string {
  return `You are AlphaLens, an engine that connects a news story to the real markets and assets a trader can act on. You make the bridge from headline to portfolio — honestly.

NON-NEGOTIABLE RULES (this restraint IS the product):
- NEVER invent a probability, %, or odds. The ONLY numbers allowed are the implied % of the prediction markets explicitly provided to you. No confidence score, no conviction %, no made-up figures.
- Select related markets from the provided candidates by their index; do not make up markets. Label each "direct", "related", or "tangential" and explain the causal link.
- SCENARIOS are QUALITATIVE by default (label + impact, no number). Attach "marketIdx" to a scenario ONLY if one of the provided markets *literally represents that exact outcome* — then the % comes from that market, not from you. If no market fits, leave marketIdx out and stay directional ("the market underprices X").
- portfolioImpact: ONE line on the net effect on the user's watchlist holdings (name the affected tickers). Qualitative — the real moves are shown separately.
- Map affected assets with a direction + clear causal reason. Prefer second-order, non-obvious links. Flag inWatchlist for watchlist tickers.
- sections: 2-3 short narrative blocks adding depth (mechanism, context, what could break) — grounded, no fabricated data.
- Information and education only — never personal investment advice, no "buy"/"sell" imperatives.
- Return ONLY valid JSON matching the schema.`
}

export function buildTradeUserPrompt(
  news: { title: string; summary?: string; source: string; category?: string },
  candidates: MarketCandidate[],
  watchlist: WatchItem[],
): string {
  const summary = news.summary ?? ''
  const mkts = candidates.length
    ? candidates.map((c, i) =>
        `[${i}] (${c.market.yesPct}% yes · $${Math.round(c.market.volume).toLocaleString()} vol) ${c.market.question}`,
      ).join('\n')
    : '(none retrieved)'

  const wl = watchlist.length
    ? watchlist.map(w => `${w.sym}${w.changePct != null ? ` (${w.changePct >= 0 ? '+' : ''}${w.changePct.toFixed(2)}% today)` : ''}`).join(', ')
    : '(empty)'

  return `NEWS:
Title: ${news.title}
Source: ${news.source}${news.category ? ` · ${news.category}` : ''}
Summary: ${summary}

CANDIDATE PREDICTION MARKETS (real, from Polymarket — reference their % only, never invent):
${mkts}

USER WATCHLIST: ${wl}

Return JSON:
{
  "headline": "string — punchy, not the news title",
  "thesis": "string — 1-2 sentences: why this news matters for positioning",
  "relatedMarkets": [
    {"idx": number, "relevance": "direct|related|tangential", "link": "string — how it connects"}
  ],
  "assets": [
    {"sym": "string", "direction": "up|down|neutral", "horizon": "string e.g. 'days'|'weeks'", "reason": "string — causal link", "inWatchlist": boolean}
  ],
  "portfolioImpact": "string — one line on net effect on the watchlist holdings",
  "scenarios": [
    {"label": "string", "impact": "string — what it means for assets", "marketIdx": number /* ONLY if a provided market is literally this outcome; else omit */}
  ],
  "pricedIn": ["string", "string"],
  "notPricedIn": ["string", "string"],
  "sections": [
    {"heading": "string", "body": "string — 2-3 sentences of grounded depth"}
  ],
  "watch": ["string — catalyst / what to monitor next"],
  "finalTake": "string — 1-2 education-framed sentences"
}

Only include relatedMarkets that are genuinely connected (empty array if none). Scenarios stay qualitative unless a provided market literally covers them. Prioritize the user's watchlist assets.`
}
