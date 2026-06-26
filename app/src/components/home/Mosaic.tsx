'use client'
import { useRouter } from 'next/navigation'
import type { NewsItem } from '@/lib/types'

interface Props { news: NewsItem[] }

function Tickers({ items, dark }: { items?: string[]; dark?: boolean }) {
  if (!items || items.length === 0) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
      {items.slice(0, 5).map((t, i) => (
        <span key={i} className="al-mono" style={{
          fontSize: 10.5, padding: '3px 8px', borderRadius: 6,
          background: dark ? 'rgba(255,255,255,.06)' : '#eef1fb',
          color: dark ? '#aab2bf' : '#4a40c0',
          border: `1px solid ${dark ? '#2b323b' : '#dcd9f6'}`,
        }}>{t}</span>
      ))}
    </div>
  )
}

export function Mosaic({ news }: Props) {
  // news[0] is the hero lead; the mosaic uses the next stories.
  const feature = news[1]
  const mover = news[2]
  const wide = news[3]
  const std1 = news[4]
  const std2 = news[5]
  const router = useRouter()
  const go = (item: NewsItem) => router.push(`/trade?news=${encodeURIComponent(item.id)}`)

  if (!feature && !mover && !wide && !std1 && !std2) {
    return (
      <section>
        <div className="al-mono" style={{ fontSize: 13, color: '#8b93a1', padding: '24px 0' }}>
          No additional market stories available right now.
        </div>
      </section>
    )
  }

  return (
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 16 }}>

      {/* Feature — 8 cols */}
      {feature && (
        <article className="al-card-hover" onClick={() => go(feature)} style={{ gridColumn: 'span 8', background: '#f7f4ec', border: '1px solid #e6e0d3', borderRadius: 14, padding: '26px 28px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase', color: '#2469a6' }}>{feature.category}</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#c0b9a8' }} />
            <span className="al-mono" style={{ fontSize: 11, color: '#8b93a1' }}>{feature.source} · {feature.time}</span>
            <span className="badge" style={{ marginLeft: 'auto', background: '#eef1fb', color: '#4a40c0', border: '1px solid #dcd9f6', fontSize: 10 }}>Featured</span>
          </div>
          <h3 className="al-serif al-link-hover" style={{ fontSize: 34, lineHeight: 1.06, fontWeight: 700, letterSpacing: '-.018em', marginBottom: 13 }}>{feature.title}</h3>
          <p className="al-serif" style={{ fontSize: 16.5, lineHeight: 1.5, color: '#3b414c', marginBottom: 18, flex: 1 }}>{feature.dek || feature.summary}</p>
          <Tickers items={feature.tickers} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e6e0d3', paddingTop: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#5b50d8' }}>✦ Price this event</span>
            <span style={{ color: '#5b50d8', fontSize: 16 }}>→</span>
          </div>
        </article>
      )}

      {/* Dark mover — 4 cols */}
      {mover && (
        <article className="al-card-hover" onClick={() => go(mover)} style={{ gridColumn: 'span 4', background: 'linear-gradient(165deg,#1a1f27,#11151b)', border: '1px solid #232a33', borderRadius: 14, padding: 20, cursor: 'pointer', color: '#fff', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#7eb0e8' }}>{mover.category}</span>
            <span className="badge" style={{ marginLeft: 'auto', background: 'rgba(255,255,255,.06)', color: '#aab2bf', border: '1px solid #2b323b', fontSize: 9.5 }}>{mover.time}</span>
          </div>
          <h4 className="al-serif" style={{ fontSize: 19, lineHeight: 1.18, fontWeight: 600, marginBottom: 'auto' }}>{mover.title}</h4>
          <Tickers items={mover.tickers} dark />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #232a33', paddingTop: 12, marginTop: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#a99bff' }}>✦ Price this event</span>
            <span style={{ color: '#a99bff' }}>→</span>
          </div>
        </article>
      )}

      {/* Wide — 8 cols */}
      {wide && (
        <article className="al-card-hover" onClick={() => go(wide)} style={{ gridColumn: 'span 8', background: '#f7f4ec', border: '1px solid #e6e0d3', borderRadius: 14, padding: '20px 22px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#2469a6' }}>{wide.category}</span>
            <span className="al-mono" style={{ fontSize: 10.5, color: '#8b93a1' }}>{wide.source} · {wide.time}</span>
          </div>
          <h4 className="al-serif al-link-hover" style={{ fontSize: 23, lineHeight: 1.14, fontWeight: 600, letterSpacing: '-.01em', marginBottom: 9 }}>{wide.title}</h4>
          <p style={{ fontSize: 13, lineHeight: 1.5, color: '#59606e', marginBottom: 14 }}>{wide.dek || wide.summary}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#5b50d8' }}>✦ Price this event</span>
            <span style={{ color: '#5b50d8' }}>→</span>
          </div>
        </article>
      )}

      {/* Standard ×2 — 4 cols each */}
      {[std1, std2].filter(Boolean).map((item, idx) => (
        <article key={idx} className="al-card-hover" onClick={() => go(item as NewsItem)} style={{ gridColumn: 'span 4', background: '#f7f4ec', border: '1px solid #e6e0d3', borderRadius: 14, padding: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#2469a6' }}>{(item as NewsItem).category}</span>
            <span className="al-mono" style={{ fontSize: 10.5, color: '#8b93a1' }}>{(item as NewsItem).time}</span>
          </div>
          <h4 className="al-serif al-link-hover" style={{ fontSize: 20, lineHeight: 1.16, fontWeight: 600, marginBottom: 9 }}>{(item as NewsItem).title}</h4>
          <p style={{ fontSize: 12.5, lineHeight: 1.5, color: '#59606e', marginBottom: 14, flex: 1 }}>{(item as NewsItem).dek || (item as NewsItem).summary}</p>
          <Tickers items={(item as NewsItem).tickers} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e6e0d3', paddingTop: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#5b50d8' }}>✦ Generate</span>
            <span style={{ color: '#5b50d8' }}>→</span>
          </div>
        </article>
      ))}

      {/* AD-UI promo — 4 cols (static feature promo, not data) */}
      <article style={{ gridColumn: 'span 4', background: 'radial-gradient(420px 200px at 80% -20%, rgba(91,80,216,.4), transparent), linear-gradient(165deg,#211d4a,#171432)', border: '1px solid #322c66', borderRadius: 14, padding: 20, cursor: 'pointer', color: '#fff', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div className="al-cta-sheen" style={{ width: 40, height: 40, borderRadius: 12, background: 'conic-gradient(from 0deg,#5b50d8,#2469a6,#2f9488,#5b50d8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14, animation: 'al-orb 6s linear infinite' }}>✦</div>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#a99bff', marginBottom: 6 }}>AD-UI · Adaptive composer</div>
        <h4 className="al-serif" style={{ fontSize: 21, lineHeight: 1.14, fontWeight: 600, marginBottom: 8 }}>Compose any article — your topic, your layout</h4>
        <p style={{ fontSize: 12.5, lineHeight: 1.5, color: '#c3bff0', marginBottom: 'auto' }}>Chat with AD-UI. It picks the right layout blocks, builds the article live, and lets you reorder or extend it on the fly.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 16 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>Open the composer</span>
          <span>→</span>
        </div>
      </article>

    </section>
  )
}
