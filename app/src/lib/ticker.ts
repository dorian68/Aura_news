// Real ticker tape — Twelve Data (equities/FX/index) + CoinGecko (crypto),
// mapped to the TickerTape display shape. No mock fallback: returns whatever the
// live APIs give (possibly []), so an empty/failed key is visible, not hidden.

const TWELVE_KEY = process.env.TWELVE_DATA_API_KEY || ''
const COINGECKO_KEY = process.env.COIN_GECKO_API_KEY || ''

export interface TickerItem {
  sym: string
  px: string
  chg: string
  col: string
}

const UP = '#0f7d56'
const DOWN = '#c43d34'

function fmtPrice(n: number): string {
  if (!n) return '—'
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (n >= 1) return n.toFixed(2)
  return n.toFixed(4)
}

function fmtChg(pct: number): { chg: string; col: string } {
  const sign = pct >= 0 ? '+' : ''
  return { chg: `${sign}${pct.toFixed(2)}%`, col: pct >= 0 ? UP : DOWN }
}

async function fetchEquities(): Promise<TickerItem[]> {
  if (!TWELVE_KEY) return []
  try {
    const syms = ['SPY', 'QQQ', 'GLD', 'TLT', 'VIX'].join(',')
    const res = await fetch(
      `https://api.twelvedata.com/quote?symbol=${syms}&apikey=${TWELVE_KEY}`,
      { next: { revalidate: 900 } },
    )
    if (!res.ok) return []
    const data = await res.json()
    const rows = Object.values(data).filter(
      (r): r is Record<string, unknown> => !!r && typeof r === 'object' && 'symbol' in r,
    )
    return rows.map((r) => {
      const pct = parseFloat(r.percent_change as string) || 0
      const { chg, col } = fmtChg(pct)
      return { sym: r.symbol as string, px: fmtPrice(parseFloat(r.close as string) || 0), chg, col }
    })
  } catch {
    return []
  }
}

async function fetchCrypto(): Promise<TickerItem[]> {
  try {
    const headers: HeadersInit = COINGECKO_KEY ? { 'x-cg-demo-api-key': COINGECKO_KEY } : {}
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
      { headers, next: { revalidate: 300 } },
    )
    if (!res.ok) return []
    const d = await res.json()
    const out: TickerItem[] = []
    for (const [id, sym] of [['bitcoin', 'BTC'], ['ethereum', 'ETH']] as const) {
      if (!d[id]) continue
      const { chg, col } = fmtChg(d[id].usd_24h_change || 0)
      out.push({ sym, px: fmtPrice(d[id].usd || 0), chg, col })
    }
    return out
  } catch {
    return []
  }
}

export async function fetchTickerItems(): Promise<TickerItem[]> {
  const [eq, crypto] = await Promise.all([fetchEquities(), fetchCrypto()])
  return [...eq, ...crypto]
}
