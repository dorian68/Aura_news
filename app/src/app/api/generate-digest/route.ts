import { fetchNews } from '@/lib/news'
import { getOrCreateSignal, hydrateSignal } from '@/lib/generation/signal-store'

// Briefings = a digest of N Signals from the SAME store. Mostly served from the
// frozen store after warm-up (only new stories are generated), then hydrated live.
const N = 6

export async function POST() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))

      try {
        if (!process.env.OPENAI_API_KEY) {
          send('error', { message: 'OPENAI_API_KEY is not set — real generation is unavailable.' })
          controller.close(); return
        }

        send('status', { step: 'Pulling today’s feed…', pct: 12 })
        const news = (await fetchNews()).slice(0, N)
        if (!news.length) { send('error', { message: 'No live news available.' }); controller.close(); return }

        send('status', { step: `Assembling ${news.length} signals…`, pct: 40 })
        const settled = await Promise.all(news.map(async n => {
          const sig = await getOrCreateSignal(n)
          if (!sig) return null
          const report = await hydrateSignal(sig.report, [])
          return { report, usage: sig.usage }
        }))
        const results = settled.filter(Boolean) as { report: NonNullable<Awaited<ReturnType<typeof hydrateSignal>>>; usage?: { input: number; output: number } }[]
        if (!results.length) { send('error', { message: 'Could not assemble signals (transient error). Try again.' }); controller.close(); return }

        const usage = results.reduce((acc, r) => ({
          input: acc.input + (r.usage?.input ?? 0),
          output: acc.output + (r.usage?.output ?? 0),
        }), { input: 0, output: 0 })
        if (usage.input || usage.output) send('usage', usage)

        send('status', { step: 'Edition ready', pct: 100 })
        send('complete', {
          digest: {
            id: `dig_${Date.now()}`,
            title: 'Today’s Signals',
            dateLabel: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
            signals: results.map(r => r.report),
          },
        })
      } catch (err) {
        send('error', { message: String(err) })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
  })
}
