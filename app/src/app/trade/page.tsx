'use client'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { TokenMeter } from '@/components/ui/TokenMeter'
import type { NewsItem } from '@/lib/types'
import type { TradeReport, TradeRelatedMarket, TradeAsset, TradeScenario } from '@/lib/generation/trade-prompt'

const DIR: Record<string, { c: string; a: string }> = {
  up: { c: '#0f7d56', a: '▲' }, down: { c: '#c43d34', a: '▼' }, neutral: { c: '#8b93a1', a: '→' },
}
const REL: Record<string, string> = { direct: '#0f7d56', related: '#2469a6', tangential: '#8b93a1' }

export default function TradePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#efeae0' }} />}>
      <TradeInner />
    </Suspense>
  )
}

function TradeInner() {
  const params = useSearchParams()
  const { watchlist, addToWatchlist, removeFromWatchlist, addTokenUsage, savedTradeReports, saveTradeReport } = useAppStore()
  const [news, setNews] = useState<NewsItem[]>([])
  const [selected, setSelected] = useState<string>(params.get('news') || '')
  const [report, setReport] = useState<TradeReport | null>(null)
  const [status, setStatus] = useState('Loading the story…')
  const [progress, setProgress] = useState(8)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(true)
  const [tickerInput, setTickerInput] = useState('')
  const init = useRef(false)
  const isSaved = !!report && savedTradeReports.some(r => r.id === report.id)

  const generate = useCallback(async (newsId: string) => {
    setBusy(true); setReport(null); setError(null); setProgress(8); setStatus('Loading the story…')
    try {
      const res = await fetch('/api/news-trade', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId, watchlist }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      let buf = '', ev = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split('\n'); buf = lines.pop() || ''
        for (const line of lines) {
          if (line.startsWith('event: ')) ev = line.slice(7).trim()
          else if (line.startsWith('data: ') && ev) {
            try {
              const d = JSON.parse(line.slice(6))
              if (ev === 'status') { setProgress(d.pct); setStatus(d.step) }
              else if (ev === 'usage') addTokenUsage(d.input || 0, d.output || 0)
              else if (ev === 'complete') { setReport(d.report); setBusy(false) }
              else if (ev === 'error') { setError(d.message); setBusy(false) }
            } catch { /* ignore */ }
            ev = ''
          }
        }
      }
    } catch (err) { setError(`Generation failed: ${String(err)}`); setBusy(false) }
  }, [watchlist, addTokenUsage])

  // Load today's stories once. If ?id= points to a saved report, render it
  // directly; otherwise generate for the selected (or top) story.
  useEffect(() => {
    if (init.current) return
    init.current = true
    const idParam = params.get('id')
    fetch('/api/news').then(r => r.json()).then((list: NewsItem[]) => {
      setNews(list)
      if (idParam) {
        const saved = savedTradeReports.find(r => r.id === idParam)
        if (saved) { setReport(saved); setSelected(saved.newsId); setBusy(false); return }
      }
      const id = params.get('news') || list[0]?.id || ''
      setSelected(id)
      if (id) generate(id)
      else { setBusy(false); setError('No live news available.') }
    }).catch(() => { setBusy(false); setError('Failed to load news.') })
  }, [generate, params, savedTradeReports])

  const pick = (id: string) => { setSelected(id); generate(id) }
  const addTicker = () => {
    const s = tickerInput.trim().toUpperCase()
    if (s) { addToWatchlist(s); setTickerInput('') }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#efeae0', color: '#16181d' }}>
      {/* Bar */}
      <div style={{ borderBottom: '1px solid #ded7c7', background: '#f7f4ec' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#16181d', fontSize: 13, fontWeight: 600 }}>← AlphaLens Daily</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <TokenMeter />
            {report && (
              <button className="btn btn-sm" onClick={() => saveTradeReport(report)} disabled={isSaved}
                style={{ fontWeight: 700, background: isSaved ? '#e8f5ef' : '#fff', border: '1px solid #ddd6c6', color: isSaved ? '#0f7d56' : '#16181d' }}>
                {isSaved ? '✓ Saved' : '★ Save'}
              </button>
            )}
            <button className="btn btn-sm btn-ai" onClick={() => selected && generate(selected)} disabled={busy} style={{ fontWeight: 700 }}>↻ Regenerate</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '26px 24px 80px' }}>
        <div className="al-mono" style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#5b50d8', marginBottom: 6 }}>✦ News → Portfolio</div>
        <h1 className="al-serif" style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 16px' }}>
          What this news means for your book
        </h1>

        {/* Story selector */}
        {news.length > 0 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 14 }}>
            {news.slice(0, 8).map(n => (
              <button key={n.id} onClick={() => pick(n.id)} disabled={busy} style={{
                whiteSpace: 'nowrap', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis',
                fontSize: 12, padding: '6px 11px', borderRadius: 8, cursor: busy ? 'default' : 'pointer',
                border: `1px solid ${selected === n.id ? '#5b50d8' : '#ded7c7'}`,
                background: selected === n.id ? '#efecfb' : '#fff', color: selected === n.id ? '#3b3470' : '#59606e',
                fontWeight: selected === n.id ? 700 : 500, fontFamily: 'inherit',
              }}>{n.title.slice(0, 46)}{n.title.length > 46 ? '…' : ''}</button>
            ))}
          </div>
        )}

        {/* Watchlist editor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 22, padding: '10px 14px', background: '#fff', border: '1px solid #e6e0d3', borderRadius: 12 }}>
          <span className="al-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em', color: '#8b93a1' }}>Watchlist</span>
          {watchlist.map(s => (
            <span key={s} className="al-mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, padding: '3px 8px', borderRadius: 7, background: '#eef1fb', color: '#4a40c0', border: '1px solid #dcd9f6' }}>
              {s}<button onClick={() => removeFromWatchlist(s)} style={{ background: 'none', border: 'none', color: '#8b93a1', cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: 0 }}>×</button>
            </span>
          ))}
          <input value={tickerInput} onChange={e => setTickerInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTicker()} placeholder="+ ticker"
            className="al-mono" style={{ width: 80, border: '1px solid #e6e0d3', borderRadius: 7, padding: '3px 8px', fontSize: 11.5, outline: 'none' }} />
          <span style={{ fontSize: 10.5, color: '#a9a18f' }}>add a ticker, then ↻ to re-run with it</span>
        </div>

        {error ? (
          <div style={{ background: '#fde8e8', border: '1px solid #f3c8c8', borderRadius: 14, padding: 20, textAlign: 'center', color: '#c43d34' }}>{error}</div>
        ) : busy || !report ? (
          <Loader status={status} progress={progress} />
        ) : (
          <Report report={report} />
        )}
      </div>
    </div>
  )
}

function Report({ report }: { report: TradeReport }) {
  return (
    <>
      <div style={{ marginBottom: 22 }}>
        <div className="al-mono" style={{ fontSize: 11, color: '#8b93a1', marginBottom: 6 }}>{report.newsSource} · {report.newsTitle}</div>
        <h2 className="al-serif" style={{ fontSize: 27, fontWeight: 700, lineHeight: 1.12, margin: '0 0 8px' }}>{report.headline}</h2>
        <p className="al-serif" style={{ fontSize: 16.5, lineHeight: 1.5, color: '#3b414c', margin: 0 }}>{report.thesis}</p>
      </div>

      {/* Key takeaways — GS Briefings style */}
      {report.keyTakeaways && report.keyTakeaways.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 12, padding: '14px 18px', marginBottom: 24 }}>
          <div className="al-mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#5b50d8', marginBottom: 10 }}>Key takeaways</div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {report.keyTakeaways.map((t, i) => (
              <li key={i} className="al-serif" style={{ fontSize: 15, lineHeight: 1.5, color: '#2b2f37' }}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Portfolio impact — the bridge to your book */}
      {report.portfolioImpact && (
        <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start', background: '#eef1fb', border: '1px solid #dcd9f6', borderRadius: 12, padding: '13px 16px', marginBottom: 24 }}>
          <span style={{ fontSize: 16 }}>📌</span>
          <div>
            <div className="al-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#4a40c0', marginBottom: 3 }}>Impact on your book</div>
            <p className="al-serif" style={{ fontSize: 15.5, lineHeight: 1.45, color: '#2b2f37', margin: 0 }}>{report.portfolioImpact}</p>
          </div>
        </div>
      )}

      {/* Related markets */}
      <Section title="Markets already pricing this">
        {report.relatedMarkets.length === 0 ? (
          <div className="al-mono" style={{ fontSize: 12.5, color: '#8b93a1', padding: '6px 0' }}>
            ⓘ No prediction market is pricing this story directly. The asset linkage below carries the read.
          </div>
        ) : report.relatedMarkets.map((m, i) => <MarketRow key={i} m={m} />)}
      </Section>

      {/* Assets */}
      <Section title="What it touches in your book">
        {report.assets.length === 0 ? (
          <div className="al-mono" style={{ fontSize: 12.5, color: '#8b93a1', padding: '6px 0' }}>
            ⓘ No specific asset linkage for this story — see the markets and narrative above.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {report.assets.map((a, i) => <AssetCard key={i} a={a} />)}
          </div>
        )}
      </Section>

      {/* Scenarios — qualitative unless a real market covers them */}
      {report.scenarios && report.scenarios.length > 0 && (
        <Section title="Scenarios">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {report.scenarios.map((s, i) => <ScenarioRow key={i} s={s} />)}
          </div>
        </Section>
      )}

      {/* Priced / not priced */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 26 }}>
        <ListCard title="Already priced in" items={report.pricedIn} color="#8b93a1" />
        <ListCard title="Not yet priced in" items={report.notPricedIn} color="#5b50d8" />
      </div>

      {/* The briefing — long-form GS-style article (grounded on the markets/assets above) */}
      {report.sections && report.sections.length > 0 && (
        <Section title="The briefing">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {report.sections.map((sec, i) => (
              <div key={i}>
                <h3 className="al-serif" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.01em', margin: '0 0 8px' }}>{sec.heading}</h3>
                {sec.body.split(/\n\s*\n+/).filter(Boolean).map((para, j) => (
                  <p key={j} className="al-serif" style={{ fontSize: 15.5, lineHeight: 1.68, color: '#3b414c', margin: '0 0 11px' }}>{para.trim()}</p>
                ))}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Watch */}
      {report.watch.length > 0 && (
        <Section title="What to watch next">
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {report.watch.map((w, i) => <li key={i} className="al-serif" style={{ fontSize: 15, lineHeight: 1.6, color: '#2b2f37' }}>{w}</li>)}
          </ul>
        </Section>
      )}

      {/* Take */}
      <div style={{ borderLeft: '3px solid #5b50d8', background: '#f1effb', padding: '14px 18px', borderRadius: '0 10px 10px 0', marginBottom: 18 }}>
        <span className="al-mono" style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#5b50d8' }}>✦ AlphaLens read</span>
        <p className="al-serif" style={{ fontSize: 16, lineHeight: 1.5, color: '#3b3470', margin: '5px 0 0' }}>{report.finalTake}</p>
      </div>

      <p className="al-mono" style={{ fontSize: 10.5, color: '#a9a18f' }}>
        Market %: real Polymarket implied probabilities · asset views are AlphaLens&apos;s own. Research &amp; education only — not investment advice.
      </p>
    </>
  )
}

function MarketRow({ m }: { m: TradeRelatedMarket }) {
  return (
    <a href={m.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block', background: '#fff', border: '1px solid #e6e0d3', borderRadius: 11, padding: '12px 14px', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
        <span className="al-mono" style={{ fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: REL[m.relevance] || '#8b93a1', border: `1px solid ${REL[m.relevance] || '#8b93a1'}`, borderRadius: 5, padding: '1px 6px' }}>{m.relevance}</span>
        <span className="al-serif" style={{ fontSize: 14.5, fontWeight: 600, flex: 1 }}>{m.question}</span>
        <span className="al-mono" style={{ fontSize: 17, fontWeight: 700, color: '#2469a6' }}>{m.yesPct}%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{ flex: 1, height: 6, background: '#eee8db', borderRadius: 99 }}>
          <div style={{ width: `${m.yesPct}%`, height: '100%', background: '#2469a6', borderRadius: 99 }} />
        </div>
        <span className="al-mono" style={{ fontSize: 10, color: '#a9a18f' }}>${Math.round(m.volume ?? 0).toLocaleString()} vol · Polymarket ↗</span>
      </div>
      <p style={{ fontSize: 12.5, lineHeight: 1.45, color: '#59606e', margin: 0 }}>{m.link}</p>
    </a>
  )
}

function AssetCard({ a }: { a: TradeAsset }) {
  const d = DIR[a.direction] || DIR.neutral
  return (
    <div style={{ background: a.inWatchlist ? '#f1effb' : '#fff', border: `1px solid ${a.inWatchlist ? '#dcd9f6' : '#e6e0d3'}`, borderRadius: 11, padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span className="al-mono" style={{ fontSize: 14, fontWeight: 700 }}>{a.sym}</span>
        <span style={{ color: d.c, fontWeight: 700, fontSize: 13 }}>{d.a}</span>
        {a.inWatchlist && <span className="al-mono" style={{ fontSize: 8.5, color: '#5b50d8', border: '1px solid #dcd9f6', borderRadius: 5, padding: '1px 5px' }}>WATCHLIST</span>}
        {typeof a.changePct === 'number' && <span className="al-mono" style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: a.changePct >= 0 ? '#0f7d56' : '#c43d34' }}>{a.changePct >= 0 ? '+' : ''}{a.changePct.toFixed(2)}%</span>}
      </div>
      <div className="al-mono" style={{ fontSize: 9.5, color: '#a9a18f', marginBottom: 5 }}>{a.horizon}</div>
      <p style={{ fontSize: 12.5, lineHeight: 1.45, color: '#59606e', margin: 0 }}>{a.reason}</p>
    </div>
  )
}

function ScenarioRow({ s }: { s: TradeScenario }) {
  const hasMarket = typeof s.prob === 'number'
  return (
    <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 11, padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
        <span className="al-serif" style={{ fontSize: 15.5, fontWeight: 600, flex: 1 }}>{s.label}</span>
        {hasMarket ? (
          <a href={s.marketUrl} target="_blank" rel="noreferrer" className="al-mono" style={{ fontSize: 15, fontWeight: 700, color: '#2469a6', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {s.prob}% <span style={{ fontSize: 9, color: '#a9a18f' }}>market ↗</span>
          </a>
        ) : (
          <span className="al-mono" style={{ fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: '#8b93a1', border: '1px solid #ddd6c6', borderRadius: 5, padding: '1px 6px', whiteSpace: 'nowrap' }}>directional</span>
        )}
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.5, color: '#59606e', margin: 0 }}>{s.impact}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 26 }}>
      <div className="al-mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#5b50d8', marginBottom: 11 }}>{title}</div>
      {children}
    </section>
  )
}

function ListCard({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 12, padding: '14px 16px' }}>
      <div className="al-mono" style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '.06em', color, marginBottom: 8 }}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {items.map((it, i) => <li key={i} style={{ fontSize: 13.5, lineHeight: 1.55, color: '#3b414c' }}>{it}</li>)}
        {items.length === 0 && <li style={{ fontSize: 13, color: '#a9a18f', listStyle: 'none', marginLeft: -16 }}>—</li>}
      </ul>
    </div>
  )
}

function Loader({ status, progress }: { status: string; progress: number }) {
  return (
    <div style={{ maxWidth: 460, margin: '40px auto', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 54, height: 54, margin: '0 auto 18px' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 0deg,#5b50d8,#2469a6,#2f9488,#5b50d8)', animation: 'al-orb 2s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 5, borderRadius: '50%', background: '#efeae0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, color: '#5b50d8' }}>✦</div>
      </div>
      <div style={{ background: '#dcd5c6', borderRadius: 99, height: 5, overflow: 'hidden', marginBottom: 11 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#5b50d8,#2469a6)', borderRadius: 99, transition: 'width .5s ease' }} />
      </div>
      <p className="al-mono" style={{ fontSize: 12, color: '#8b93a1' }}>{status}</p>
    </div>
  )
}
