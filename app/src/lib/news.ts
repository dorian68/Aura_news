// Real market news — Finnhub (general/crypto/merger) + curated financial RSS
// (CNBC sections, MarketWatch, Nasdaq, Investing, Yahoo, the Fed), organized
// into editorial rubrics so the feed is broad. No mock fallback: [] on failure.

import type { NewsItem } from './types'
import { fetchRss } from './rss'
import { getDb } from './supabase'

const FINNHUB_KEY = process.env.FINNHUB_API_KEY || ''

// Ordered rubrics used by the home page. Equities (stocks) leads.
export const SECTIONS = ['Equities', 'Macro', 'World', 'Tech', 'Crypto', 'Deals', 'Markets'] as const

const cnbc = (id: string) => `https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=${id}`

// RSS sources with a rubric hint ('' = classify by keywords).
const RSS_FEEDS: { url: string; source: string; hint: string }[] = [
  { url: cnbc('100003114'), source: 'CNBC', hint: '' },            // Top News
  { url: cnbc('15839135'), source: 'CNBC', hint: 'Equities' },     // Markets
  { url: cnbc('10000664'), source: 'CNBC', hint: 'Equities' },     // Investing
  { url: cnbc('20910258'), source: 'CNBC', hint: 'Macro' },        // Economy
  { url: cnbc('19854910'), source: 'CNBC', hint: 'Tech' },         // Technology
  { url: 'http://feeds.marketwatch.com/marketwatch/topstories/', source: 'MarketWatch', hint: 'Equities' },
  { url: 'http://feeds.marketwatch.com/marketwatch/realtimeheadlines/', source: 'MarketWatch', hint: 'Equities' },
  { url: 'https://www.nasdaq.com/feed/rssoutbound?category=Markets', source: 'Nasdaq', hint: 'Equities' },
  { url: 'https://www.investing.com/rss/news_25.rss', source: 'Investing.com', hint: 'Equities' },
  { url: 'https://finance.yahoo.com/news/rssindex', source: 'Yahoo Finance', hint: '' },
  { url: 'https://www.federalreserve.gov/feeds/press_all.xml', source: 'Federal Reserve', hint: 'Macro' },
]

function relativeTime(iso: string): string {
  const mins = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000))
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function classify(title: string, summary: string, hint: string): string {
  const t = `${title} ${summary}`.toLowerCase()
  if (/iran|israel|ukraine|russia|\bchina\b|\bwar\b|election|trump|tariff|sanction|gaza|nato|nuclear|hezbollah|geopolit/.test(t)) return 'World'
  if (/\bfed\b|inflation|\bcpi\b|\bgdp\b|rate cut|rate hike|interest rate|\becb\b|treasury|yields?|jobs report|unemployment|powell|recession|fomc|central bank/.test(t)) return 'Macro'
  if (hint === 'Crypto' || /bitcoin|\bbtc\b|ethereum|\beth\b|crypto|blockchain|stablecoin/.test(t)) return 'Crypto'
  if (hint === 'Deals' || /merger|acquisition|acquires|takeover|buyout|\bm&a\b/.test(t)) return 'Deals'
  if (hint) return hint  // Equities / Tech / Macro feed default
  if (/\bai\b|nvidia|semiconductor|\bchip|software|openai|cloud computing/.test(t)) return 'Tech'
  if (/stock|shares|earnings|nasdaq|s&p|dow jones|\bipo\b|guidance|quarterly|revenue|dividend|buyback|analyst|upgrade|downgrade/.test(t)) return 'Equities'
  return 'Markets'
}

const normKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60)

