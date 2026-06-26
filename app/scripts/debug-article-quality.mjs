// Juge qualité automatique des articles (la "garantie" — mesurable, reproductible).
// Génère un Signal réel via l'API, puis NOTE l'article 1-10 sur des critères
// stricts (LLM-as-judge + checks déterministes), avec focus GROUNDING : aucun
// chiffre ne doit être inventé hors des données réelles fournies.
// Lancer: npm run debug:quality [indexNews]

import { step, ok, fail, line, summary } from './_log.mjs'

const BASE = process.env.BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const OPENAI_KEY = process.env.OPENAI_API_KEY || ''
const IDX = Number(process.argv[2] || 0)
const PASS = 7   // seuil par critère

async function getReport() {
  const list = await (await fetch(`${BASE}/api/news`)).json()
  const item = list[IDX] || list[0]
  const res = await fetch(`${BASE}/api/news-trade`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newsId: item.id, watchlist: ['SPY', 'BTC'] }),
  })
  const reader = res.body.getReader(); const dec = new TextDecoder()
  let buf = '', report = null
  while (true) { const { done, value } = await reader.read(); if (done) break
    buf += dec.decode(value, { stream: true }); const parts = buf.split('\n\n'); buf = parts.pop() || ''
    for (const p of parts) { const ev = /event: (.+)/.exec(p)?.[1]; const d = /data: ([\s\S]+)/.exec(p)?.[1]
      if (ev === 'complete' && d) report = JSON.parse(d).report } }
  return report
}

function deterministic(r) {
  const words = (r.sections || []).reduce((n, s) => n + (s.body || '').split(/\s+/).filter(Boolean).length, 0)
  return {
    words, sections: (r.sections || []).length, takeaways: (r.keyTakeaways || []).length,
    macro: (r.macro || []).length, assets: (r.assets || []).length,
    relatedMarkets: (r.relatedMarkets || []).length,
  }
}

// Ensemble des chiffres RÉELS autorisés (ce que le texte a le droit de citer).
function allowedNumbers(r) {
  const out = []
  for (const m of r.macro || []) out.push(`${m.label} ${m.price} (${m.changePct}%)`)
  for (const a of r.assets || []) out.push(`${a.sym} ${a.price ?? '?'} (${a.changePct ?? '?'}%)`)
  for (const m of r.relatedMarkets || []) out.push(`market "${m.question}" ${m.yesPct}% vol ${m.volume}`)
  return out.join('\n')
}

async function judge(r) {
  const article = (r.sections || []).map(s => `## ${s.heading}\n${s.body}`).join('\n\n')
  const sys = `You are a brutally strict editor at a top investment bank's research desk. Score a market article 1-10 on each criterion. No soft passes. Return ONLY JSON.`
  const usr = `ARTICLE (headline: ${r.headline})
KEY TAKEAWAYS:
${(r.keyTakeaways || []).map(t => '- ' + t).join('\n')}

${article}

REAL DATA THE ARTICLE IS ALLOWED TO CITE (any specific number NOT derivable from this set = fabrication):
${allowedNumbers(r)}

Score 1-10 (be harsh) and return JSON:
{
 "depth": n,            // analytical depth, non-obvious insight
 "structure_gs": n,     // reads like a Goldman Sachs briefing (mechanism, context, bull, bear, outlook, risks)
 "coherence": n,        // logically consistent, well-argued
 "practicality": n,     // actionable, concrete, useful to a trader
 "grounding": n,        // measures FABRICATION ONLY. 10 = no invented figures/tickers at all (a purely qualitative article with no numbers is fully grounded = 10). Deduct ONLY when a specific number, %, or ticker appears that is NOT in the allowed data. Do NOT penalize for being qualitative or for not citing numbers.
 "fabricatedNumbers": ["list any invented figures, [] if none"],
 "verdict": "one-sentence honest assessment"
}`
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', temperature: 0, response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: sys }, { role: 'user', content: usr }] }),
  })
  const d = await res.json()
  return JSON.parse(d.choices[0].message.content)
}

async function run() {
  if (!OPENAI_KEY) { fail('OPENAI_API_KEY absente'); process.exit(1) }
  step(`Génération d'un article réel (news index ${IDX})`)
  const r = await getReport()
  if (!r) { fail('pas de report'); process.exit(1) }
  ok(`article reçu — "${r.headline}"`)

  step('Checks déterministes')
  const m = deterministic(r)
  line('OUTPUT', `mots=${m.words} sections=${m.sections} takeaways=${m.takeaways} macro=${m.macro} assets=${m.assets} marchés=${m.relatedMarkets}`)

  step('Juge LLM (1-10, strict)')
  const j = await judge(r)
  const crit = { depth: j.depth, structure_gs: j.structure_gs, coherence: j.coherence, practicality: j.practicality, grounding: j.grounding }
  for (const [k, v] of Object.entries(crit)) line('SCORE', `${k}: ${v}/10`)
  if (j.fabricatedNumbers?.length) line('ERROR', `chiffres fabriqués: ${j.fabricatedNumbers.join(' | ')}`)
  line('OUTPUT', `verdict: ${j.verdict}`)

  const minScore = Math.min(...Object.values(crit))
  const lengthOK = m.words >= 1000
  const noFabrication = !(j.fabricatedNumbers?.length) && j.grounding >= 8
  const passAll = minScore >= PASS && lengthOK && noFabrication

  summary(
    `Score min: ${minScore}/10 (seuil ${PASS}) · mots: ${m.words} (≥1000: ${lengthOK ? 'oui' : 'NON'}) · grounding: ${j.grounding}/10 ${noFabrication ? '' : '(fabrication détectée)'}\n` +
    (passAll ? 'PASS ✅ — article de qualité, grounded, sans chiffre inventé.' : 'FAIL ❌ — à régénérer/améliorer (voir critères faibles ci-dessus).')
  )
  process.exit(passAll ? 0 : 1)
}

run().catch(e => { fail(e.stack || e.message); process.exit(1) })
