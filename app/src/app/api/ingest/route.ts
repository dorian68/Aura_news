import { ingestArticles } from '@/lib/news'

// The "flow": polls all sources and upserts into the article store. Meant to be
// called by a scheduler (Vercel Cron) — not at page-load time. Protected by
// CRON_SECRET when set (Vercel injects `Authorization: Bearer <CRON_SECRET>`).
export const maxDuration = 60

async function run(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization') || ''
    const key = new URL(req.url).searchParams.get('key') || ''
    if (auth !== `Bearer ${secret}` && key !== secret) {
      return new Response('unauthorized', { status: 401 })
    }
  }
  const res = await ingestArticles()
  return Response.json({ ok: true, ...res })
}

export const GET = run
export const POST = run