async function fetchFinnhub(category: string): Promise<Record<string, unknown>[]> {
  if (!FINNHUB_KEY) return []
  try {
    const res = await fetch(`https://finnhub.io/api/v1/news?category=${category}&token=${FINNHUB_KEY}`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch { return [] }
}

/** The live flow: broad, sectioned, multi-source. Used by the ingester. */
export async function fetchLiveNews(): Promise<NewsItem[]> {
  const [general, crypto, merger, ...rssResults] = await Promise.all([
    fetchFinnhub('general'),
    fetchFinnhub('crypto'),
    fetchFinnhub('merger'),
    ...RSS_FEEDS.map(f => fetchRss(f.url, f.source)),
  ])

  const seen = new Set<string>()
  const out: NewsItem[] = []

  const push = (id: string, title: string, summary: string, source: string, publishedAt: string, hint: string, tickers: string[]) => {
    if (!title) return
    const key = normKey(title)
    if (!key || seen.has(key) || seen.has(id)) return
    seen.add(key); seen.add(id)
    out.push({
      id, title, summary, dek: summary, source, publishedAt,
      time: relativeTime(publishedAt),
      category: source.toUpperCase(),
      section: classify(title, summary, hint),
      tickers,
    })
  }

  // Finnhub
  const fh = (raw: Record<string, unknown>, hint: string) => {
    const headline = raw.headline as string, summary = raw.summary as string
    if (!headline || !summary) return
    const publishedAt = new Date((raw.datetime as number) * 1000).toISOString()
    push(String(raw.id || raw.url || headline), headline, summary, (raw.source as string) || 'Finnhub', publishedAt, hint, (raw.related as string)?.split(',').filter(Boolean) ?? [])
  }
  general.forEach(r => fh(r, ''))
  crypto.forEach(r => fh(r, 'Crypto'))
  merger.forEach(r => fh(r, 'Deals'))

  // RSS
  rssResults.forEach((items, i) => {
    const hint = RSS_FEEDS[i].hint
    for (const it of items) {
      push(it.link || it.title, it.title, it.description, it.source, it.publishedAt, hint, [])
    }
  })

  out.sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
  return out.slice(0, 140)
}

// ── The stock: read from / write to Supabase ──

interface ArticleRow {
  id: string; title: string; summary: string | null; source: string | null
  section: string | null; category: string | null; published_at: string | null; tickers: string[] | null
}

function rowToItem(r: ArticleRow): NewsItem {
  const publishedAt = r.published_at ?? new Date().toISOString()
  return {
    id: r.id, title: r.title, summary: r.summary ?? '', dek: r.summary ?? '',
    source: r.source ?? 'Markets', publishedAt, time: relativeTime(publishedAt),
    category: r.category ?? undefined, section: r.section ?? 'Markets', tickers: r.tickers ?? [],
  }
}

/** Read the stored article corpus (the stock). [] if DB not configured/empty. */
export async function getArticles(limit = 140): Promise<NewsItem[]> {
  const db = getDb()
  if (!db) return []
  const { data, error } = await db
    .from('alphalens_articles').select('*').order('published_at', { ascending: false }).limit(limit)
  if (error || !data) return []
  return (data as ArticleRow[]).map(rowToItem)
}

/** Ingest the live flow into the stock (idempotent upsert on dedup_key). */
export async function ingestArticles(): Promise<{ inserted: number; configured: boolean }> {
  const db = getDb()
  if (!db) return { inserted: 0, configured: false }
  const live = await fetchLiveNews()
  const rows = live.map(n => ({
    id: n.id, dedup_key: normKey(n.title), title: n.title, summary: n.summary ?? '',
    source: n.source, section: n.section, category: n.category, published_at: n.publishedAt, tickers: n.tickers ?? [],
  })).filter(r => r.dedup_key)
  let inserted = 0
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100)
    const { error } = await db.from('alphalens_articles').upsert(chunk, { onConflict: 'dedup_key', ignoreDuplicates: false })
    if (!error) inserted += chunk.length
  }
  return { inserted, configured: true }
}

/**
 * Public read API. Serves the stored corpus (the stock); falls back to the live
 * flow before the first ingest or when the DB isn't configured.
 */
export async function fetchNews(): Promise<NewsItem[]> {
  const stored = await getArticles()
  return stored.length ? stored : fetchLiveNews()
}
