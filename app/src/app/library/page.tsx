'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { GeneratedReport } from '@/lib/generation/output-schema'
import type { TradeReport } from '@/lib/generation/trade-prompt'
import { BrokerageConnect } from '@/components/BrokerageConnect'

export default function LibraryPage() {
  const router = useRouter()
  const { credits, savedReports, savedTradeReports, removeTradeReport, watchlist, openCreditsModal } = useAppStore()

  return (
    <div style={{ minHeight: '100vh', background: '#efeae0' }}>
      {/* Top bar */}
      <header style={{
        background: '#f7f4ec',
        borderBottom: '1px solid #16181d',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1180,
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Left: Home button */}
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#59606e',
              fontSize: 13.5,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 0',
              fontFamily: 'inherit',
            }}
          >
            ← Home
          </button>

          {/* Center: brand */}
          <span
            className="al-serif"
            style={{ fontSize: 19, fontWeight: 700, color: '#16181d', letterSpacing: '-0.01em' }}
          >
            AlphaLens Daily
          </span>

          {/* Right: credits button */}
          <button
            onClick={openCreditsModal}
            style={{
              background: '#fff',
              border: '1px solid #ddd6c6',
              borderRadius: 8,
              color: '#16181d',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 13px',
              fontFamily: 'inherit',
            }}
          >
            <span style={{ color: '#5b50d8' }}>✦</span>
            <span className="al-mono">{credits.plan === 'power' ? '∞' : credits.count}</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main
        className="al-rise"
        style={{ maxWidth: 1180, margin: '0 auto', padding: '30px 24px 60px' }}
      >
        {/* Page heading */}
        <h1
          className="al-serif"
          style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 6px' }}
        >
          My Research Library
        </h1>
        <p style={{ color: '#59606e', fontSize: 14, margin: '0 0 24px' }}>
          Your saved analyses, watchlist, and alerts — all in one place.
        </p>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 14,
          marginBottom: 28,
        }}>
          {[
            { label: 'Saved signals', value: savedTradeReports.length },
            { label: 'Saved reports', value: savedReports.length },
            { label: 'Watchlist',     value: watchlist.length },
            { label: 'Credits left',  value: credits.plan === 'power' ? '∞' : credits.count },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#f7f4ec',
                border: '1px solid #e6e0d3',
                borderRadius: 14,
                padding: '16px 18px',
              }}
            >
              <div
                className="al-mono"
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  color: '#8b93a1',
                  marginBottom: 7,
                }}
              >
                {stat.label}
              </div>
              <div
                className="al-mono"
                style={{ fontSize: 26, fontWeight: 600, color: '#16181d' }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Two-column grid (stacks on narrow screens) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

          {/* LEFT: reports list */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}>
              <h2
                className="al-serif"
                style={{ fontSize: 20, fontWeight: 600, margin: 0 }}
              >
                Saved reports
              </h2>
              <button
                onClick={() => router.push('/')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2469a6',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  padding: 0,
                }}
              >
                + New analysis
              </button>
            </div>

            {savedReports.length === 0 ? (
              <EmptyState onNavigate={() => router.push('/')} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {savedReports.map((r) => (
                  <ReportCard
                    key={r.id}
                    report={r}
                    onClick={() => router.push(`/article/${r.id}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: sidebar cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <WatchlistCard watchlist={watchlist} />
            <BrokerageConnect />
            <AlertsCard />
          </div>
        </div>

        {/* Signals — News → Portfolio */}
        <div style={{ marginTop: 34 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 className="al-serif" style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
              Signals — News → Portfolio
            </h2>
            <button onClick={() => router.push('/trade')} style={{ background: 'transparent', border: 'none', color: '#2469a6', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
              + New signal
            </button>
          </div>
          {savedTradeReports.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 13, padding: '30px 24px', textAlign: 'center' }}>
              <p style={{ color: '#59606e', fontSize: 14, margin: '0 0 16px' }}>No saved signals yet — open a news story and hit ★ Save.</p>
              <button className="btn btn-ai" onClick={() => router.push('/trade')} style={{ margin: '0 auto' }}>✦ Open Signals</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
              {savedTradeReports.map((r) => (
                <TradeReportCard key={r.id} report={r} onClick={() => router.push(`/trade?id=${r.id}`)} onRemove={() => removeTradeReport(r.id)} />
              ))}
            </div>
          )}
        </div>
      </main>

    </div>
  )
}

/* ── Report card ─────────────────────────────────────────── */

function ReportCard({ report, onClick }: { report: GeneratedReport; onClick: () => void }) {
  const timeLabel = new Date(report.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div
      className="al-card-hover"
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid #e6e0d3',
        borderRadius: 13,
        padding: '15px 17px',
        cursor: 'pointer',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#2469a6' }}>
          {report.angleId || 'Macro'}
        </span>
        <span className="badge badge-primary" style={{ fontSize: 10 }}>
          {report.snapshot?.impact || 'Market'}
        </span>
        <span
          className="al-mono"
          style={{ fontSize: 10.5, color: '#8b93a1', marginLeft: 'auto' }}
        >
          {timeLabel}
        </span>
      </div>

      {/* Title */}
      <h3
        className="al-serif"
        style={{
          fontSize: 17,
          fontWeight: 600,
          lineHeight: 1.2,
          margin: '0 0 9px',
          color: '#16181d',
        }}
      >
        {report.title}
      </h3>

      {/* Bottom row: assets + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {report.assets?.slice(0, 4).map((a) => (
          <span
            key={a.sym}
            className="al-mono"
            style={{
              fontSize: 10,
              padding: '2px 7px',
              background: '#f3f0e8',
              border: '1px solid #e6e0d3',
              borderRadius: 5,
              color: '#59606e',
            }}
          >
            {a.sym}
          </span>
        ))}
        <span className="al-link-hover" style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 600, color: '#2469a6' }}>
          Open →
        </span>
      </div>
    </div>
  )
}

/* ── Trade (Signals) report card ──────────────────────────── */

function TradeReportCard({ report, onClick, onRemove }: { report: TradeReport; onClick: () => void; onRemove: () => void }) {
  const timeLabel = new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return (
    <div className="al-card-hover" onClick={onClick} style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 13, padding: '15px 17px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <span className="al-mono" style={{ fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: '#2469a6', border: '1px solid #cbd9ea', borderRadius: 5, padding: '1px 6px' }}>Signal</span>
        <span className="al-mono" style={{ fontSize: 10.5, color: '#8b93a1' }}>{report.newsSource}</span>
        <span className="al-mono" style={{ fontSize: 10.5, color: '#8b93a1', marginLeft: 'auto' }}>{timeLabel}</span>
      </div>
      <h3 className="al-serif" style={{ fontSize: 16.5, fontWeight: 600, lineHeight: 1.2, margin: '0 0 9px', color: '#16181d' }}>{report.headline}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span className="al-mono" style={{ fontSize: 10, color: '#2469a6' }}>{report.relatedMarkets.length} market{report.relatedMarkets.length === 1 ? '' : 's'}</span>
        <span style={{ color: '#ccc' }}>·</span>
        {report.assets.slice(0, 4).map((a) => (
          <span key={a.sym} className="al-mono" style={{ fontSize: 10, padding: '2px 7px', background: '#f3f0e8', border: '1px solid #e6e0d3', borderRadius: 5, color: '#59606e' }}>{a.sym}</span>
        ))}
        <span className="al-link-hover" style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 600, color: '#c43d34', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onRemove() }}>Remove</span>
      </div>
    </div>
  )
}

/* ── Empty state ──────────────────────────────────────────── */

function EmptyState({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e6e0d3',
      borderRadius: 13,
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <p style={{ color: '#59606e', fontSize: 14, margin: '0 0 18px' }}>
        No reports yet — generate one from the home page.
      </p>
      <button className="btn btn-ai" onClick={onNavigate} style={{ margin: '0 auto' }}>
        ✦ Go to home page
      </button>
    </div>
  )
}

/* ── Watchlist card ───────────────────────────────────────── */

function WatchlistCard({ watchlist }: { watchlist: string[] }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e6e0d3',
      borderRadius: 14,
      padding: '16px 18px',
    }}>
      <h3
        className="al-serif"
        style={{ fontSize: 17, fontWeight: 600, margin: '0 0 12px', color: '#16181d' }}
      >
        Watchlist
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {watchlist.map((sym, i) => (
          <div
            key={sym}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '9px 0',
              borderBottom: i < watchlist.length - 1 ? '1px solid #f0ece1' : 'none',
            }}
          >
            <span className="al-mono" style={{ fontSize: 13, fontWeight: 600, color: '#16181d' }}>
              {sym}
            </span>
            <span style={{ flex: 1 }} />
          </div>
        ))}
        {watchlist.length === 0 && (
          <p style={{ fontSize: 13, color: '#8b93a1', margin: 0 }}>No symbols yet.</p>
        )}
      </div>
    </div>
  )
}

/* ── Alerts card (stub) ───────────────────────────────────── */

function AlertsCard() {
  // Honnêteté produit : pas de fausses alertes en dur. Tant que la feature n'est
  // pas branchée sur de vraies données, on affiche un état "à venir" explicite.
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e6e0d3',
      borderRadius: 14,
      padding: '16px 18px',
    }}>
      <h3
        className="al-serif"
        style={{ fontSize: 17, fontWeight: 600, margin: '0 0 12px', color: '#16181d' }}
      >
        Alerts &amp; saved searches
      </h3>
      <p style={{ fontSize: 13, color: '#8b93a1', margin: 0, lineHeight: 1.5 }}>
        No alerts yet. Price &amp; catalyst alerts are coming soon.
      </p>
    </div>
  )
}
