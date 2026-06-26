import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/generation/prompts'

export async function POST(req: NextRequest) {
  const { article, angleId } = await req.json()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
      }

      try {
        if (!process.env.OPENAI_API_KEY) {
          send('error', { message: 'OPENAI_API_KEY is not set — real generation is unavailable.' })
          controller.close()
          return
        }

        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        send('status', { step: 'Analyzing market context...', pct: 10 })

        const response = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          max_tokens: 4096,
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            { role: 'user', content: buildUserPrompt(article, angleId) },
          ],
          response_format: { type: 'json_object' },
        })

        send('status', { step: 'Computing event probabilities...', pct: 40 })
        const rawText = response.choices[0]?.message?.content || ''
        send('status', { step: 'Building pricing snapshot...', pct: 65 })

        const jsonMatch = rawText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          send('error', { message: 'Invalid response format from AI' })
          controller.close()
          return
        }

        send('status', { step: 'Mapping asset impacts...', pct: 85 })
        const report = JSON.parse(jsonMatch[0])
        if (response.usage) {
          send('usage', { input: response.usage.prompt_tokens, output: response.usage.completion_tokens })
        }
        send('status', { step: 'Report ready', pct: 100 })
        send('complete', {
          report: {
            ...report,
            id: `rep_${Date.now()}`,
            newsId: article?.id || '1',
            angleId,
            createdAt: new Date().toISOString(),
          },
        })
      } catch (err) {
        controller.enqueue(
          encoder.encode(`event: error\ndata: ${JSON.stringify({ message: String(err) })}\n\n`)
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
