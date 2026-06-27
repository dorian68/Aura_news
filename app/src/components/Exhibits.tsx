// Exhibits « equity research » — blocs plein-largeur façon note Goldman/NYT.
// Données RÉELLES uniquement (Yahoo/Finnhub), attachées à l'hydratation.
import type { Exhibit, SeriesPointT, FundamentalT } from '@/lib/generation/trade-prompt'

const PALETTE = ['#0f7d56', '#2469a6', '#d8a13a', '#7d4fd8', '#c43d34', '#2f9488']

function ExhibitCard({ source, children }: { source?: string; children: React.ReactNode }) {
  return (
    <div style={{ clear: 'both', margin: '18px 0 22px' }}>
      <div style={{ border: '1px solid #e6e0d3', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>{children}</div>
      {source && <div className="al-mono" style={{ fontSize: 10.5, color: '#a9a18f', marginTop: 7 }}>{source}</div>}
    </div>
  )
}

function KeyInsight({ text }: { text?: string }) {
  if (!text) return null
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
        <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid #cdd8cf', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#0f7d56' }}>◷</span>
        <span className="al-mono" style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#5b6b5e' }}>Key insight</span>
      </div>
      <p className="al-serif" style={{ fontSize: 13.5, lineHeight: 1.55, color: '#3b414c', margin: 0 }}>{text}</p>
    </div>
  )
}

function Legend({ series }: { series?: SeriesPointT[] }) {
  if (!series?.length) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
      {series.map((s, i) => (
        <span key={s.ticker} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: PALETTE[i % PALETTE.length] }} />
          <span className="al-mono" style={{ fontSize: 11, color: '#3b414c' }}>{s.ticker}</span>
        </span>
      ))}
    </div>
  )
}

