// Debug CLI — FLUX SIGNAL de bout en bout (le cœur du produit).
// Exécute le vrai pipeline via l'API (indépendant de l'UI) :
//   GET /api/news  →  POST /api/news-trade (SSE)  →  report
// Puis AUDIT MÉTIER du grounding : aucune proba sans marché réel (vision produit).
// Pré-requis: dev server lancé. Lancer: npm run debug:signal
//   (BASE_URL surchargeable via env, défaut http://localhost:3000)

import { writeFileSync } from 'node:fs'
import { step, ok, fail, line, summary } from './_log.mjs'

const BASE = process.env.BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const IDX = Number(process.argv[2] || 0)   // index de news (force une génération fraîche)

async function getNews() {
  step(`GET ${BASE}/api/news (index ${IDX})`)
  const res = await fetch(`${BASE}/api/news`)
  if (!res.ok) { fail(`HTTP ${res.status}`); return null }
  const items = await res.json()
  if (!Array.isArray(items) || !items.length) { fail('0 news'); return null }
  const item = items[IDX] || items[0]
  ok(`${items.length} news`)
  line('OUTPUT', `id=${item.id} | "${(item.title || '').slice(0, 70)}"`)
  return item
}

async function genSignal(newsId) {
  step(`POST ${BASE}/api/news-trade (SSE)`)
  line('REQUEST', `newsId=${newsId}`)
  const res = await fetch(`${BASE}/api/news-trade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newsId, watchlist: ['AAPL', 'BTC'] }),
  })
  if (!res.ok || !res.body) { fail(`HTTP ${res.status}`); return null }

  const reader = res.body.getReader()
  const dec = new TextDecoder()
  let buf = '', report = null, errMsg = null, usage = null
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    const chunks = buf.split('\n\n'); buf = chunks.pop() || ''
    for (const ch of chunks) {
      const ev = /event: (.+)/.exec(ch)?.[1]
      const dataRaw = /data: ([\s\S]+)/.exec(ch)?.[1]
      if (!ev || !dataRaw) continue
      const data = JSON.parse(dataRaw)
      if (ev === 'status') line('OUTPUT', `${data.pct}% — ${data.step}`)
      else if (ev === 'usage') { usage = data; line('OUTPUT', `tokens in=${data.input} out=${data.output}`) }
      else if (ev === 'complete') report = data.report
      else if (ev === 'error') errMsg = data.message
    }
  }
  if (errMsg) { fail(errMsg); return null }
  if (!report) { fail('aucun event "complete"'); return null }
  ok(`report reçu (cached=${'n/a'})`)
  return { report, usage }
}

function auditGrounding(report) {
  step('AUDIT MÉTIER — grounding (vision: 0 proba fabriquée)')
  const issues = []
  const rm = report.relatedMarkets || []
  line('OUTPUT', `relatedMarkets: ${rm.length}`)
  rm.forEach((m, i) => {
    if (typeof m.yesPct === 'number' && (!m.marketId || !m.url || !m.question))
      issues.push(`relatedMarket[${i}] a un % sans source réelle (marketId/url/question manquant)`)
    line('OUTPUT', `  • ${m.yesPct}% | ${m.url ? 'src✅' : 'src❌'} | ${(m.question || '').slice(0, 55)}`)
  })
  const sc = report.scenarios || []
  sc.forEach((s, i) => {
    if (typeof s.prob === 'number' && !s.marketUrl)
      issues.push(`scenario[${i}] porte un prob=${s.prob} sans marketUrl (proba non tracée)`)
  })
  line('OUTPUT', `scenarios: ${sc.length} | assets: ${(report.assets || []).length}`)
  ;(report.assets || []).forEach(a => line('OUTPUT', `  · ${a.sym} ${a.direction} (${a.horizon}) — ${(a.reason || '').slice(0, 50)}`))
  line('OUTPUT', `portfolioImpact: ${(report.portfolioImpact || '(vide)').slice(0, 90)}`)
  line('OUTPUT', `sections: ${(report.sections || []).length} | finalTake: ${report.finalTake ? 'oui' : 'NON'}`)
  if (process.env.DUMP) {
    writeFileSync('/tmp/aura-report.json', JSON.stringify(report, null, 2))
    line('OUTPUT', 'report complet → /tmp/aura-report.json')
  }
  const hasThesis = !!(report.thesis && report.thesis.length > 20)
  const hasNarrative = (report.sections || []).length > 0 || !!report.finalTake
  if (!hasThesis) issues.push('thèse absente/trop courte')
  if (!hasNarrative) issues.push('pas de sections ni finalTake (report vide ?)')
  return issues
}

async function run() {
  const news = await getNews()
  if (!news) { summary('Échec en amont: pas de news → flux non testable. ❌'); process.exit(1) }
  const res = await genSignal(news.id)
  if (!res) { summary('Échec génération Signal (voir étapes). ❌'); process.exit(1) }
  const issues = auditGrounding(res.report)

  const verdict = issues.length === 0
  summary(
    `Flux Signal e2e: ${res.report ? 'OK ✅' : 'KO ❌'}\n` +
    `Audit grounding: ${verdict ? 'CONFORME vision (0 proba fabriquée) ✅' : issues.length + ' écart(s) ❌'}\n` +
    issues.map(i => ` - ${i}`).join('\n')
  )
  process.exit(verdict ? 0 : 1)
}

run().catch(e => { fail(e.stack || e.message); process.exit(1) })
