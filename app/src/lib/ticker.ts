// Ticker tape RÉEL — Finnhub (actions/ETF) + CoinGecko (crypto), via la couche
// market-data partagée (no-store). Aucun mock, aucune valeur figée : un symbole
// sans donnée live est simplement absent (jamais inventé).

import { fetchAssetQuotes } from './market-data'

export interface TickerItem {
  sym: string
  px: string
  chg: string
  col: string
}

const UP = '#0f7d56'
const DOWN = '#c43d34'

// Proxies liquides réels (Finnhub) + crypto (CoinGecko). Libellés affichés.
const TICKERS: { sym: string; label: string }[] = [
  { sym: 'SPY', label: 'S&P 500' },
  { sym: 'QQQ', label: 'Nasdaq' },
  { sym: 'DIA', label: 'Dow' },
  { sym: 'GLD', label: 'Gold' },
  { sym: 'USO', label: 'Oil' },
  { sym: 'TLT', label: 'US 10Y' },
  { sym: 'UUP', label: 'USD' },
  { sym: 'VIXY', label: 'VIX' },
  { sym: 'BTC', label: 'BTC' },
  { sym: 'ETH', label: 'ETH' },
]

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

export async function fetchTickerItems(): Promise<TickerItem[]> {
  const quotes = await fetchAssetQuotes(TICKERS.map(t => t.sym))
  const out: TickerItem[] = []
  for (const t of TICKERS) {
    const q = quotes.get(t.sym.toUpperCase())
    if (!q) continue                      // pas de donnée réelle → on n'affiche rien
    const { chg, col } = fmtChg(q.changePct)
    out.push({ sym: t.label, px: fmtPrice(q.price), chg, col })
  }
  return out
}
