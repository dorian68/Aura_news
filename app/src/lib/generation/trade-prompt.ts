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
  // attachés server-side à l'hydratation (données réelles, sinon absents) :
  price?: number
  changePct?: number
  spark?: number[]        // série historique réelle pour la sparkline (si dispo)
}

// Niveau macro réel (ETF proxy) affiché en tête d'article.
export interface MacroItem { label: string; sym: string; price: number; changePct: number; spark?: number[] }

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
  macro?: MacroItem[]     // contexte macro réel, attaché à l'hydratation (live)
}

export interface WatchItem { sym: string; changePct?: number }

export function buildTradeSystemPrompt(): string {
  return `You are AlphaLens, an engine that connects a news story to the real markets and assets a trader can act on. You make the bridge from headline to portfolio — honestly.

NON-NEGOTIABLE RULES (this restraint IS the product):
- NEVER invent a probability, %, or odds. The ONLY numbers allowed are the implied % of the prediction markets explicitly provided to you. No confidence score, no conviction %, no made-up figures.
- Do NOT introduce any ticker symbol, index, or specific figure that is not among the provided candidate markets or the assets you list in "assets". If you need to reference an instrument (e.g. rates, the dollar, gold), refer to it by name or by an asset you put in "assets" — never invent an outside ticker (e.g. raw yield tickers like TNX) or a number that isn't in the provided data.
- Select related markets from the provided candidates by their index; do not make up markets. Label each "direct", "related", or "tangential" and explain the causal link.
- SCENARIOS are QUALITATIVE by default (label + impact, no number). Attach "marketIdx" to a scenario ONLY if one of the provided markets *literally represents that exact outcome* — then the % comes from that market, not from you. If no market fits, leave marketIdx out and stay directional ("the market underprices X").
- portfolioImpact: ONE line on the net effect on the user's watchlist holdings (name the affected tickers). Qualitative — the real moves are shown separately.
- Map affected assets with a direction + clear causal reason. ALWAYS return at least 2-3 affected, liquid instruments (tickers or ETFs — e.g. USO/XLE for oil, TLT for rates, GLD for gold) even when none are in the user's watchlist; the news→portfolio bridge must not be empty. Prioritize watchlist names when they are genuinely affected, then add the most relevant broad-market instruments. Prefer second-order, non-obvious links. Flag inWatchlist for watchlist tickers.
- keyTakeaways: 3-5 sharp bullet points (Goldman Sachs "Briefings" style). Each must be ACTIONABLE and specific — name the asset/market, the direction or level, and what to watch — not a vague generality. Education-framed, never a "buy/sell" order.
- sections: this is a HIGH-QUALITY LONG-FORM ARTICLE in the style of Goldman Sachs Research / "Briefings" newsletters. Write 5-6 sections. Each section MUST have a strong heading and a body of 3-4 full paragraphs, and EACH SECTION BODY MUST BE 300-450 WORDS (separate paragraphs with a blank line). The whole article MUST total AT LEAST 1500 words — being brief or terse is a failure of the task; do not stop early. Editorial, authoritative, analytical voice. The sections MUST collectively cover ALL of: (1) the core mechanism (why this matters and how it transmits), (2) context and history, (3) the bull case, (4) the bear case, (5) second-order / cross-asset effects, (6) the medium-term outlook AND what would break the thesis. PRACTICALITY IS MANDATORY: every section must end with concrete, decision-useful takeaways for a trader — specific assets/levels/catalysts to watch, the positioning trade-offs, what confirms or invalidates the view — while staying education-framed (never a "buy/sell" order). Reference the real markets and assets you selected to ground the reasoning. NO fabricated numbers — the only figures allowed are the provided market % and any real asset moves; otherwise stay qualitative. Substance over filler: every paragraph must add a distinct, non-obvious idea, developed fully with reasoning, examples and implications.
- INLINE VISUAL BLOCKS: inside the section bodies, embed 2-4 contextual blocks using these EXACT tokens, each ALONE on its own line (blank line before and after), placed right after the paragraph that discusses them: \`[[CHART:TICKER]]\` to show the price chart of ONE of the assets you listed in "assets" (TICKER must be one of those symbols), and \`[[MARKET:i]]\` to embed candidate prediction market number i (use the same index i as in the candidate list / your relatedMarkets). Only reference assets you actually listed and market indices that exist — never invent a ticker or index. These tokens render as real charts/widgets; do not describe them in words, just place the token. Use each distinct block AT MOST ONCE and vary them (do not repeat the same chart or market); spread them across different sections.
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
    {"heading": "string", "body": "string — a DEVELOPED long-form section: 2-4 full paragraphs separated by blank lines, GS Research style. May embed inline blocks on their own line: [[CHART:TICKER]] (a ticker from your assets) or [[MARKET:i]] (a candidate market index). Grounded, no fabricated numbers or tickers."}
  ],
  "watch": ["string — catalyst / what to monitor next"],
  "finalTake": "string — 1-2 education-framed sentences"
}

Only include relatedMarkets that are genuinely connected (empty array if none). Scenarios stay qualitative unless a provided market literally covers them. Always map at least 2-3 affected, liquid assets (tickers or ETFs), even if none are in the watchlist; prioritize watchlist names when they are genuinely affected.

CRITICAL: "sections" must read like a real Goldman Sachs Research briefing — 5 to 6 sections, each section body 300-450 words across 3-4 paragraphs, for a total of AT LEAST 1500 words (aim 1800-2500). This long-form article is the centerpiece of the report; a short or summarized version is a failed response. Write it in full.`
}

