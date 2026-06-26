export interface RawArticle {
  id: string
  title: string
  summary: string
  url: string
  source: string
  publishedAt: string
  tickers?: string[]
  category?: string
}

const RSS_FEEDS = [
  { url: 'https://feeds.reuters.com/reuters/businessNews', source: 'Reuters' },
  { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', source: 'CNBC' },
  { url: 'https://feeds.marketwatch.com/marketwatch/marketpulse', source: 'MarketWatch' },
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15839069', source: 'CNBC Markets' },
]

const FINNHUB_BASE = 'https://finnhub.io/api/v1'

export async function fetchFinnhubNews(apiKey: string, category = 'general'): Promise<RawArticle[]> {
  const now = Math.floor(Date.now() / 1000)
  const from = now - 60 * 60 * 6 // last 6h

  const res = await fetch(
    `${FINNHUB_BASE}/news?category=${category}&from=${from}&to=${now}&token=${apiKey}`,
    { next: { revalidate: 300 } }
  )

  if (!res.ok) return []

  const data = await res.json()
  return (data || []).slice(0, 30).map((item: Record<string, unknown>) => ({
    id: String(item.id || item.url),
    title: item.headline as string,
    summary: item.summary as string,
    url: item.url as string,
    source: item.source as string,
    publishedAt: new Date((item.datetime as number) * 1000).toISOString(),
    tickers: (item.related as string)?.split(',').filter(Boolean) ?? [],
    category,
  }))
}

export async function fetchRssFeed(feedUrl: string, sourceName: string): Promise<RawArticle[]> {
  try {
    const res = await fetch(`/api/rss?url=${encodeURIComponent(feedUrl)}`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) return []
    const items = await res.json()
    return items.map((item: Record<string, unknown>, i: number) => ({
      id: `${sourceName}-${i}-${Date.now()}`,
      title: item.title as string,
      summary: item.description as string,
      url: item.link as string,
      source: sourceName,
      publishedAt: item.pubDate as string,
    }))
  } catch {
    return []
  }
}

export { RSS_FEEDS }
