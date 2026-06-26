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
