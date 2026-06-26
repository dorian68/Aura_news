// Planificateur intégré au serveur Node : rafraîchit le corpus de news
// périodiquement, MÊME sans visiteur, tant que le serveur tourne (dev local ou
// self-host). `register()` est appelé une fois par instance de serveur Next.
//
// ⚠️ En prod serverless (Vercel), les timers ne survivent pas entre invocations :
// c'est le Vercel Cron de `vercel.json` (POST /api/ingest) qui assure le
// rafraîchissement périodique là-bas. Ici on couvre le cas serveur long-vivant.
//
// Ce planificateur ne fait QUE rafraîchir les news (ingestArticles) — il ne price
// AUCUN Signal (le pricing OpenAI reste paresseux, au clic utilisateur).

const REFRESH_MS = 10 * 60 * 1000   // toutes les 10 min

export async function register() {
  // Uniquement dans le runtime Node (pas Edge) et une seule fois par process.
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  const g = globalThis as typeof globalThis & { __auraIngestTimer?: ReturnType<typeof setInterval> }
  if (g.__auraIngestTimer) return

  const { ingestArticles } = await import('./lib/news')

  const tick = async () => {
    try {
      const r = await ingestArticles()
      console.log(`[ingest:scheduler] ${new Date().toISOString()} inserted=${r.inserted} configured=${r.configured}`)
    } catch (e) {
      console.error('[ingest:scheduler] error', e)
    }
  }

  g.__auraIngestTimer = setInterval(tick, REFRESH_MS)
  // Ne pas empêcher le process de s'arrêter à cause du timer.
  if (typeof g.__auraIngestTimer.unref === 'function') g.__auraIngestTimer.unref()
  void tick()   // ingestion initiale au démarrage du serveur
}
