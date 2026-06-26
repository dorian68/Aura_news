import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { searchMarkets } from '@/lib/market-search'

// Real "Ask AlphaLens" turn: retrieve the related Polymarket markets, then one
// grounded LLM pass → intro + drivers + an AlphaLens read (real market YES vs
// AlphaLens's own fair value) + sources + follow-ups. Education-framed, no
// fabricated numbers (the YES % is real; fair value is explicitly our estimate).

const DCOL: Record<string, string> = { up: '#0f7d56', down: '#c43d34', neutral: '#2469a6' }

function spark(arr: number[], w: number, h: number): string {
  const mn = Math.min(...arr), mx = Math.max(...arr), r = (mx - mn) || 1
  return arr.map((v, i) => `${(i / (arr.length - 1) * w).toFixed(1)},${(h - ((v - mn) / r) * h).toFixed(1)}`).join(' ')
}

export async function POST(req: NextRequest) {
  const { query }: { query?: string } = await req.json().catch(() => ({}))
  const q = (query || '').trim()
  if (!q) return Response.json({ error: 'empty query' }, { status: 400 })
  if (!process.env.OPENAI_API_KEY) return Response.json({ error: 'no key' }, { status: 503 })

  const markets = await searchMarkets(q, 4)
  const top = markets[0]

  const sys = `You are AlphaLens, a prediction-market intelligence engine. Given a user's market question and the REAL related Polymarket markets, write a short, sharp, conversational read.
RULES (non-negotiable):
- The market YES % provided is REAL — never restate a different one as the market's price.
- Give your OWN fair-value estimate (fairPct 0-100) for the top market — it is explicitly AlphaLens's view, not the market's.
- 3 drivers moving the line: each a short label + strength 0-100 + direction up|down|neutral. Qualitative, grounded.
- 3 follow-up suggestions the user might ask next.
- Education only, never advice. No fabricated statistics. Return ONLY JSON.`

  const user = `USER QUESTION: ${q}

RELATED REAL MARKETS (reference only — % are real):
${markets.map((m, i) => `[${i}] ${m.question} — ${m.yesPct}% YES, ${m.vol} vol, ${m.category}`).join('\n') || '(none found)'}

Return JSON:
{
  "intro": "string — 2-3 sentences reading the top market",
  "drivers": [{"label":"string","strength":number,"direction":"up|down|neutral"}],
  "fairPct": number,
  "edgeNote": "string — one line on your fair value vs the market",
  "followups": ["string","string","string"]
}`

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 3 })
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini', max_tokens: 900, response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
    })
    const parsed = JSON.parse((resp.choices[0]?.message?.content || '{}').match(/\{[\s\S]*\}/)?.[0] || '{}')

    const drivers = (Array.isArray(parsed.drivers) ? parsed.drivers : []).slice(0, 3).map((d: { label?: string; strength?: number; direction?: string }) => ({
      label: d.label ?? '', w: `${Math.max(15, Math.min(100, Number(d.strength) || 50))}%`,
      col: DCOL[d.direction ?? 'neutral'] || DCOL.neutral, tag: d.direction === 'up' ? 'tailwind' : d.direction === 'down' ? 'fading' : 'building',
    }))

    const fairPct = top ? Math.max(1, Math.min(99, Math.round(Number(parsed.fairPct) || top.yesPct))) : undefined
    const read = top ? {
      question: top.question, pctLabel: `${top.yesPct}%`, vol: top.vol, liq: top.vol,
      fairLabel: `${fairPct}%`, edge: `${(fairPct! - top.yesPct >= 0 ? '+' : '')}${fairPct! - top.yesPct} pt`,
      spark: spark(top.spark, 240, 40),
    } : null

    const sources = markets.slice(0, 3).map(m => ({ tag: 'PM', name: m.question.length > 38 ? m.question.slice(0, 38) + '…' : m.question, t: 'live' }))

    return Response.json({
      intro: parsed.intro ?? '',
      edgeNote: parsed.edgeNote ?? '',
      drivers, read, sources,
      followups: (Array.isArray(parsed.followups) ? parsed.followups : []).slice(0, 3),
    })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
