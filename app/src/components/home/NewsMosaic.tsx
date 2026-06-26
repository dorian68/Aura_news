'use client'
import { NewsCard, type NewsItem } from './NewsCard'
import { Skeleton } from '@/components/ui/Skeleton'

interface Props {
  items: NewsItem[]
  loading?: boolean
}

export function NewsMosaic({ items, loading }: Props) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="al-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Skeleton style={{ height: 12, width: '40%', borderRadius: 4 }} />
            <Skeleton style={{ height: 18, width: '90%', borderRadius: 4 }} />
            <Skeleton style={{ height: 14, width: '80%', borderRadius: 4 }} />
            <Skeleton style={{ height: 14, width: '60%', borderRadius: 4 }} />
            <Skeleton style={{ height: 36, borderRadius: 8, marginTop: 4 }} />
          </div>
        ))}
      </div>
    )
  }

  if (!items.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--al-text-muted)' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📡</div>
        <p style={{ fontSize: 14 }}>No news loaded. Configure your API keys to get live data.</p>
      </div>
    )
  }

  const [hero, ...rest] = items

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Hero article */}
      <NewsCard item={hero} variant="hero" />

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 14,
      }}>
        {rest.map(item => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
