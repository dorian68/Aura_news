// Minimal, dependency-free RSS 2.0 reader. Financial feeds (CNBC, MarketWatch,
// Nasdaq, Investing, Yahoo, Fed) are well-formed RSS — a focused regex parser
// is enough and avoids a dependency. Every fetch is fault-tolerant → [].

export interface RssItem {
  title: string
  link: string
  description: string
  publishedAt: string   // ISO
  source: string
}

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'", nbsp: ' ',
}

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&([a-z0-9#]+);/gi, (m, e) => ENTITIES[e.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim()
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'))
  return m ? decode(m[1]) : ''
}

function toIso(pub: string): string {
  const d = pub ? new Date(pub) : new Date()
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

export async function fetchRss(url: string, source: string): Promise<RssItem[]> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 8000)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AlphaLensBot/1.0)', Accept: 'application/rss+xml, application/xml, text/xml' },
      signal: ctrl.signal,
      cache: 'no-store',   // toujours du live pour l'ingesteur (pas de corpus figé)
    })
    if (!res.ok) return []
    const xml = await res.text()
    const blocks = xml.split(/<item(?:\s[^>]*)?>/i).slice(1)
    const items: RssItem[] = []
    for (const b of blocks) {
      const block = b.split(/<\/item>/i)[0]
      const title = tag(block, 'title')
      if (!title) continue
      items.push({
        title,
        link: tag(block, 'link'),
        description: tag(block, 'description') || tag(block, 'summary'),
        publishedAt: toIso(tag(block, 'pubDate') || tag(block, 'dc:date')),
        source,
      })
    }
    return items
  } catch {
    return []
  } finally {
    clearTimeout(timer)
  }
}
