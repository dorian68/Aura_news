// Debug CLI — source NEWS (Finnhub + RSS), matière première du Feed.
// Valide indépendamment de l'UI qu'on récupère de vraies news fraîches.
// Lancer: npm run debug:news  (ou: node --env-file=.env.local scripts/debug-news.mjs)

import { step, ok, fail, skip, line, maskSecret, summary } from './_log.mjs'

const FINNHUB_KEY = process.env.FINNHUB_API_KEY || ''

async function finnhub(category) {
  step(`Finnhub /news?category=${category}`)
  maskSecret('FINNHUB_API_KEY', FINNHUB_KEY)
  if (!FINNHUB_KEY) { skip('clé absente'); return 0 }
  const url = `https://finnhub.io/api/v1/news?category=${category}&token=${FINNHUB_KEY}`
  line('REQUEST', `https://finnhub.io/api/v1/news?category=${category}&token=***`)
  try {
    const res = await fetch(url)
    if (!res.ok) { fail(`HTTP ${res.status}`); return 0 }
    const data = await res.json()
    const n = Array.isArray(data) ? data.length : 0
    ok(`${n} items`)
    if (n) line('OUTPUT', `ex: "${(data[0].headline || '').slice(0, 80)}"`)
    return n
  } catch (e) { fail(e.message); return 0 }
}

const RSS = [
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', source: 'CNBC Top' },
  { url: 'http://feeds.marketwatch.com/marketwatch/topstories/', source: 'MarketWatch' },
  { url: 'https://www.federalreserve.gov/feeds/press_all.xml', source: 'Fed' },
]

async function rss(feed) {
  step(`RSS ${feed.source}`)
  line('REQUEST', feed.url)
  try {
    const res = await fetch(feed.url, { headers: { 'User-Agent': 'Mozilla/5.0 AuraNewsDebug' } })
    if (!res.ok) { fail(`HTTP ${res.status}`); return 0 }
    const xml = await res.text()
    const n = (xml.match(/<item[\s>]/g) || []).length
    n ? ok(`${n} <item>`) : fail('0 item (parse/format ?)')
    return n
  } catch (e) { fail(e.message); return 0 }
}

async function run() {
  let total = 0
  for (const c of ['general', 'crypto', 'merger']) total += await finnhub(c)
  for (const f of RSS) total += await rss(f)

  const verdict = total >= 20
  summary(
    `Total items news (toutes sources): ${total}\n` +
    (verdict
      ? 'Le Feed dispose de news réelles et fraîches. ✅'
      : 'PROBLÈME: trop peu de news → Feed quasi vide. Vérifier clé Finnhub / accès RSS. ❌')
  )
  process.exit(verdict ? 0 : 1)
}

run().catch(e => { fail(e.stack || e.message); process.exit(1) })
