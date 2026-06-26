import { NextRequest } from 'next/server'
import { fetchNews } from '@/lib/news'
import { getOrCreateSignal, hydrateSignal } from '@/lib/generation/signal-store'

// One Signal for one news item. Generated once + stored (frozen, shared), then
// hydrated with live prices/quotes at read — so user #2..#1,000,000 are served
// the stored signal without re-generating.
export async function POST(req: NextRequest) {
  const { newsId, watchlist = [] }: { newsId?: string; watchlist?: string[] } = await req.json().catch(() => ({}))
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

        send('status', { step: 'Loading the story…', pct: 12 })
        const news = await fetchNews()
        const item = news.find(n => n.id === newsId) || news[0]
        if (!item) { send('error', { message: 'No news available.' }); controller.close(); return }

        send('status', { step: 'Pricing the signal…', pct: 50 })
        const sig = await getOrCreateSignal(item)
        if (!sig) { send('error', { message: 'Could not generate the signal (transient error). Try again.' }); controller.close(); return }
        if (sig.usage) send('usage', sig.usage)   // tokens only when actually generated

        send('status', { step: 'Refreshing live prices…', pct: 82 })
        const report = await hydrateSignal(sig.report, watchlist)

        send('status', { step: 'Ready', pct: 100 })
        send('complete', { report, cached: !sig.generated })
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
