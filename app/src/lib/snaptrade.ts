// Intégration SnapTrade — connexion de courtier en LECTURE SEULE.
// Les clés (SNAPTRADE_CLIENT_ID / SNAPTRADE_CONSUMER_KEY) restent CÔTÉ SERVEUR,
// jamais exposées au client. Sans clés : isConfigured() = false → l'app dégrade
// proprement (bouton "bientôt", routes 503), aucune donnée fabriquée.
//
// ⚠️ La signature des requêtes SnapTrade suit le schéma documenté (HMAC-SHA256
// sur {content, path, query}). À valider contre le SDK officiel lors de l'ajout
// des vraies clés (voir docs/SNAPTRADE.md). Aucun appel n'est émis sans clés.

import crypto from 'crypto'

const BASE = 'https://api.snaptrade.com/api/v1'
const CLIENT_ID = process.env.SNAPTRADE_CLIENT_ID || ''
const CONSUMER_KEY = process.env.SNAPTRADE_CONSUMER_KEY || ''

export function isConfigured(): boolean {
  return Boolean(CLIENT_ID && CONSUMER_KEY)
}

function sign(path: string, queryStr: string, body: unknown): string {
  const sigObject = { content: body ?? null, path, query: queryStr }
  return crypto.createHmac('sha256', CONSUMER_KEY).update(JSON.stringify(sigObject)).digest('base64')
}

async function call(method: 'GET' | 'POST', path: string, opts: { query?: Record<string, string>; body?: unknown } = {}): Promise<unknown> {
  if (!isConfigured()) throw new Error('SNAPTRADE_NOT_CONFIGURED')
  const query = { ...(opts.query || {}), clientId: CLIENT_ID, timestamp: Math.floor(Date.now() / 1000).toString() }
  const queryStr = new URLSearchParams(query).toString()
  const signature = sign(path, queryStr, opts.body ?? null)
  const res = await fetch(`${BASE}${path}?${queryStr}`, {
    method,
    headers: { 'Content-Type': 'application/json', Signature: signature, Accept: 'application/json' },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`SnapTrade ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return res.json()
}

export interface SnapUser { userId: string; userSecret: string }

/** Enregistre un utilisateur SnapTrade → { userId, userSecret }. */
export async function registerUser(userId: string): Promise<SnapUser> {
  const r = await call('POST', '/snapTrade/registerUser', { body: { userId } }) as Record<string, unknown>
  return { userId: String(r.userId ?? userId), userSecret: String(r.userSecret ?? '') }
}

/** URL du Connection Portal (l'utilisateur s'y authentifie chez son courtier). */
export async function connectionPortalUrl(userId: string, userSecret: string): Promise<string> {
  const r = await call('POST', '/snapTrade/login', { query: { userId, userSecret }, body: {} }) as Record<string, unknown>
  return String(r.redirectURI ?? '')
}

export interface Holding { sym: string; name: string; units: number; price: number; value: number; currency: string }

/** Positions agrégées (LECTURE SEULE) de tous les comptes connectés. */
export async function listHoldings(userId: string, userSecret: string): Promise<Holding[]> {
  const accounts = await call('GET', '/accounts', { query: { userId, userSecret } }) as Array<Record<string, unknown>>
  const out: Holding[] = []
  for (const acc of accounts || []) {
    const accId = String(acc.id ?? '')
    if (!accId) continue
    try {
      const positions = await call('GET', `/accounts/${accId}/positions`, { query: { userId, userSecret } }) as Array<Record<string, unknown>>
      for (const p of positions || []) {
        const sym = (p.symbol as Record<string, unknown>) || {}
        const inner = (sym.symbol as Record<string, unknown>) || sym
        const ticker = String(inner.symbol ?? inner.ticker ?? '?')
        const units = Number(p.units ?? p.fractional_units ?? 0)
        const price = Number(p.price ?? 0)
        out.push({ sym: ticker, name: String(inner.description ?? inner.name ?? ticker), units, price, value: +(units * price).toFixed(2), currency: String((acc.currency as Record<string, unknown>)?.code ?? 'USD') })
      }
    } catch { /* compte illisible → ignoré, jamais fabriqué */ }
  }
  return out
}
