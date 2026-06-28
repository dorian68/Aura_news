// Registre d'outils AG-UI — connectés aux VRAIES fonctionnalités de l'app.
// Tous read-only et sans secret. Données réelles uniquement (jamais fabriquées).

import { searchMarkets } from '../market-search'
import { fetchNews } from '../news'
import { fetchAssetQuotes, MACRO_TICKERS } from '../market-data'

export interface AgTool {
  name: string
  description: string
  parameters: Record<string, unknown>   // JSON Schema
  sensitive?: boolean                    // → validation humaine requise
  run: (args: Record<string, unknown>) => Promise<unknown>
}

const str = (v: unknown, d = '') => (typeof v === 'string' ? v : d)
const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(x => String(x)) : [])

export const tools: AgTool[] = [
  {
    name: 'search_markets',
    description: 'Search real prediction markets (Polymarket) related to a financial topic. Returns each market question, its real implied YES %, 24h volume and category. Use this to ground any probability in a real market.',
    parameters: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Topic or keywords, e.g. "fed rate cut", "bitcoin 100k". Empty = trending finance markets.' } },
      required: ['query'],
    },
    run: async (a) => {
      const hits = await searchMarkets(str(a.query), 8)
      return hits.map(h => ({ question: h.question, yesPct: h.yesPct, volume: h.vol, category: h.category, change24h: h.delta }))
    },
  },
  {
    name: 'get_news',
    description: 'Get the latest real financial news headlines, optionally filtered by section (Equities, Macro, World, Tech, Crypto, Deals, Markets).',
    parameters: {
      type: 'object',
      properties: {
        section: { type: 'string', description: 'Optional section filter.' },
        limit: { type: 'number', description: 'Max headlines (default 8).' },
      },
    },
    run: async (a) => {
      const news = await fetchNews()
      const section = str(a.section)
      const limit = typeof a.limit === 'number' ? Math.min(20, a.limit) : 8
      const filtered = section ? news.filter(n => (n.section || '').toLowerCase() === section.toLowerCase()) : news
      return filtered.slice(0, limit).map(n => ({ id: n.id, title: n.title, source: n.source, section: n.section, time: n.time, tickers: n.tickers }))
    },
  },
  {
    name: 'get_quotes',
    description: 'Get real live prices and daily % change for one or more tickers/ETFs (e.g. SPY, NVDA, BTC).',
    parameters: {
      type: 'object',
      properties: { symbols: { type: 'array', items: { type: 'string' }, description: 'Tickers to quote.' } },
      required: ['symbols'],
    },
    run: async (a) => {
      const q = await fetchAssetQuotes(arr(a.symbols))
      return [...q.values()].map(x => ({ sym: x.sym, price: x.price, changePct: +x.changePct.toFixed(2) }))
    },
  },
  {
    name: 'get_macro_snapshot',
    description: 'Get a real live macro snapshot: S&P, Nasdaq, US 10Y, gold, oil, dollar, volatility levels and daily moves.',
    parameters: { type: 'object', properties: {} },
    run: async () => {
      const q = await fetchAssetQuotes(MACRO_TICKERS.map(m => m.sym))
      return MACRO_TICKERS.map(m => { const v = q.get(m.sym.toUpperCase()); return v ? { label: m.label, price: v.price, changePct: +v.changePct.toFixed(2) } : null }).filter(Boolean)
    },
  },
]

export const toolByName = new Map(tools.map(t => [t.name, t]))

// OpenAI function-calling schema.
export function openaiTools() {
  return tools.map(t => ({ type: 'function' as const, function: { name: t.name, description: t.description, parameters: t.parameters } }))
}

// Masque les secrets éventuels avant tout envoi au modèle / frontend.
const SECRET_KEYS = /(api[-_]?key|token|password|secret|authorization|cookie|set-cookie|private[-_]?key|refresh[-_]?token|access[-_]?token)/i
export function sanitizeForAgent<T>(input: T): T {
  if (Array.isArray(input)) return input.map(sanitizeForAgent) as unknown as T
  if (input && typeof input === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      out[k] = SECRET_KEYS.test(k) ? '***' : sanitizeForAgent(v)
    }
    return out as T
  }
  return input
}
