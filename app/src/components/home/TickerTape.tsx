'use client'

export interface TickerItem {
  sym: string
  px: string
  chg: string
  col: string
}

export function TickerTape({ items = [] }: { items?: TickerItem[] }) {
  if (!items.length) return null
  const doubled = [...items, ...items]
  return (
    <div className="ticker-wrap" style={{ background: '#16181d', color: '#fff', borderBottom: '1px solid #2b2e36' }}>
      <div className="ticker-inner">
        {doubled.map((t, i) => (
          <span
            key={i}
            className="al-mono"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', fontSize: 12, borderRight: '1px solid #2b2e36' }}
          >
            <span style={{ color: '#b6bdc8', fontWeight: 500 }}>{t.sym}</span>
            <span style={{ fontWeight: 600 }}>{t.px}</span>
            <span style={{ color: t.col, fontWeight: 600 }}>{t.chg}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
