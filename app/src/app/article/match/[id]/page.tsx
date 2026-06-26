'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { MatchWarmup } from '@/lib/types'

export default function MatchReportPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { savedMatchReports, saveMatchReport } = useAppStore()
  const [warmup, setWarmup] = useState<MatchWarmup | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const found = savedMatchReports.find(r => r.id === id) || null
    if (!found) {
      router.push('/warmup')
      return
    }
    setWarmup(found)
    setSaved(true)
  }, [id, savedMatchReports, router])

  if (!warmup) {
    return (
      <div style={{ minHeight: '100vh', background: '#efeae0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="al-mono" style={{ fontSize: 12, color: '#8b93a1' }}>Loading report…</span>
        </div>
      </div>
    )
  }

  function handleSave() {
    if (!warmup) return
    saveMatchReport(warmup)
    setSaved(true)
  }

  const confNum = parseInt(warmup.confPct) || 72
  const confLabel = confNum >= 80 ? 'High' : confNum >= 60 ? 'Medium' : 'Low'

  const scenarioColors = ['#0f7d56', '#2469a6', '#c43d34']

  function last5Chips(last5: string) {
    return last5.split('').map((c, i) => {
      const bg = c === 'W' ? '#e8f5ef' : c === 'D' ? '#fef3e2' : '#fde8e8'
      const col = c === 'W' ? '#0f7d56' : c === 'D' ? '#c06a0c' : '#c43d34'
      const bd = c === 'W' ? '#c8ead8' : c === 'D' ? '#f6e0bc' : '#f3c8c8'
      return (
        <span key={i} className="al-mono" style={{ fontSize: 11, fontWeight: 700, color: col, background: bg, border: `1px solid ${bd}`, borderRadius: 5, padding: '1px 5px' }}>
          {c}
        </span>
      )
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#efeae0' }}>

      {/* Slim sticky bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(247,244,236,.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #d9d3c4' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <button className="btn btn-sm" style={{ background: 'transparent', color: '#59606e' }} onClick={() => router.push('/warmup')}>
            ← Back to World Cup Desk
          </button>
          <div className="al-serif" style={{ fontSize: 18, fontWeight: 700 }}>
            AlphaLens <span style={{ fontStyle: 'italic', fontWeight: 500 }}>Daily</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn btn-sm" style={{ background: '#fff', border: '1px solid #ddd6c6', color: saved ? '#0f7d56' : '#16181d' }} onClick={handleSave}>
              {saved ? '★ Saved' : '☆ Save'}
            </button>
            <button className="btn btn-sm" style={{ background: '#fff', border: '1px solid #ddd6c6', color: '#59606e' }}>
              ⤴ Share
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="al-rise" style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 24px 70px', display: 'grid', gridTemplateColumns: '1fr 332px', gap: 42, alignItems: 'start' }}>

        {/* MAIN COLUMN */}
        <article>

          {/* Match header */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="al-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#2469a6', background: '#eef4fb', border: '1px solid #c2d8ef', borderRadius: 5, padding: '2px 7px' }}>
                Group
              </span>
              <span className="al-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#5b50d8', background: '#efeefb', border: '1px solid #ddd9f6', borderRadius: 5, padding: '2px 7px' }}>
                {warmup.angleId}
              </span>
              {warmup.status === 'live' && (
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#3ddc97', background: 'rgba(61,220,151,.12)', border: '1px solid rgba(61,220,151,.3)', borderRadius: 5, padding: '2px 7px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3ddc97', animation: 'al-blink 1.2s step-end infinite', display: 'inline-block' }} />
                  LIVE
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 40 }}>{warmup.aFlag}</span>
                <h1 className="al-serif" style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-.02em', margin: 0, lineHeight: 1 }}>{warmup.aName}</h1>
              </div>
              <div style={{ textAlign: 'center' }}>
                {warmup.score ? (
                  <div className="al-mono" style={{ fontSize: 36, fontWeight: 700, color: '#16181d', letterSpacing: '.04em' }}>
                    {warmup.score.replace('-', ' – ')}
                  </div>
                ) : (
                  <div className="al-mono" style={{ fontSize: 18, color: '#8b93a1' }}>vs</div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 40 }}>{warmup.bFlag}</span>
                <h1 className="al-serif" style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-.02em', margin: 0, lineHeight: 1 }}>{warmup.bName}</h1>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <h2 className="al-serif" style={{ fontSize: 22, fontWeight: 600, color: '#3b414c', margin: '0 0 4px' }}>{warmup.title}</h2>
              <p style={{ margin: 0, fontSize: 14, color: '#59606e', fontStyle: 'italic' }}>{warmup.subtitle}</p>
            </div>
          </div>

          {/* Executive Summary */}
          <div style={{ borderLeft: '3px solid #5b50d8', background: '#f7f4ec', borderRadius: '0 12px 12px 0', padding: 15, marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase', color: '#5b50d8', marginBottom: 8 }}>Executive Summary</div>
            <p className="al-serif" style={{ fontSize: 16, lineHeight: 1.55, color: '#22262e', margin: 0 }}>{warmup.executiveSummary}</p>
          </div>

          {/* Crowd vs AlphaLens */}
          <div style={{ background: 'linear-gradient(180deg,#181b22,#121419)', borderRadius: 14, padding: '18px 20px', marginBottom: 26, color: '#fff', border: '1px solid #232a33' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ color: '#5b50d8', fontSize: 14 }}>✦</span>
              <span className="al-mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#cfd3db' }}>Crowd vs AlphaLens</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              {[
                { label: `${warmup.aName} Win`, crowd: warmup.probA, alpha: warmup.alphaA },
                { label: 'Draw', crowd: warmup.probDraw, alpha: warmup.alphaDraw },
                { label: `${warmup.bName} Win`, crowd: warmup.probB, alpha: warmup.alphaB },
              ].map((row, i) => {
                const gap = row.alpha - row.crowd
                const gapCol = gap > 0 ? '#3ddc97' : gap < 0 ? '#ff8a7a' : '#8b93a1'
                return (
                  <div key={i} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid #262a33', borderRadius: 10, padding: '12px 13px' }}>
                    <div className="al-mono" style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>{row.label}</div>
                    {/* Crowd bar */}
                    <div style={{ marginBottom: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span className="al-mono" style={{ fontSize: 9, color: '#8b93a1' }}>Crowd</span>
                        <span className="al-mono" style={{ fontSize: 9, fontWeight: 600, color: '#cfd3db' }}>{row.crowd}%</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: '#2b2e36', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${row.crowd}%`, background: '#dcd5c6', borderRadius: 99 }} />
                      </div>
                    </div>
                    {/* AlphaLens bar */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span className="al-mono" style={{ fontSize: 9, color: '#a99bff' }}>AlphaLens</span>
                        <span className="al-mono" style={{ fontSize: 9, fontWeight: 600, color: '#cfc8ff' }}>{row.alpha}%</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: '#2b2e36', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${row.alpha}%`, background: '#5b50d8', borderRadius: 99 }} />
                      </div>
                    </div>
                    <div className="al-mono" style={{ fontSize: 12, fontWeight: 700, color: gapCol, textAlign: 'center' }}>
                      {gap > 0 ? '+' : ''}{gap}%
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid #262a33', borderLeft: '3px solid #a99bff', borderRadius: 10, padding: '10px 13px' }}>
              <div className="al-mono" style={{ fontSize: 8.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#a99bff', marginBottom: 4 }}>Gap note</div>
              <div style={{ fontSize: 12.5, color: '#aab2bf', lineHeight: 1.45 }}>{warmup.gapNote}</div>
            </div>
          </div>

          {/* Scenarios */}
          {warmup.scenarios?.length > 0 && (
            <section style={{ marginBottom: 26 }}>
              <h3 className="al-serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 14 }}>Match Scenarios</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                {warmup.scenarios.slice(0, 3).map((s, i) => {
                  const col = scenarioColors[i] || '#8b93a1'
                  return (
                    <div key={i} style={{ background: '#fff', border: '1px solid #e6e0d3', borderTop: `3px solid ${col}`, borderRadius: 12, padding: '15px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', color: col }}>{s.label}</span>
                        <span className="al-mono" style={{ fontSize: 13, fontWeight: 600, color: col }}>{s.prob}%</span>
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.55, color: '#3b414c', margin: 0 }}>{s.detail}</p>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Key Battles */}
          {warmup.keyBattles?.length > 0 && (
            <section style={{ marginBottom: 26 }}>
              <h3 className="al-serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 14 }}>Key Battles</h3>
              <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 13, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', padding: '8px 16px', background: '#f7f4ec', borderBottom: '1px solid #e6e0d3' }}>
                  <span className="al-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8b93a1' }}>Topic</span>
                  <span className="al-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8b93a1' }}>Edge</span>
                  <span className="al-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8b93a1' }}>Winner</span>
                </div>
                {warmup.keyBattles.map((b, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', padding: '11px 16px', borderBottom: '1px solid #f0ece1' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#16181d' }}>{b.topic}</span>
                    <span style={{ fontSize: 13, color: '#3b414c' }}>{b.edge}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#2469a6' }}>{b.winner}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Team Form */}
          {warmup.teamForm?.length > 0 && (
            <section style={{ marginBottom: 26 }}>
              <h3 className="al-serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 14 }}>Team Form</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {warmup.teamForm.map((tf, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 13, padding: '14px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#16181d', marginBottom: 10 }}>{tf.team}</div>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                      {last5Chips(tf.last5)}
                    </div>
                    <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: '#59606e' }}>{tf.note}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Market Implications */}
          {warmup.marketImplications?.length > 0 && (
            <section style={{ marginBottom: 26 }}>
              <h3 className="al-serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 14 }}>Market Implications</h3>
              <div style={{ background: '#16181d', borderRadius: 14, padding: '18px 20px', border: '1px solid #2b2e36' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {warmup.marketImplications.map((mi, i) => {
                    const isUp = mi.direction === 'up'
                    const isDown = mi.direction === 'down'
                    const col = isUp ? '#3ddc97' : isDown ? '#ff8a7a' : '#8b93a1'
                    const arrow = isUp ? '▲' : isDown ? '▼' : '→'
                    return (
                      <div key={i} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid #2b2e36', borderRadius: 10, padding: '10px 14px', minWidth: 140 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span className="al-mono" style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{mi.asset}</span>
                          <span className="al-mono" style={{ fontSize: 11, color: col }}>{arrow}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 11, lineHeight: 1.45, color: '#aab2bf' }}>{mi.reason}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* AlphaLens Take */}
          <section style={{ background: '#f7f4ec', border: '1px solid #e6e0d3', borderLeft: '4px solid #5b50d8', borderRadius: '0 16px 16px 0', padding: '20px 22px', marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase', color: '#5b50d8', marginBottom: 10 }}>AlphaLens Take</div>
            <p className="al-serif" style={{ fontSize: 18, lineHeight: 1.55, color: '#22262e', margin: '0 0 12px' }}>{warmup.finalTake}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="al-mono" style={{ fontSize: 11, color: '#8b93a1' }}>Confidence:</span>
              <div style={{ flex: 1, height: 5, borderRadius: 99, background: '#dcd5c6', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: warmup.confPct, background: 'linear-gradient(90deg,#5b50d8,#2469a6)', borderRadius: 99 }} />
              </div>
              <span className="al-mono" style={{ fontSize: 12, fontWeight: 700, color: '#5b50d8' }}>{warmup.confPct}</span>
            </div>
          </section>

          <p style={{ fontSize: 11.5, lineHeight: 1.55, color: '#8b93a1', borderTop: '1px solid #e6e0d3', paddingTop: 16 }}>
            Generated analysis is for research and education only. Not financial advice. AI-generated — verify with independent sources. All figures in this prototype are fictional.
          </p>
        </article>

        {/* SIDEBAR */}
        <aside style={{ position: 'sticky', top: 70, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Match Info */}
          <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#59606e', marginBottom: 12 }}>Match Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#8b93a1' }}>Status</span>
                <span style={{ fontWeight: 600, color: warmup.status === 'live' ? '#3ddc97' : '#16181d' }}>
                  {warmup.status || 'Upcoming'}
                </span>
              </div>
              {warmup.score && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#8b93a1' }}>Score</span>
                  <span className="al-mono" style={{ fontWeight: 700, color: '#16181d' }}>{warmup.score}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#8b93a1' }}>Angle</span>
                <span style={{ fontWeight: 600, color: '#5b50d8' }}>{warmup.angleId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#8b93a1' }}>Generated</span>
                <span className="al-mono" style={{ color: '#16181d' }}>
                  {new Date(warmup.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* AlphaLens Odds sidebar */}
          <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#59606e', marginBottom: 12 }}>AlphaLens Odds</div>
            {[
              { label: `${warmup.aName} Win`, crowd: warmup.probA, alpha: warmup.alphaA },
              { label: 'Draw', crowd: warmup.probDraw, alpha: warmup.alphaDraw },
              { label: `${warmup.bName} Win`, crowd: warmup.probB, alpha: warmup.alphaB },
            ].map((row, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span className="al-mono" style={{ fontSize: 10, color: '#59606e' }}>{row.label}</span>
                </div>
                <div style={{ marginBottom: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="al-mono" style={{ fontSize: 9, color: '#8b93a1' }}>Crowd {row.crowd}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: '#f0ece1', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${row.crowd}%`, background: '#dcd5c6', borderRadius: 99 }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="al-mono" style={{ fontSize: 9, color: '#5b50d8' }}>AlphaLens {row.alpha}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: '#efeefb', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${row.alpha}%`, background: '#5b50d8', borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Confidence */}
          <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 16, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#59606e' }}>Confidence</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#5b50d8' }}>{confLabel}</span>
            </div>
            <div style={{ height: 7, borderRadius: 99, background: '#eef0f3', overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg,#5b50d8,#2469a6)', width: warmup.confPct, borderRadius: 99 }} />
            </div>
            <div className="al-mono" style={{ fontSize: 20, fontWeight: 700, color: '#5b50d8', textAlign: 'center' }}>{warmup.confPct}</div>
          </div>

          {/* Save to Library */}
          <button
            className="btn btn-ai"
            style={{ width: '100%', justifyContent: 'center', borderRadius: 12, height: 44 }}
            onClick={handleSave}
          >
            {saved ? '★ Saved to Library' : '☆ Save to Library'}
          </button>
        </aside>
      </div>
    </div>
  )
}