function MultiLineChart({ series }: { series: SeriesPointT[] }) {
  if (!series.length) return null
  const W = 720, H = 240, padL = 38, padR = 12, padT = 10, padB = 18
  const all = series.flatMap(s => s.points)
  let min = Math.min(...all), max = Math.max(...all)
  const span = (max - min) * 0.08 || 1; min -= span; max += span
  const x = (i: number, len: number) => padL + (len <= 1 ? 0 : (i / (len - 1)) * (W - padL - padR))
  const y = (v: number) => padT + (1 - (v - min) / (max - min || 1)) * (H - padT - padB)
  const ticks = 4
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="none" style={{ display: 'block', height: 220 }}>
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const v = min + (max - min) * i / ticks, yy = y(v)
        return (
          <g key={i}>
            <line x1={padL} y1={yy} x2={W - padR} y2={yy} stroke="#ece7da" strokeWidth={1} />
            <text x={padL - 5} y={yy + 3} textAnchor="end" fontSize="9" fill="#a9a18f" fontFamily="monospace">{Math.round(v)}</text>
          </g>
        )
      })}
      {min < 100 && max > 100 && <line x1={padL} y1={y(100)} x2={W - padR} y2={y(100)} stroke="#c9c1b0" strokeWidth={1} strokeDasharray="3 3" />}
      {series.map((s, si) => (
        <polyline key={s.ticker} points={s.points.map((v, i) => `${x(i, s.points.length).toFixed(1)},${y(v).toFixed(1)}`).join(' ')} fill="none" stroke={PALETTE[si % PALETTE.length]} strokeWidth={1.6} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}

function LineChartExhibit({ e }: { e: Extract<Exhibit, { type: 'linechart' }> }) {
  return (
    <ExhibitCard source="Source: Yahoo Finance · 1Y weekly, normalized to 100">
      <div className="al-exhibit-row" style={{ display: 'flex' }}>
        <div style={{ flex: '1 1 66%', minWidth: 0, padding: '16px 18px' }}>
          <div className="al-serif" style={{ fontSize: 16, fontWeight: 700 }}>{e.title}</div>
          {e.subtitle && <div className="al-mono" style={{ fontSize: 10, color: '#8b93a1', marginBottom: 8 }}>{e.subtitle}</div>}
          <Legend series={e.series} />
          <MultiLineChart series={e.series || []} />
        </div>
        <div style={{ flex: '0 0 32%', background: '#f3f0e8', borderLeft: '1px solid #e6e0d3', padding: '16px 16px' }}>
          <KeyInsight text={e.insight} />
        </div>
      </div>
    </ExhibitCard>
  )
}

function MetricGridExhibit({ e }: { e: Extract<Exhibit, { type: 'metricgrid' }> }) {
  const f = e.fundamentals || []
  if (!f.length) return null
  const Metric = ({ label, value, color }: { label: string; value: string; color?: string }) => (
    <div style={{ marginTop: 11 }}>
      <div className="al-mono" style={{ fontSize: 9.5, color: '#8b93a1', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
      <div className="al-mono" style={{ fontSize: 17, fontWeight: 700, color: color || '#16181d', marginTop: 1 }}>{value}</div>
    </div>
  )
  return (
    <ExhibitCard source="Source: Finnhub · profile & key metrics">
      <div className="al-exhibit-row" style={{ display: 'flex' }}>
        {f.map((c, i) => (
          <div key={c.ticker} style={{ flex: 1, minWidth: 0, padding: '16px 16px', borderLeft: i ? '1px solid #f0ece1' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 26 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {c.logo ? <img src={c.logo} alt="" width={20} height={20} style={{ borderRadius: 4, objectFit: 'contain' }} /> : null}
              <span className="al-serif" style={{ fontSize: 15, fontWeight: 700 }}>{c.name.split(' ')[0]}</span>
            </div>
            <Metric label="Market Cap" value={c.marketCapLabel} />
            <Metric label="P/E (TTM)" value={c.pe} color="#2469a6" />
            <Metric label="Revenue Growth (YoY)" value={c.revGrowth} color={c.revGrowth.startsWith('-') ? '#c43d34' : '#0f7d56'} />
          </div>
        ))}
      </div>
    </ExhibitCard>
  )
}

function parseMetric(f: FundamentalT, metric: 'revGrowth' | 'pe'): number {
  const raw = metric === 'pe' ? f.pe : f.revGrowth
  const n = parseFloat(String(raw).replace(/[^0-9.+-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function BarChart({ bars, suffix }: { bars: { label: string; value: number }[]; suffix: string }) {
  if (!bars.length) return null
  const W = 460, H = 200, padT = 24, padB = 24, padL = 8, padR = 8
  const max = Math.max(...bars.map(b => Math.abs(b.value))) || 1
  const bw = (W - padL - padR) / bars.length
  const zero = H - padB
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', height: 190 }}>
      <line x1={padL} y1={zero} x2={W - padR} y2={zero} stroke="#ece7da" strokeWidth={1} />
      {bars.map((b, i) => {
        const h = (Math.abs(b.value) / max) * (H - padT - padB)
        const cx = padL + i * bw + bw / 2
        return (
          <g key={b.label}>
            <rect x={cx - bw * 0.3} y={zero - h} width={bw * 0.6} height={h} fill="#2e8b57" rx={2} />
            <text x={cx} y={zero - h - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill="#16181d" fontFamily="monospace">{b.value}{suffix}</text>
            <text x={cx} y={zero + 14} textAnchor="middle" fontSize="10" fill="#59606e" fontFamily="monospace">{b.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function Checklist({ title, items, kind }: { title: string; items: string[]; kind: 'bull' | 'bear' }) {
  const icon = kind === 'bull' ? '✓' : '✕'
  const col = kind === 'bull' ? '#0f7d56' : '#c43d34'
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>{kind === 'bull' ? '🐂' : '🐻'}</span>
        <span className="al-serif" style={{ fontSize: 14, fontWeight: 700 }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: kind === 'bull' ? '#e7f3ec' : '#fbe9e8', color: col, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0, marginTop: 1 }}>{icon}</span>
            <span style={{ fontSize: 12.5, lineHeight: 1.4, color: '#3b414c' }}>{it}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BarChartExhibit({ e }: { e: Extract<Exhibit, { type: 'barchart' }> }) {
  const f = e.fundamentals || []
  const bars = f.map(x => ({ label: x.ticker, value: parseMetric(x, e.metric) })).filter(b => b.value !== 0)
  const suffix = e.metric === 'pe' ? '' : '%'
  return (
    <ExhibitCard source="Source: Finnhub · key metrics">
      <div className="al-exhibit-row" style={{ display: 'flex' }}>
        {e.thesisBullets?.length ? (
          <div style={{ flex: '0 0 32%', background: '#f3f0e8', borderRight: '1px solid #e6e0d3', padding: '16px 16px' }}>
            <Checklist title={e.thesisTitle || 'Bull Thesis Summary'} items={e.thesisBullets} kind="bull" />
          </div>
        ) : null}
        <div style={{ flex: 1, minWidth: 0, padding: '16px 18px' }}>
          <div className="al-serif" style={{ fontSize: 15, fontWeight: 700, textAlign: 'center' }}>{e.title}</div>
          <BarChart bars={bars} suffix={suffix} />
        </div>
        {e.insight ? (
          <div style={{ flex: '0 0 26%', background: '#f3f0e8', borderLeft: '1px solid #e6e0d3', padding: '16px 16px' }}>
            <KeyInsight text={e.insight} />
          </div>
        ) : null}
      </div>
    </ExhibitCard>
  )
}

function impactColor(s: string): string {
  const t = s.toLowerCase()
  if (t.startsWith('high')) return '#c43d34'
  if (t.includes('medium-high') || t.includes('med-high')) return '#d8843a'
  if (t.startsWith('medium')) return '#caa53a'
  return '#59606e'
}

function RiskTableExhibit({ e }: { e: Extract<Exhibit, { type: 'risktable' }> }) {
  return (
    <ExhibitCard>
      <div className="al-exhibit-row" style={{ display: 'flex' }}>
        <div style={{ flex: '0 0 38%', background: '#fbf1f0', borderRight: '1px solid #f0ddda', padding: '16px 16px' }}>
          <Checklist title={e.risksTitle || 'Key Risks'} items={e.risks || []} kind="bear" />
        </div>
        <div style={{ flex: 1, minWidth: 0, padding: '14px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 8, padding: '0 0 8px', borderBottom: '1px solid #ece7da' }}>
            {['Risk Factor', 'Impact', 'Likelihood'].map(h => <span key={h} className="al-mono" style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '.05em', color: '#8b93a1' }}>{h}</span>)}
          </div>
          {(e.rows || []).map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 8, padding: '9px 0', borderBottom: '1px solid #f4efe4', alignItems: 'center' }}>
              <span className="al-serif" style={{ fontSize: 13, fontWeight: 600 }}>{r.factor}</span>
              <span className="al-mono" style={{ fontSize: 12, fontWeight: 700, color: impactColor(r.impact) }}>{r.impact}</span>
              <span className="al-mono" style={{ fontSize: 12, color: '#59606e' }}>{r.likelihood}</span>
            </div>
          ))}
        </div>
      </div>
    </ExhibitCard>
  )
}

function VerdictExhibit({ e }: { e: Extract<Exhibit, { type: 'verdict' }> }) {
  const bullish = /bull/i.test(e.rating)
  return (
    <ExhibitCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px' }}>
        <span style={{ fontSize: 22 }}>★</span>
        <div>
          <div className="al-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8b93a1' }}>Overall View</div>
          <div className="al-serif" style={{ fontSize: 21, fontWeight: 700, color: bullish ? '#0f7d56' : '#c43d34', margin: '2px 0' }}>{e.rating}</div>
          <div className="al-mono" style={{ fontSize: 11, color: '#59606e' }}>{e.horizon}{e.note ? ` · ${e.note}` : ''}</div>
        </div>
      </div>
    </ExhibitCard>
  )
}

/** Dispatcher : rend l'exhibit selon son type. Données manquantes → rien (jamais de fabrication). */
export function ExhibitBlock({ exhibit }: { exhibit: Exhibit }) {
  switch (exhibit.type) {
    case 'linechart': return exhibit.series?.length ? <LineChartExhibit e={exhibit} /> : null
    case 'metricgrid': return exhibit.fundamentals?.length ? <MetricGridExhibit e={exhibit} /> : null
    case 'barchart': return exhibit.fundamentals?.length ? <BarChartExhibit e={exhibit} /> : null
    case 'risktable': return (exhibit.rows?.length || exhibit.risks?.length) ? <RiskTableExhibit e={exhibit} /> : null
    case 'verdict': return exhibit.rating ? <VerdictExhibit e={exhibit} /> : null
    default: return null
  }
}
