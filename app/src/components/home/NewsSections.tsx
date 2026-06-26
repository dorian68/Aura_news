'use client'
import { useRouter } from 'next/navigation'
import type { NewsItem } from '@/lib/types'
import { SECTIONS } from '@/lib/news'

const SECTION_COLOR: Record<string, string> = {
  Equities: '#2469a6', Markets: '#2469a6', Macro: '#8a6d1e', World: '#c43d34', Tech: '#5b50d8', Crypto: '#0f7d56', Deals: '#2f9488',
}

// Editorial rubrics — broad coverage (NYT-style) over the remaining feed.
export function NewsSections({ news }: { news: NewsItem[] }) {
  const router = useRouter()
  const open = (n: NewsItem) => router.push(`/trade?news=${encodeURIComponent(n.id)}`)

  // Skip the stories already featured in the hero + mosaic (first 6).
  const rest = news.slice(6)
  const bySection = (s: string) => rest.filter(n => n.section === s).slice(0, 6)
  const active = SECTIONS.filter(s => bySection(s).length > 0)
  if (active.length === 0) return null

  return (
    <div style={{ marginTop: 8 }}>
      {active.map(section => {
        const items = bySection(section)
        const color = SECTION_COLOR[section] || '#59606e'
        return (
          <section key={section} style={{ marginBottom: 30 }}>
            {/* Rubric header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
              <h3 className="al-serif" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '.02em', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap', color: '#16181d' }}>
                {section}
              </h3>
              <div style={{ flex: 1, height: 1, background: '#d9d3c4' }} />
              <span className="al-mono" style={{ fontSize: 10.5, color: '#a9a18f', whiteSpace: 'nowrap' }}>{items.length} stories</span>
            </div>

            {/* Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {items.map(n => (
                <article key={n.id} className="al-card-hover" onClick={() => open(n)}
                  style={{ background: '#f7f4ec', border: '1px solid #e6e0d3', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '.07em', textTransform: 'uppercase', color }}>{section}</span>
                    <span className="al-mono" style={{ fontSize: 10, color: '#8b93a1', marginLeft: 'auto' }}>{n.source} · {n.time}</span>
                  </div>
                  <h4 className="al-serif al-link-hover" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.18, margin: '0 0 8px' }}>{n.title}</h4>
                  <p className="al-serif" style={{ fontSize: 13, lineHeight: 1.45, color: '#59606e', margin: '0 0 12px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.summary}</p>
                  <span className="al-mono" style={{ fontSize: 11, fontWeight: 700, color }}>✦ Signal →</span>
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
