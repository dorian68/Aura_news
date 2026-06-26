'use client'
import { useRouter } from 'next/navigation'
import type { NewsItem } from '@/lib/types'

const WATCH_COLORS = ['#8a6d1e', '#2469a6', '#0f7d56', '#5b50d8']

export function HeroSection({ news }: { news: NewsItem[] }) {
  const lead = news[0]
  const watching = news.slice(1, 5)
  const router = useRouter()
  const open = (n: NewsItem) => router.push(`/trade?news=${encodeURIComponent(n.id)}`)

  if (!lead) {
    return (
      <section style={{ borderBottom: '1px solid #16181d', paddingBottom: 30, marginBottom: 26 }}>
        <div className="al-mono" style={{ fontSize: 13, color: '#8b93a1', padding: '40px 0' }}>
          No live market news available right now (Finnhub returned no items).
        </div>
      </section>
    )
  }

  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1.62fr 1fr', gap: 30, borderBottom: '1px solid #16181d', paddingBottom: 30, marginBottom: 26 }}>
      {/* Lead article */}
      <article
        style={{ cursor: 'pointer' }}
        onClick={() => open(lead)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase', color: '#2469a6' }}>
            {lead.category || 'MARKETS'}
          </span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#c0b9a8' }} />
          <span className="al-mono" style={{ fontSize: 11, color: '#8b93a1' }}>{lead.source} · {lead.time || 'recent'}</span>
        </div>

        <h2
          className="al-serif al-link-hover"
          style={{ fontSize: 46, lineHeight: 1.04, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 14, margin: '0 0 14px' }}
        >
          {lead.title}
        </h2>

        <p className="al-serif" style={{ fontSize: 18.5, lineHeight: 1.5, color: '#3b414c', marginBottom: 16 }}>
          {lead.dek || lead.summary}
        </p>

        {(lead.tickers && lead.tickers.length > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
            {lead.tickers.slice(0, 6).map((t, i) => (
              <span key={i} className="al-mono" style={{ fontSize: 11.5, fontWeight: 500, padding: '4px 9px', borderRadius: 7, background: '#eef1fb', color: '#4a40c0', border: '1px solid #dcd9f6' }}>
                {t}
              </span>
            ))}
          </div>
        )}

        <button
          className="btn btn-ai"
          onClick={(e) => { e.stopPropagation(); open(lead) }}
        >
          ✦ Price this event
        </button>
      </article>

      {/* AI Desk — fed by real headlines */}
      <aside style={{ background: 'linear-gradient(180deg,#181b22,#121419)', borderRadius: 16, padding: '18px 18px 16px', color: '#fff', alignSelf: 'start', boxShadow: '0 18px 50px rgba(20,26,40,.2)', position: 'relative', overflow: 'hidden' }}>
        <span style={{ position: 'absolute', top: -40, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(91,80,216,.35), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 18, height: 18, borderRadius: 6, background: 'conic-gradient(from 0deg,#5b50d8,#2469a6,#2f9488,#5b50d8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, animation: 'al-orbspin 6s linear infinite' }}>✦</span>
            <span className="al-mono" style={{ fontSize: 11, letterSpacing: '.12em', color: '#cfd3db', textTransform: 'uppercase' }}>AlphaLens AI Desk</span>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: '#3ddc97' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3ddc97', animation: 'al-pulse 1.8s infinite' }} />
            Live
          </span>
        </div>

        <div className="al-mono" style={{ fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b7180', marginBottom: 8, position: 'relative' }}>What the desk is watching</div>
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {watching.map((w, i) => (
            <div
              key={w.id}
              className="al-mday-chip"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 8px', borderBottom: '1px solid #262a33', borderRadius: 8 }}
              onClick={() => open(w)}
            >
              <span style={{ width: 8, height: 8, borderRadius: 2, background: WATCH_COLORS[i % WATCH_COLORS.length], flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#eef0f3', lineHeight: 1.2 }}>{w.title}</div>
                <div className="al-mono" style={{ fontSize: 9.5, color: '#7a818e', letterSpacing: '.04em', textTransform: 'uppercase', marginTop: 1 }}>{w.category || w.source}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#a99bff', whiteSpace: 'nowrap' }}>Generate →</span>
            </div>
          ))}
          {watching.length === 0 && (
            <div className="al-mono" style={{ fontSize: 11, color: '#6b7180', padding: '12px 0' }}>No further headlines.</div>
          )}
        </div>

        <button className="btn btn-sm al-cta-sheen" style={{ width: '100%', marginTop: 14, background: 'linear-gradient(90deg,#5b50d8,#4a40c0)', color: '#fff', border: 'none', position: 'relative', fontWeight: 700 }}>
          ✦ Ask AlphaLens anything
        </button>
      </aside>
    </section>
  )
}
