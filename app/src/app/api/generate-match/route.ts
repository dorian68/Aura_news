import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import type { WCMatch } from '@/lib/types'

const MATCH_ANGLES: Record<string, { label: string; prompt: string }> = {
  beginner: { label: 'Beginner Brief', prompt: 'Explain this match simply for someone who doesn\'t follow football. Focus on why it matters and what to watch for.' },
  trading: { label: 'Live Trading', prompt: 'Analyze the prediction market implications. Where is crowd pricing wrong? What bets offer edge?' },
  tactical: { label: 'Tactical Analysis', prompt: 'Break down the tactical battle: formations, pressing triggers, key duels, and how the match will be decided.' },
  h2h: { label: 'Historical H2H', prompt: 'Provide historical head-to-head context, tournament records, and psychological factors.' },
  crowd_vs_ai: { label: 'Crowd vs AI', prompt: 'Where does AlphaLens diverge from bookmakers? Identify mispriced outcomes and the reasoning.' },
  key_player: { label: 'Key Player Spotlight', prompt: 'Identify the one player who decides this match and explain why.' },
  market: { label: 'Market Impact', prompt: 'Analyze economic and trading implications: sponsor stocks, host city impact, broadcast deals, related assets.' },
}

export async function POST(req: NextRequest) {
  const { match, angleId }: { match: WCMatch; angleId: string } = await req.json()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))

      try {
        if (!process.env.OPENAI_API_KEY) {
          send('error', { message: 'OPENAI_API_KEY is not set — real generation is unavailable.' })
          controller.close()
          return
        }

        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        const angle = MATCH_ANGLES[angleId] || MATCH_ANGLES.beginner
        send('status', { step: 'Reading team news & form...', pct: 15 })

        const systemPrompt = `You are AlphaLens, a financial and sports intelligence engine. You analyze football matches and return structured JSON warm-up briefs that combine tactical analysis with prediction market insights.

Rules:
- Be precise and quantitative. probabilities are integers 0-100
- probA + probDraw + probB must sum to 100 (same for alpha versions)
- finalTake must be 1-2 actionable sentences
- Return ONLY valid JSON`

        const userPrompt = `MATCH: ${match.aFlag} ${match.aName} vs ${match.bName} ${match.bFlag}
Group: ${match.group} | Phase: ${match.phase}
Status: ${match.status} | Score: ${match.score}${match.minute ? ` (${match.minute})` : ''}
Venue: ${match.venue}, ${match.city}
Crowd odds: ${match.aCode} Win ${match.crowdA}% | Draw ${match.crowdDraw}% | ${match.bCode} Win ${match.crowdB}%
AlphaLens model: ${match.aCode} Win ${match.probA}% | Draw ${match.probDraw}% | ${match.bCode} Win ${match.probB}%
Gap signal: ${match.signal || 'none'}

ANALYSIS ANGLE: ${angle.label}
${angle.prompt}

Return JSON:
{
  "title": "string",
  "subtitle": "string",
  "executiveSummary": "string (2-3 sentences)",
  "probA": number, "probDraw": number, "probB": number,
  "alphaA": number, "alphaDraw": number, "alphaB": number,
  "gap": "string e.g. '+13 pts'",
  "gapNote": "string — one line on the divergence",
  "scenarios": [{"label": "string", "prob": number, "detail": "string"}],
  "keyBattles": [{"topic": "string", "edge": "string", "winner": "string"}],
  "teamForm": [{"team": "string", "last5": "string e.g. W W D L W", "note": "string"}],
  "marketImplications": [{"asset": "string", "direction": "string", "reason": "string"}],
  "finalTake": "string",
  "confPct": "string e.g. '71%'"
}`

        const response = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          max_tokens: 2048,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
        })

        send('status', { step: 'Checking prediction market odds...', pct: 50 })
        const rawText = response.choices[0]?.message?.content || '{}'
        send('status', { step: 'Detecting crowd bias...', pct: 75 })
        const warmup = JSON.parse(rawText)
        if (response.usage) {
          send('usage', { input: response.usage.prompt_tokens, output: response.usage.completion_tokens })
        }
        send('status', { step: 'Warm-up ready', pct: 100 })
        send('complete', {
          warmup: {
            ...warmup,
            id: `mw_${Date.now()}`,
            matchId: match.id,
            angleId,
            createdAt: new Date().toISOString(),
            aName: match.aName, bName: match.bName,
            aFlag: match.aFlag, bFlag: match.bFlag,
            score: match.score, status: match.status,
          },
        })
      } catch (err) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: String(err) })}\n\n`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
  })
}
