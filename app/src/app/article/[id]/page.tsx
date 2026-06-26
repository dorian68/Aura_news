'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { GeneratedReport } from '@/lib/generation/output-schema'
import { ANGLES } from '@/lib/generation/prompts'
import type { PolyMarket } from '@/app/api/polymarket/route'

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { savedReports, activeReport, saveReport, removeReport, credits, openCreditsModal } = useAppStore()
  const [report, setReport] = useState<GeneratedReport | null>(null)
  const [saved, setSaved] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [polyMarket, setPolyMarket] = useState<PolyMarket | null>(null)

  useEffect(() => {
    const found = activeReport?.id === id
      ? activeReport
      : savedReports.find(r => r.id === id) || null
    setReport(found)
    setSaved(savedReports.some(r => r.id === id))

    // Fetch Polymarket odds
    if (found?.snapshot?.event) {
      fetch(`/api/polymarket?q=${encodeURIComponent(found.snapshot.event)}`)
        .then(r => r.json())
        .then((markets: PolyMarket[]) => { if (markets?.[0]) setPolyMarket(markets[0]) })
        .catch(() => {})
    }
  }, [id, savedReports, activeReport])

  if (!report) {
    return (
      <div style={{ minHeight: '100vh', background: '#efeae0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#59606e', marginBottom: 16, fontSize: 14 }}>Report not found.</p>
          <button className="btn btn-ai btn-sm" onClick={() => router.push('/')}>← Back to news</button>
        </div>
      </div>
    )
  }

  function toggleSave() {
    if (saved) { removeReport(report!.id); setSaved(false) }
    else { saveReport(report!); setSaved(true) }
  }

  const angleName = ANGLES[report.angleId]?.label || report.angleId
  const timestamp = new Date(report.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  const yesW = `${report.pred?.yes ?? 0}%`
  const noW = `${report.pred?.no ?? 0}%`
  const confNum = parseInt(report.confPct) || 72
  const confLabel = confNum >= 80 ? 'High' : confNum >= 60 ? 'Medium' : 'Low'
  const confW = report.confPct || '72%'

  const scenarioColors = ['#0f7d56', '#2469a6', '#c43d34']
  const scenarioTypes = ['BULL', 'BASE', 'BEAR']

  function sevStyle(sev: string): { bg: string; col: string; bd: string } {
    if (sev === 'high') return { bg: '#fde8e8', col: '#c43d34', bd: '#f3c8c8' }
    if (sev === 'medium') return { bg: '#fef3e2', col: '#c06a0c', bd: '#f6e0bc' }
    return { bg: '#efeefb', col: '#4a40c0', bd: '#ddd9f6' }
  }

  function assetColor(dir: string) {
    if (dir === 'up') return '#0f7d56'
    if (dir === 'down') return '#c43d34'
    return '#8b93a1'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#efeae0' }}>

      {/* ── Slim bar ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(247,244,236,.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #d9d3c4' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <button className="btn btn-sm" style={{ background: 'transparent', color: '#59606e' }} onClick={() => router.push('/')}>← All news</button>
          <div className="al-serif" style={{ fontSize: 18, fontWeight: 700 }}>AlphaLens <span style={{ fontStyle: 'italic', fontWeight: 500 }}>Daily</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn btn-sm" style={{ background: '#fff', border: '1px solid #ddd6c6', color: '#16181d', gap: 5 }} onClick={openCreditsModal}>
              <span style={{ color: '#5b50d8' }}>✦</span>
              <span className="al-mono" style={{ fontWeight: 600 }}>{credits.count}</span>
            </button>
            <button className="btn btn-sm" style={{ background: '#fff', border: '1px solid #ddd6c6', color: '#184a73' }} onClick={toggleSave}>
              {saved ? '★ Saved' : '☆ Save'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="al-rise" style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 24px 70px', display: 'grid', gridTemplateColumns: '1fr 332px', gap: 42, alignItems: 'start' }}>

        {/* ── ARTICLE ── */}
        <article>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase', color: '#2469a6' }}>Market Intelligence</span>
            <span className="badge badge-primary">{angleName}</span>
            <span className="al-mono" style={{ fontSize: 11, color: '#8b93a1' }}>{timestamp} · 1 credit used</span>
          </div>
          <h1 className="al-serif" style={{ fontSize: 42, lineHeight: 1.07, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 14 }}>{report.title}</h1>
          <p className="al-serif" style={{ fontSize: 19, fontStyle: 'italic', lineHeight: 1.45, color: '#3b414c', marginBottom: 20 }}>{report.subtitle}</p>

          {/* Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 20, borderBottom: '1px solid #e6e0d3', marginBottom: 22 }}>
            <button className="btn btn-sm btn-ai" onClick={() => router.push('/')}>↻ Reprice with another market angle</button>
            <button className="btn btn-sm" style={{ background: '#fff', border: '1px solid #ddd6c6', color: '#16181d' }} onClick={toggleSave}>
              {saved ? '★ Saved' : '☆ Save'}
            </button>
            <button className="btn btn-sm" style={{ background: '#fff', border: '1px solid #ddd6c6', color: '#16181d' }}>⤴ Share snapshot</button>
          </div>

          {/* ── Event Pricing Snapshot ── */}
          <div style={{ background: '#16181d', borderRadius: 16, padding: '20px 22px', marginBottom: 22, color: '#fff', border: '1px solid #2b2e36' }}>
            <div className="al-mono" style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a99bff', marginBottom: 14 }}>Event Pricing Snapshot</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div className="al-mono" style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>Event being priced</div>
                  <div className="al-serif" style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3, color: '#eef0f3' }}>{report.snapshot?.event}</div>
                </div>
                <div>
                  <div className="al-mono" style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 7 }}>Market belief</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, color: '#3ddc97' }}>YES</span>
                        <span className="al-mono" style={{ fontWeight: 600, color: '#3ddc97' }}>{report.pred?.yes}%</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: '#2b2e36', overflow: 'hidden' }}>
                        <span style={{ display: 'block', height: '100%', background: '#0f7d56', width: yesW }} />
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, color: '#ff8a7a' }}>NO</span>
                        <span className="al-mono" style={{ fontWeight: 600, color: '#ff8a7a' }}>{report.pred?.no}%</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: '#2b2e36', overflow: 'hidden' }}>
                        <span style={{ display: 'block', height: '100%', background: '#c43d34', width: noW }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="al-mono" style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>AlphaLens fair probability</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span className="al-mono" style={{ fontSize: 26, fontWeight: 600, color: '#cfc8ff' }}>{report.pred?.alpha}%</span>
                    <span className="al-mono" style={{ fontSize: 11, color: '#6b7280' }}>YES</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderLeft: '1px solid #2b2e36', paddingLeft: 16 }}>
                <div>
                  <div className="al-mono" style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>Consensus gap</div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.45, color: '#aab2bf' }}>{report.pred?.compareNote}</div>
                </div>
                {report.assets?.length > 0 && (
                  <div>
                    <div className="al-mono" style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Main affected assets</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {report.assets.slice(0, 4).map(a => (
                        <span key={a.sym} className="al-mono" style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: '#23262f', border: '1px solid #2b2e36', color: '#cfc8ff' }}>{a.sym}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <div className="al-mono" style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>Impact direction</div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.45, color: '#aab2bf' }}>{report.snapshot?.impact}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Crowd vs AlphaLens ── */}
          <div style={{ background: 'linear-gradient(180deg,#181b22,#121419)', borderRadius: 14, padding: '18px 20px', marginBottom: 26, color: '#fff', border: '1px solid #232a33' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ width: 16, height: 16, borderRadius: 5, background: 'conic-gradient(from 0deg,#5b50d8,#2469a6,#2f9488,#5b50d8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, animation: 'al-orbspin 6s linear infinite' }}>✦</span>
              <span className="al-mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#cfd3db' }}>Crowd vs AlphaLens</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid #262a33', borderRadius: 10, padding: '12px 13px', textAlign: 'center' }}>
                <div className="al-mono" style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Crowd prices</div>
                <div className="al-mono" style={{ fontSize: 26, fontWeight: 600, color: '#cfd3db' }}>{report.pred?.yes}%</div>
                <div style={{ fontSize: 10.5, color: '#8a93a0', marginTop: 2 }}>YES</div>
              </div>
              <div style={{ background: 'rgba(91,80,216,.12)', border: '1px solid rgba(91,80,216,.3)', borderRadius: 10, padding: '12px 13px', textAlign: 'center' }}>
                <div className="al-mono" style={{ fontSize: 9, color: '#a99bff', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>AlphaLens prices</div>
                <div className="al-mono" style={{ fontSize: 26, fontWeight: 600, color: '#cfc8ff' }}>{report.pred?.alpha}%</div>
                <div style={{ fontSize: 10.5, color: '#a99bff', marginTop: 2 }}>YES</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid #262a33', borderRadius: 10, padding: '12px 13px', textAlign: 'center' }}>
                <div className="al-mono" style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Gap</div>
                <div className="al-mono" style={{ fontSize: 26, fontWeight: 600, color: '#ff8a7a' }}>{report.pred?.gap}</div>
                <div style={{ fontSize: 10.5, color: '#8a93a0', marginTop: 2 }}>pts</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid #262a33', borderLeft: '3px solid #a99bff', borderRadius: 10, padding: '11px 13px' }}>
              <div className="al-mono" style={{ fontSize: 8.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#a99bff', marginBottom: 4 }}>Read</div>
              <div style={{ fontSize: 12.5, color: '#aab2bf', lineHeight: 1.45 }}>{report.pred?.compareNote}</div>
            </div>
          </div>

          {/* ── Scenario Pricing ── */}
          {report.scenarios?.length > 0 && (
            <section style={{ marginBottom: 26 }}>
              <h3 className="al-serif" style={{ fontSize: 23, fontWeight: 600, marginBottom: 14 }}>Scenario Pricing</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                {report.scenarios.slice(0, 3).map((s, i) => {
                  const col = scenarioColors[i] || '#8b93a1'
                  const type = scenarioTypes[i] || s.label
                  return (
                    <div key={i} style={{ background: '#fff', border: '1px solid #e6e0d3', borderTop: `3px solid ${col}`, borderRadius: 12, padding: '15px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', color: col }}>{type}</span>
                        <span className="al-mono" style={{ fontSize: 13, fontWeight: 600, color: col }}>{s.prob}%</span>
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.55, color: '#3b414c', marginBottom: 10 }}>{s.impact}</p>
                      <div className="al-mono" style={{ fontSize: 11, color: '#8b93a1', borderTop: '1px solid #f0ece1', paddingTop: 8 }}>
                        {s.assets?.join(', ') || s.label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── Asset Impact ── */}
          {report.assets?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, background: '#16181d', borderRadius: 16, padding: '18px 20px', marginBottom: 26, color: '#fff' }}>
              <div style={{ borderRight: '1px solid #2b2e36', paddingRight: 18 }}>
                <div className="al-mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#8b93a1', marginBottom: 8 }}>Asset impact</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span className="al-mono" style={{ fontSize: 34, fontWeight: 600 }}>72</span>
                  <span className="al-mono" style={{ fontSize: 13, color: '#8b93a1' }}>/100</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', marginTop: 2 }}>Moderate</div>
                <div style={{ height: 5, borderRadius: 99, background: '#2b2e36', overflow: 'hidden', marginTop: 10 }}>
                  <span style={{ display: 'block', height: '100%', background: 'linear-gradient(90deg,#5b50d8,#2469a6)', width: '72%' }} />
                </div>
              </div>
              <div>
                <div className="al-mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#8b93a1', marginBottom: 10 }}>Affected assets</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {report.assets.map(a => (
                    <div key={a.sym} style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#23262f', border: '1px solid #2b2e36', borderRadius: 9, padding: '7px 11px', minWidth: 96 }}>
                      <span className="al-mono" style={{ fontSize: 12, fontWeight: 600 }}>{a.sym}</span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span className="al-mono" style={{ fontSize: 12, color: '#c6cad2' }}>{a.name}</span>
                        <span className="al-mono" style={{ fontSize: 11, fontWeight: 600, color: assetColor(a.direction) }}>
                          {a.direction === 'up' ? '▲' : a.direction === 'down' ? '▼' : '→'} {a.magnitude}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Priced In / Not Priced ── */}
          {(report.pricedIn?.length > 0 || report.notPricedIn?.length > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 26 }}>
              <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase', color: '#0f7d56', marginBottom: 11 }}>What is priced in</div>
                {report.pricedIn?.map((pi, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid #f0ece1' }}>
                    <span style={{ color: '#0f7d56', fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 12.5, lineHeight: 1.4, color: '#3b414c' }}>{pi}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase', color: '#c43d34', marginBottom: 11 }}>Not fully priced</div>
                {report.notPricedIn?.map((npi, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid #f0ece1' }}>
                    <span style={{ color: '#c43d34', fontSize: 13, flexShrink: 0, marginTop: 1 }}>◌</span>
                    <span style={{ fontSize: 12.5, lineHeight: 1.4, color: '#3b414c' }}>{npi}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── What would break this pricing ── */}
          {report.risks?.length > 0 && (
            <section style={{ marginBottom: 30 }}>
              <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 14, padding: '16px 18px' }}>
                <h4 className="al-serif" style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>What would break this pricing</h4>
                {report.risks.map((r, i) => {
                  const s = sevStyle(r.severity)
                  return (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0ece1' }}>
                      <span className="badge" style={{ background: s.bg, color: s.col, border: `1px solid ${s.bd}`, flexShrink: 0, height: 20, fontSize: 10 }}>{r.severity.toUpperCase()}</span>
                      <span style={{ fontSize: 12.5, lineHeight: 1.45, color: '#3b414c' }}>{r.label}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── Sources ── */}
          {report.sources?.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
              <span className="badge badge-positive" style={{ gap: 5 }}><span style={{ fontWeight: 800 }}>✓</span>Sources checked</span>
              <span className="al-mono" style={{ fontSize: 11, color: '#8b93a1' }}>Source headlines used:</span>
              {report.sources.map((s, i) => (
                <span key={i} className="al-mono" style={{ fontSize: 11, color: '#59606e', background: '#f3f0e8', border: '1px solid #e6e0d3', padding: '3px 8px', borderRadius: 6 }}>{s.name}</span>
              ))}
            </div>
          )}

          {/* ── Executive summary ── */}
          {report.executiveSummary && (
            <div style={{ borderLeft: '3px solid #5b50d8', padding: '2px 0 2px 20px', marginBottom: 30 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase', color: '#5b50d8', marginBottom: 9 }}>Executive summary</div>
              <p className="al-serif" style={{ fontSize: 20, lineHeight: 1.5, color: '#22262e' }}>{report.executiveSummary}</p>
            </div>
          )}

          {/* ── Prose sections ── */}
          {report.sections?.map((s, i) => (
            <section key={i} style={{ marginBottom: 26 }}>
              <h3 className="al-serif" style={{ fontSize: 23, fontWeight: 600, letterSpacing: '-.01em', marginBottom: 10 }}>{s.heading}</h3>
              <p className="al-serif" style={{ fontSize: 16.5, lineHeight: 1.62, color: '#2f343d' }}>{s.body}</p>
            </section>
          ))}

          {/* ── AlphaLens Pricing Take ── */}
          <section style={{ background: '#f7f4ec', border: '1px solid #e6e0d3', borderRadius: 16, padding: '22px 24px', marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase', color: '#2469a6', marginBottom: 10 }}>AlphaLens Pricing Take</div>
            <p className="al-serif" style={{ fontSize: 18, lineHeight: 1.55, color: '#22262e' }}>{report.finalTake}</p>
          </section>

          <p style={{ fontSize: 11.5, lineHeight: 1.55, color: '#8b93a1', borderTop: '1px solid #e6e0d3', paddingTop: 16 }}>
            Generated analysis is for research and education only. Not financial advice. AI-generated — verify with independent sources. All market figures in this prototype are fictional.
          </p>
        </article>

        {/* ── RAIL (sidebar) ── */}
        <aside style={{ position: 'sticky', top: 70, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Market Belief — Polymarket live odds */}
          <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 38px rgba(20,26,40,.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f0ece1' }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#59606e' }}>Market Belief</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {polyMarket && (
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#5b50d8', background: '#efeefb', border: '1px solid #ddd9f6', borderRadius: 4, padding: '1px 5px' }}>POLYMARKET</span>
                )}
                <span className="al-mono" style={{ fontSize: 9.5, color: '#8b93a1', border: '1px solid #e6e0d3', borderRadius: 5, padding: '2px 6px' }}>INFORMATIONAL</span>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <div className="al-serif" style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3, marginBottom: 14 }}>
                {polyMarket ? polyMarket.question : report.snapshot?.event}
              </div>
              {/* YES/NO bars */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#0f7d56' }}>YES</span>
                    <span className="al-mono" style={{ fontWeight: 600 }}>{polyMarket ? polyMarket.yes : report.pred?.yes}%</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 99, background: '#eef0f3', overflow: 'hidden' }}>
                    <span style={{ display: 'block', height: '100%', background: '#0f7d56', width: `${polyMarket ? polyMarket.yes : report.pred?.yes}%` }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#c43d34' }}>NO</span>
                    <span className="al-mono" style={{ fontWeight: 600 }}>{polyMarket ? polyMarket.no : report.pred?.no}%</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 99, background: '#eef0f3', overflow: 'hidden' }}>
                    <span style={{ display: 'block', height: '100%', background: '#c43d34', width: `${polyMarket ? polyMarket.no : report.pred?.no}%` }} />
                  </div>
                </div>
              </div>
              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14, marginTop: 14 }}>
                <div>
                  <div className="al-mono" style={{ fontSize: 9.5, color: '#8b93a1', textTransform: 'uppercase', letterSpacing: '.05em' }}>Volume</div>
                  <div className="al-mono" style={{ fontSize: 13, fontWeight: 600 }}>{polyMarket?.volume || '$2.4M'}</div>
                </div>
                <div>
                  <div className="al-mono" style={{ fontSize: 9.5, color: '#8b93a1', textTransform: 'uppercase', letterSpacing: '.05em' }}>Liquidity</div>
                  <div className="al-mono" style={{ fontSize: 13, fontWeight: 600 }}>{polyMarket?.liquidity || 'High'}</div>
                </div>
                <div>
                  <div className="al-mono" style={{ fontSize: 9.5, color: '#8b93a1', textTransform: 'uppercase', letterSpacing: '.05em' }}>24h</div>
                  <div className="al-mono" style={{ fontSize: 13, fontWeight: 600, color: polyMarket?.change24hColor || '#0f7d56' }}>{polyMarket?.change24h || '+3.2%'}</div>
                </div>
              </div>
              <button className="btn btn-sm" style={{ width: '100%', justifyContent: 'center', background: '#16181d', color: '#fff', marginBottom: 8 }} onClick={() => setShowCompare(v => !v)}>
                Compare Crowd vs AlphaLens
              </button>
              {polyMarket?.url && (
                <a href={polyMarket.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ width: '100%', justifyContent: 'center', display: 'flex', background: '#fff', border: '1px solid #ddd6c6', color: '#16181d', textDecoration: 'none', marginBottom: 8 }}>
                  View market on Polymarket →
                </a>
              )}
              {showCompare && (
                <div style={{ marginTop: 12, background: '#efeefb', border: '1px solid #ddd9f6', borderRadius: 10, padding: '11px 12px' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: '#4a40c0', marginBottom: 6 }}>AlphaLens vs market</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: '#59606e' }}>Market-implied (crowd)</span>
                    <span className="al-mono" style={{ fontWeight: 600 }}>{polyMarket ? polyMarket.yes : report.pred?.yes}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#59606e' }}>AlphaLens estimate</span>
                    <span className="al-mono" style={{ fontWeight: 600, color: '#4a40c0' }}>{report.pred?.alpha}%</span>
                  </div>
                  <p style={{ fontSize: 11, lineHeight: 1.45, color: '#59606e', marginTop: 8 }}>{report.pred?.compareNote}</p>
                </div>
              )}
              <p style={{ fontSize: 10, lineHeight: 1.45, color: '#8b93a1', marginTop: 11 }}>
                {polyMarket ? 'Prediction-market data from Polymarket. Informational only — not available in all jurisdictions.' : 'Prediction-market data is shown for informational purposes only.'}
              </p>
            </div>
          </div>

          {/* Pricing Confidence */}
          <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 16, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#59606e' }}>Pricing confidence</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#5b50d8' }}>{confLabel}</span>
            </div>
            <div style={{ height: 7, borderRadius: 99, background: '#eef0f3', overflow: 'hidden', marginBottom: 10 }}>
              <span style={{ display: 'block', height: '100%', background: 'linear-gradient(90deg,#5b50d8,#2469a6)', width: confW }} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.07em', textTransform: 'uppercase', color: '#59606e', marginBottom: 6 }}>Why</div>
            {report.confReasons?.map((cr, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '4px 0' }}>
                <span style={{ color: '#5b50d8', fontSize: 11, flexShrink: 0, marginTop: 1 }}>▸</span>
                <span style={{ fontSize: 11.5, lineHeight: 1.4, color: '#8b93a1' }}>{cr}</span>
              </div>
            ))}
          </div>

          {/* Sources */}
          {report.sources?.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 16, padding: 16 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#59606e', marginBottom: 11 }}>Sources & data used</div>
              {report.sources.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f0ece1' }}>
                  <span style={{ fontSize: 12, color: '#3b414c' }}>{s.name}</span>
                  <span className="al-mono" style={{ fontSize: 10.5, color: '#8b93a1' }}>live</span>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
