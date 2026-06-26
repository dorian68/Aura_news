// Debug CLI — brique [A] RAG : source de données Polymarket (/markets).
// Valide indépendamment de l'UI que l'on récupère de VRAIS marchés actifs avec
// un % réel et un volume — la matière première du moteur de Signaux.
// Lancer: npm run debug:polymarket   (ou: node --env-file=.env.local scripts/debug-polymarket.mjs)

import { step, ok, fail, line, summary } from './_log.mjs'

const GAMMA = 'https://gamma-api.polymarket.com'
const MAX_MARKETS = 600

function asArray(v) {
  if (!v) return []
  if (Array.isArray(v)) return v
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : [] } catch { return [] }
}

async function run() {
  let total = 0, withPrice = 0, biggestPage = 0
  const sample = []

  for (let offset = 0; offset < MAX_MARKETS; offset += 100) {
    step(`Fetch /markets offset=${offset}`)
    const url = `${GAMMA}/markets?active=true&closed=false&limit=100&offset=${offset}&order=volume&ascending=false`
    line('REQUEST', url)
    let res
    try {
      res = await fetch(url, { headers: { Accept: 'application/json' } })
    } catch (e) {
      fail(`réseau: ${e.message}`); break
    }
    if (!res.ok) { fail(`HTTP ${res.status}`); break }
    const raw = await res.json()
    const bytes = Number(res.headers.get('content-length')) || JSON.stringify(raw).length
    biggestPage = Math.max(biggestPage, bytes)
    ok(`${raw.length} marchés (~${(bytes / 1024).toFixed(0)} KB)`)

    for (const m of raw) {
      if (!m.question || !m.outcomePrices) continue
      total += 1
      const prices = asArray(m.outcomePrices).map(Number)
      const yesPct = Math.round((prices[0] ?? 0.5) * 100)
      if (prices.length) withPrice += 1
      if (sample.length < 5) sample.push({ q: m.question.slice(0, 70), yesPct, vol: Math.round(Number(m.volumeNum ?? m.volume ?? 0)) })
    }
    if (raw.length < 100) break
  }

  step('Échantillon de marchés réels récupérés')
  sample.forEach(s => line('OUTPUT', `${s.yesPct}% | vol=$${s.vol.toLocaleString()} | ${s.q}`))

  const cacheRisk = biggestPage > 2 * 1024 * 1024
  step('Contrôle cache Next.js (>2MB non cachable)')
  line('OUTPUT', `page la plus lourde ~${(biggestPage / 1024 / 1024).toFixed(2)} MB`)
  if (cacheRisk) fail('une page dépasse 2MB → "next: { revalidate }" échouera au cache'); else ok('sous la limite de cache')

  const verdict = total >= 50 && withPrice === total
  summary(
    `Marchés récupérés: ${total} | avec % réel: ${withPrice}\n` +
    `Cache risk (>2MB): ${cacheRisk ? 'OUI ⚠️' : 'non'}\n` +
    (verdict
      ? 'La source RAG Polymarket renvoie des marchés réels exploitables. ✅'
      : 'PROBLÈME: pas assez de marchés ou prix manquants → le RAG sera dégradé. ❌')
  )
  process.exit(verdict ? 0 : 1)
}

run().catch(e => { fail(e.stack || e.message); process.exit(1) })