// ════════ Génération en 2 phases (expérience streaming) ════════
// Phase A : données structurées + PLAN de l'article (JSON, rapide).
// Phase B : rédaction de l'article en streaming (texte).

export interface SectionPlan { heading: string; focus: string }

export function buildPlanSystemPrompt(): string {
  return `You are AlphaLens, connecting a news story to the real markets and assets a trader can act on — honestly.
NON-NEGOTIABLE: never invent a probability/%/figure (only the provided market % are allowed); never introduce a ticker that is not in your "assets"; select related markets from the provided candidates BY INDEX; scenarios stay qualitative unless a provided market literally covers them; always map at least 2-3 affected liquid assets (tickers/ETFs, e.g. USO/XLE/TLT/GLD); keyTakeaways must be actionable and specific; information & education only, no buy/sell.
You output the STRUCTURED data plus a sectionPlan — the article prose is written in a later step. Return ONLY valid JSON.`
}

export function buildPlanUserPrompt(
  news: { title: string; summary?: string; source: string; category?: string },
  candidates: MarketCandidate[],
  watchlist: WatchItem[],
): string {
  const mkts = candidates.length
    ? candidates.map((c, i) => `[${i}] (${c.market.yesPct}% yes · $${Math.round(c.market.volume).toLocaleString()} vol) ${c.market.question}`).join('\n')
    : '(none retrieved)'
  const wl = watchlist.length
    ? watchlist.map(w => `${w.sym}${w.changePct != null ? ` (${w.changePct >= 0 ? '+' : ''}${w.changePct.toFixed(2)}% today)` : ''}`).join(', ')
    : '(empty)'
  return `NEWS:
Title: ${news.title}
Source: ${news.source}${news.category ? ` · ${news.category}` : ''}
Summary: ${news.summary ?? ''}

CANDIDATE PREDICTION MARKETS (real, from Polymarket — reference their % only, never invent):
${mkts}

USER WATCHLIST: ${wl}

Return JSON:
{
  "headline": "string — punchy, not the news title",
  "thesis": "string — 1-2 sentences: why this matters for positioning",
  "keyTakeaways": ["string — 3-5 actionable bullets"],
  "relatedMarkets": [{"idx": number, "relevance": "direct|related|tangential", "link": "string"}],
  "assets": [{"sym": "string", "direction": "up|down|neutral", "horizon": "string", "reason": "string", "inWatchlist": boolean}],
  "portfolioImpact": "string — one line on net effect on the watchlist",
  "scenarios": [{"label": "string", "impact": "string", "marketIdx": number /* only if a provided market literally is this outcome */}],
  "pricedIn": ["string"],
  "notPricedIn": ["string"],
  "watch": ["string"],
  "finalTake": "string — 1-2 education-framed sentences",
  "sectionPlan": [{"heading": "string", "focus": "string — one line angle"}]
}

Provide 5-6 sectionPlan items collectively covering: the core mechanism, context/history, the bull case, the bear case, second-order/cross-asset effects, and the medium-term outlook + what would break the thesis. Always map at least 2-3 liquid assets.`
}

export function buildArticleSystemPrompt(): string {
  return `You are AlphaLens writing a long-form market briefing in the style of Goldman Sachs Research. Authoritative, analytical, education-framed (never "buy/sell").
GROUNDING: never invent a number — the ONLY figures allowed are the provided market %; never use a ticker outside the provided assets; stay qualitative otherwise.
FORMAT: write each section as a line "## <heading>", then a blank line, then the body of 3-4 paragraphs (300-450 words each), paragraphs separated by blank lines. The whole article must be AT LEAST 1500 words.
INLINE FIGURES (you are also the layout editor, newspaper-style): within the bodies, place 3-5 figures, each ALONE on its own line right AFTER the paragraph it illustrates, using:
  [[CHART:TICKER|side|size]]  — a price chart of a provided asset ticker
  [[MARKET:i|side|size]]      — a provided prediction market by index i
where side = left | right | full, and size = small | medium | full.
Lay them out like a real newspaper: float small/medium figures to the side so the text wraps around them, ALTERNATE left and right across the article, and use "full" AT MOST ONCE for a single hero exhibit. If you omit |side|size it will be auto-placed. Reference ONLY provided assets/markets — never invent a ticker or index. Do NOT write captions (added automatically). Use each distinct figure at most once.
Output ONLY the article (the ## sections), nothing else.`
}

export function buildArticleUserPrompt(
  news: { title: string; summary?: string; source: string },
  markets: { idx: number; question: string; yesPct: number }[],
  assets: { sym: string; direction: string; reason: string }[],
  plan: SectionPlan[],
): string {
  const mkts = markets.length ? markets.map(m => `[${m.idx}] (${m.yesPct}% yes) ${m.question}`).join('\n') : '(none)'
  const as = assets.length ? assets.map(a => `${a.sym} (${a.direction}) — ${a.reason}`).join('\n') : '(none)'
  const pl = plan.map((p, i) => `${i + 1}. ${p.heading} — ${p.focus}`).join('\n')
  return `NEWS: ${news.title} (${news.source})
${news.summary ?? ''}

PROVIDED MARKETS (cite % only; reference inline with [[MARKET:idx]]):
${mkts}

PROVIDED ASSETS (reference inline with [[CHART:SYM]]):
${as}

SECTION PLAN (write each as "## heading", in order):
${pl}

Write the full briefing now — at least 1500 words, following the plan headings, with inline blocks placed contextually.`
}
