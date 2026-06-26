// Debug CLI — MARKET DATA (quotes), source de hydration des moves d'actifs.
// Twelve Data (actions/FX/ETF) + CoinGecko (crypto, sans clé).
// Lancer: npm run debug:market-data

import { step, ok, fail, skip, line, maskSecret, summary } from './_log.mjs'

const TD_KEY = process.env.TWELVE_DATA_API_KEY || ''
const TD = 'https://api.twelvedata.com'
const CG = 'https://api.coingecko.com/api/v3'

async function twelveData() {
  step('Twelve Data /quote (SPY, QQQ, GLD)')
  maskSecret('TWELVE_DATA_API_KEY', TD_KEY)
  if (!TD_KEY) { skip('clé absente → moves d\'actifs indisponibles (dégradation OK)'); return 0 }
  const syms = ['SPY', 'QQQ', 'GLD']
  line('REQUEST', `${TD}/quote?symbol=${syms.join(',')}&apikey=***`)
  try {
    const res = await fetch(`${TD}/quote?symbol=${syms.join(',')}&apikey=${TD_KEY}`)
    if (!res.ok) { fail(`HTTP ${res.status}`); return 0 }
    const data = await res.json()
    if (data.code && data.status === 'error') { fail(`API: ${data.message}`); return 0 }
    let n = 0
    for (const s of syms) {
      const q = syms.length === 1 ? data : data[s]
      if (q && !q.status) { n++; line('OUTPUT', `${s}: ${q.close} (${q.percent_change}%)`) }
    }
    n ? ok(`${n}/${syms.length} quotes`) : fail('0 quote exploitable')
    return n
  } catch (e) { fail(e.message); return 0 }
}

async function coinGecko() {
  step('CoinGecko /simple/price (bitcoin, ethereum)')
  try {
    const res = await fetch(`${CG}/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true`)
    if (!res.ok) { fail(`HTTP ${res.status}`); return 0 }
    const data = await res.json()
    let n = 0
    for (const id of ['bitcoin', 'ethereum']) {
      if (data[id]?.usd) { n++; line('OUTPUT', `${id}: $${data[id].usd} (${(data[id].usd_24h_change ?? 0).toFixed(2)}%)`) }
    }
    n ? ok(`${n}/2 prix`) : fail('0 prix')
    return n
  } catch (e) { fail(e.message); return 0 }
}

async function run() {
  const td = await twelveData()
  const cg = await coinGecko()
  // CoinGecko seul suffit à prouver la voie crypto ; TD peut être absent (free tier).
  const verdict = cg >= 1
  summary(
    `Twelve Data quotes: ${td} | CoinGecko prix: ${cg}\n` +
    (verdict
      ? 'Source market-data opérationnelle (au moins une voie). Les moves d\'actifs peuvent être hydratés. ✅'
      : 'PROBLÈME: aucune source de quote ne répond → moves d\'actifs absents. ❌')
  )
  process.exit(verdict ? 0 : 1)
}

run().catch(e => { fail(e.stack || e.message); process.exit(1) })
