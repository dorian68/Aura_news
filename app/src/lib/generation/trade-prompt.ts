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
  keyTakeaways: string[]       // GS-style "key takeaways" en tête de l'article
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
- Map affected assets with a direction + clear causal reason. ALWAYS return at least 2-3 affected, liquid instruments (tickers or ETFs — e.g. USO/XLE for oil, TLT for rates, GLD for gold) even when none are in the user's watchlist; the news→portfolio bridge must not be empty. Prioritize watchlist names when they are genuinely affected, then add the most relevant broad-market instruments. Prefer second-order, non-obvious links. Flag inWatchlist for watchlist tickers.
- keyTakeaways: 3-5 sharp bullet points summarizing the piece (Goldman Sachs "Briefings" style), each a complete, substantive insight.
- sections: this is a HIGH-QUALITY LONG-FORM ARTICLE in the style of Goldman Sachs Research / "Briefings" newsletters. Write 5-6 sections. Each section MUST have a strong heading and a body of 3-4 full paragraphs, and EACH SECTION BODY MUST BE 300-450 WORDS (separate paragraphs with a blank line). The whole article MUST total AT LEAST 1500 words — being brief or terse is a failure of the task; do not stop early. Editorial, authoritative, analytical voice. Cover, across the sections: the core mechanism (why this matters and how it transmits), context and history, the bull case, the bear case, second-order / cross-asset effects, the medium-term outlook, and what could break the thesis. Reference the real markets and assets you selected to ground the reasoning. NO fabricated numbers — the only figures allowed are the provided market % and any real asset moves; otherwise stay qualitative. Substance over filler: every paragraph must add a distinct, non-obvious idea, but develop each idea fully with reasoning, examples and implications.
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
  "keyTakeaways": ["string — 3 to 5 sharp takeaway bullets (GS Briefings style)"],
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
    {"heading": "string", "body": "string — a DEVELOPED long-form section: 2-4 full paragraphs separated by blank lines, GS Research style; mechanism, context, bull/bear, outlook, risks. Grounded, no fabricated numbers."}
  ],
  "watch": ["string — catalyst / what to monitor next"],
  "finalTake": "string — 1-2 education-framed sentences"
}

Only include relatedMarkets that are genuinely connected (empty array if none). Scenarios stay qualitative unless a provided market literally covers them. Always map at least 2-3 affected, liquid assets (tickers or ETFs), even if none are in the watchlist; prioritize watchlist names when they are genuinely affected.

CRITICAL: "sections" must read like a real Goldman Sachs Research briefing — 5 to 6 sections, each section body 300-450 words across 3-4 paragraphs, for a total of AT LEAST 1500 words (aim 1800-2500). This long-form article is the centerpiece of the report; a short or summarized version is a failed response. Write it in full.`
}
