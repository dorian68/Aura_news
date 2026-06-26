export const ANGLES: Record<string, { label: string; description: string; prompt: string }> = {
  macro: {
    label: 'Macro & rates',
    description: 'Fed, BCE, taux, inflation, croissance',
    prompt: 'Focus on macro implications: central bank reactions, rate curve impact, currency moves, and recession probabilities.',
  },
  fx: {
    label: 'FX & currencies',
    description: 'Dollar, euro, yen, carry trades',
    prompt: 'Analyze currency impacts: carry trades, safe haven flows, and cross-rate dislocations.',
  },
  equities: {
    label: 'Equities',
    description: 'Secteurs, earnings, multiples, rotations',
    prompt: 'Analyze equity implications: sector rotations, valuation multiples, earnings revisions, and individual stock impacts.',
  },
  commodities: {
    label: 'Commodities',
    description: 'Or, pétrole, métaux, soft commodities',
    prompt: 'Focus on commodity markets: supply-demand imbalances, futures curve, and commodity-linked currencies.',
  },
  credit: {
    label: 'Credit & bonds',
    description: 'Spreads, investment grade, high yield, sovereigns',
    prompt: 'Analyze credit markets: spread widening/tightening, default risk, sovereign spreads, and yield curve dynamics.',
  },
  volatility: {
    label: 'Volatility & options',
    description: 'VIX, skew, term structure, hedges',
    prompt: 'Focus on volatility implications: VIX spikes, options skew, term structure, and hedging strategies.',
  },
  crypto: {
    label: 'Crypto',
    description: 'BTC, ETH, risk appetite, on-chain',
    prompt: 'Analyze crypto market implications: risk sentiment spillover, Bitcoin correlation, and on-chain indicators.',
  },
  geopolitical: {
    label: 'Geopolitical',
    description: 'Risques géopolitiques, sanctions, flux',
    prompt: 'Focus on geopolitical risk: sanction effects, commodity supply disruptions, and safe haven flows.',
  },
  technical: {
    label: 'Technical levels',
    description: 'Supports, résistances, momentum, positionnement',
    prompt: 'Analyze key technical levels: support/resistance, momentum indicators, and positioning data.',
  },
  ai_select: {
    label: 'AlphaLens selects',
    description: 'L\'angle le plus pertinent selon l\'IA',
    prompt: 'Choose the most market-relevant angle for this event and analyze it comprehensively.',
  },
}

export function buildSystemPrompt(): string {
  return `You are AlphaLens, a financial intelligence engine that transforms news into priced market events.

Your job is to analyze a financial news article and return a structured JSON report that:
1. Determines what probability the market is implying for the key event
2. Computes what AlphaLens's fair probability is (your independent assessment)
3. Identifies what IS priced in vs. what is NOT yet priced
4. Models scenarios with probabilities
5. Maps asset impacts clearly

Rules:
- Be precise and quantitative. Never be vague.
- Express probabilities as integers 0-100
- Identify the single most important event being priced
- Scenarios must sum to ~100%
- finalTake must be 1-2 actionable sentences
- Return ONLY valid JSON matching the schema exactly`
}

export function buildUserPrompt(article: { title: string; summary: string; url: string }, angleName: string): string {
  const angle = ANGLES[angleName]
  return `NEWS ARTICLE:
Title: ${article.title}
Summary: ${article.summary}
Source: ${article.url}

ANALYSIS ANGLE: ${angle.label}
${angle.prompt}

Return a JSON object with this exact structure:
{
  "title": "string — punchy event title (not the article title)",
  "subtitle": "string — one sharp sentence on why this matters",
  "executiveSummary": "string — 2-3 sentences",
  "snapshot": {
    "event": "string — the specific event being priced (e.g. 'Fed cuts 50bps in September')",
    "impact": "string — direction e.g. 'Bearish USD, Bullish Gold'",
    "horizon": "string — e.g. '1-4 weeks'"
  },
  "pred": {
    "yes": number,
    "no": number,
    "alpha": number,
    "gap": "string e.g. '+8 pts'",
    "compareNote": "string — one line on the divergence"
  },
  "confPct": "string e.g. '74%'",
  "confReasons": ["string", "string", "string"],
  "pricedIn": ["string", "string", "string"],
  "notPricedIn": ["string", "string"],
  "scenarios": [
    {"label": "string", "prob": number, "impact": "string", "assets": ["string"]}
  ],
  "assets": [
    {"sym": "string", "name": "string", "direction": "up|down|neutral", "magnitude": "string e.g. '+1.5%'", "reason": "string"}
  ],
  "risks": [
    {"label": "string", "severity": "high|medium|low"}
  ],
  "finalTake": "string — 1-2 actionable sentences",
  "sections": [
    {"heading": "string", "body": "string"}
  ],
  "sources": [
    {"name": "string", "url": "string"}
  ]
}`
}
