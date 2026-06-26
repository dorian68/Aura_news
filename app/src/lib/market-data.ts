export interface TickerQuote {
  sym: string
  price: number
  change: number
  changePct: number
  name: string
}

export interface PolymarketMarket {
  id: string
  question: string
  yesPrice: number
  noPrice: number
  volume: number
  endDate: string
}

const TWELVE_DATA_BASE = 'https://api.twelvedata.com'
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'
const POLYMARKET_BASE = 'https://clob.polymarket.com'

export async function fetchQuotes(symbols: string[], apiKey: string): Promise<TickerQuote[]> {
  if (!symbols.length) return []
  const syms = symbols.join(',')
  const res = await fetch(
    `${TWELVE_DATA_BASE}/quote?symbol=${syms}&apikey=${apiKey}`,
    { next: { revalidate: 900 } } // 15 min cache — free tier delay
  )
  if (!res.ok) return []
  const data = await res.json()

  const normalize = (raw: Record<string, unknown>, sym: string): TickerQuote => ({
    sym,
    price: parseFloat(raw.close as string) || 0,
    change: parseFloat(raw.change as string) || 0,
    changePct: parseFloat(raw.percent_change as string) || 0,
    name: raw.name as string || sym,
  })

  if (symbols.length === 1) return [normalize(data, symbols[0])]
  return symbols
    .filter(s => data[s] && !data[s].status)
    .map(s => normalize(data[s], s))
}

export async function fetchCryptoPrices(ids: string[]): Promise<TickerQuote[]> {
  if (!ids.length) return []
  const res = await fetch(
    `${COINGECKO_BASE}/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`,
    { next: { revalidate: 300 } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return ids
    .filter(id => data[id])
    .map(id => ({
      sym: id.toUpperCase(),
      price: data[id].usd,
      change: 0,
      changePct: data[id].usd_24h_change || 0,
      name: id,
    }))
}

export async function fetchPolymarketMarkets(keywords: string[]): Promise<PolymarketMarket[]> {
  try {
    const res = await fetch(
      `${POLYMARKET_BASE}/markets?limit=20&active=true`,
      { next: { revalidate: 600 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    const markets = (data.data || data) as Record<string, unknown>[]
    return markets
      .filter((m) => {
        const q = (m.question as string || '').toLowerCase()
        return keywords.some(k => q.includes(k.toLowerCase()))
      })
      .slice(0, 5)
      .map((m) => ({
        id: m.condition_id as string,
        question: m.question as string,
        yesPrice: parseFloat(m.outcomePrices as string) || 0.5,
        noPrice: 1 - (parseFloat(m.outcomePrices as string) || 0.5),
        volume: parseFloat(m.volume as string) || 0,
        endDate: m.end_date_iso as string || '',
      }))
  } catch {
    return []
  }
}

export const DEFAULT_TICKERS = [
  'SPY', 'QQQ', 'GLD', 'EUR/USD', 'BTC/USD', 'WTI', 'DXY',
]

export const CRYPTO_IDS = ['bitcoin', 'ethereum']

// ── Quotes via Finnhub (gratuit, généreux) — source primaire des niveaux/moves ──
// Données RÉELLES uniquement. En cas d'échec : on n'invente rien (valeur absente).

// Mapping minimal ticker → id CoinGecko pour les actifs crypto courants.
const CRYPTO_MAP: Record<string, string> = {
  BTC: 'bitcoin', 'BTC/USD': 'bitcoin', 'BTC-USD': 'bitcoin',
  ETH: 'ethereum', 'ETH/USD': 'ethereum', 'ETH-USD': 'ethereum',
  SOL: 'solana', XRP: 'ripple', DOGE: 'dogecoin', ADA: 'cardano',
}

export interface AssetQuote { sym: string; price: number; changePct: number }

async function finnhubQuote(sym: string, key: string): Promise<AssetQuote | null> {
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${key}`, { cache: 'no-store' })
    if (!res.ok) return null
    const q = await res.json()
    if (typeof q.c !== 'number' || q.c === 0) return null   // 0 = symbole inconnu
    return { sym, price: q.c, changePct: typeof q.dp === 'number' ? q.dp : 0 }
  } catch { return null }
}

/**
 * Quotes RÉELLES pour une liste de symboles. Stocks/ETF via Finnhub, crypto via
 * CoinGecko. Retourne une Map ; un symbole sans donnée est simplement absent
 * (jamais de valeur fabriquée).
 */
export async function fetchAssetQuotes(symbols: string[]): Promise<Map<string, AssetQuote>> {
  const out = new Map<string, AssetQuote>()
  const uniq = [...new Set(symbols.map(s => s.trim().toUpperCase()).filter(Boolean))]
  if (!uniq.length) return out

  const cryptoIds: { sym: string; id: string }[] = []
  const stocks: string[] = []
  for (const s of uniq) (CRYPTO_MAP[s] ? cryptoIds.push({ sym: s, id: CRYPTO_MAP[s] }) : stocks.push(s))

  const key = process.env.FINNHUB_API_KEY || ''
  await Promise.all([
    // Stocks/ETF — Finnhub (parallèle ; free tier ~60 req/min)
    ...(key ? stocks.map(async s => { const q = await finnhubQuote(s, key); if (q) out.set(s, q) }) : []),
    // Crypto — CoinGecko (un seul appel)
    (async () => {
      if (!cryptoIds.length) return
      try {
        const ids = [...new Set(cryptoIds.map(c => c.id))].join(',')
        const r = await fetch(`${COINGECKO_BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`, { cache: 'no-store' })
        if (!r.ok) return
        const d = await r.json()
        for (const c of cryptoIds) {
          const row = d[c.id]
          if (row?.usd) out.set(c.sym, { sym: c.sym, price: row.usd, changePct: row.usd_24h_change ?? 0 })
        }
      } catch { /* rien */ }
    })(),
  ])
  return out
}

// Bandeau macro : libellés lisibles → symboles réels (ETF proxies, données Finnhub).
export const MACRO_TICKERS: { label: string; sym: string }[] = [
  { label: 'S&P 500', sym: 'SPY' },
  { label: 'Nasdaq 100', sym: 'QQQ' },
  { label: 'US 10Y (TLT)', sym: 'TLT' },
  { label: 'Gold', sym: 'GLD' },
  { label: 'Oil (WTI)', sym: 'USO' },
  { label: 'US Dollar', sym: 'UUP' },
  { label: 'Volatility', sym: 'VIXY' },
]
