// Debug CLI — SUPABASE (store des Signals figés + corpus articles).
// Vérifie connectivité + existence des tables via l'API REST (service role).
// Dégradation gracieuse: si non configuré, l'app retombe sur le live feed.
// Lancer: npm run debug:supabase

import { step, ok, fail, skip, line, maskSecret, summary } from './_log.mjs'

const URL = process.env.SUPABASE_URL || ''
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const TABLES = ['alphalens_signals', 'alphalens_articles']

async function probe(table) {
  step(`Table ${table}`)
  const url = `${URL}/rest/v1/${table}?select=*&limit=1`
  line('REQUEST', `${URL}/rest/v1/${table}?select=*&limit=1`)
  try {
    const res = await fetch(url, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'count=exact', Range: '0-0' },
    })
    if (res.status === 404 || res.status === 400) { fail(`table introuvable (HTTP ${res.status}) — schéma non appliqué ?`); return false }
    if (!res.ok) { fail(`HTTP ${res.status}`); return false }
    const range = res.headers.get('content-range') || ''
    const count = range.includes('/') ? range.split('/')[1] : '?'
    ok(`accessible (≈${count} lignes)`)
    return true
  } catch (e) { fail(e.message); return false }
}

async function run() {
  step('Configuration Supabase')
  maskSecret('SUPABASE_URL', URL)
  maskSecret('SUPABASE_SERVICE_ROLE_KEY', KEY)
  if (!URL || !KEY) {
    skip('non configuré → l\'app utilise le live feed (dégradation prévue)')
    summary('Supabase non configuré. Le flux cœur fonctionne sans (live feed + génération à la volée). N/A justifié. ✅')
    process.exit(0)
  }
  const results = []
  for (const t of TABLES) results.push(await probe(t))
  const okAll = results.every(Boolean)
  summary(
    `Tables accessibles: ${results.filter(Boolean).length}/${TABLES.length}\n` +
    (okAll
      ? 'Supabase opérationnel : persistance des Signals figés + corpus articles OK. ✅'
      : 'PROBLÈME: au moins une table inaccessible (appliquer supabase/schema.sql ?). ❌')
  )
  process.exit(okAll ? 0 : 1)
}

run().catch(e => { fail(e.stack || e.message); process.exit(1) })
