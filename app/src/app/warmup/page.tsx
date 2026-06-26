'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { WCMatch } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { TokenMeter } from '@/components/ui/TokenMeter'

export default function WarmupPage() {
  const router = useRouter()
  const { openMatchAngleModal, credits, openCreditsModal } = useAppStore()
  const [matches, setMatches] = useState<WCMatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/matches')
      .then(r => r.json())
      .then((data: WCMatch[]) => { setMatches(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const featured = matches.find(m => m.status === 'live') || matches.find(m => m.status === 'upcoming') || matches[0]
  const otherMatches = featured ? matches.filter(m => m.id !== featured.id) : []

  // Matches with signals for edge card
  const edgeMatches = matches.filter(m => m.signal).slice(0, 3)

  function statusBadge(m: WCMatch, size: 'sm' | 'lg' = 'sm') {
    const fs = size === 'lg' ? 10 : 9
    if (m.status === 'live') return (
      <span style={{ fontSize: fs, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#3ddc97', background: 'rgba(61,220,151,.12)', border: '1px solid rgba(61,220,151,.3)', borderRadius: 5, padding: '2px 7px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3ddc97', animation: 'al-blink 1.2s step-end infinite', display: 'inline-block' }} />
        LIVE {m.minute ? `${m.minute}'` : ''}
      </span>
    )
    if (m.status === 'finished') return (
      <span style={{ fontSize: fs, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#8b93a1', background: 'rgba(139,147,161,.1)', border: '1px solid rgba(139,147,161,.2)', borderRadius: 5, padding: '2px 7px' }}>FT</span>
    )
    return (
      <span className="al-mono" style={{ fontSize: fs + 1, color: '#16181d', background: '#f0ece1', border: '1px solid #e6e0d3', borderRadius: 5, padding: '2px 7px' }}>{m.time}</span>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#efeae0', color: '#16181d' }}>

      {/* TopBar */}
      <div style={{ background: '#f7f4ec', borderBottom: '1px solid #16181d', height: 60, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button className="btn btn-sm" style={{ background: 'transparent', color: '#59606e' }} onClick={() => router.push('/')}>
            ← Home
          </button>
          <div className="al-serif" style={{ fontSize: 20, fontWeight: 700 }}>
            AlphaLens <span style={{ fontStyle: 'italic', fontWeight: 500 }}>Daily</span>
          </div>
          <TokenMeter />
          <button className="btn btn-sm" style={{ background: '#fff', border: '1px solid #ddd6c6', color: '#16181d', gap: 6 }} onClick={openCreditsModal}>
            <span style={{ color: '#5b50d8', fontSize: 13 }}>✦</span>
            <span className="al-mono" style={{ fontWeight: 600 }}>{credits.plan === 'power' ? '∞' : credits.count}</span>
            <span style={{ color: '#59606e', fontWeight: 600 }}>credits</span>
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 24px 60px' }}>

        {/* Header section */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h1 className="al-serif" style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-.02em', margin: 0 }}>
              ⚽ World Cup 2026 — AI Warm-up Desk
            </h1>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#3ddc97', background: 'rgba(61,220,151,.12)', border: '1px solid rgba(61,220,151,.3)', borderRadius: 5, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3ddc97', animation: 'al-blink 1.2s step-end infinite', display: 'inline-block' }} />
              LIVE
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: '#59606e' }}>AlphaLens · Matchday intelligence</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <span className="al-mono" style={{ fontSize: 12, color: '#8b93a1' }}>Loading fixtures…</span>
          </div>
        ) : !featured ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <span className="al-mono" style={{ fontSize: 12, color: '#8b93a1' }}>No fixtures available.</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>

            {/* LEFT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Featured Live Match Card */}
              <div style={{ background: '#16181d', borderRadius: 18, overflow: 'hidden', border: '1px solid #2b2e36' }}>
                {/* Header */}
                <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid #23262f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="al-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8b93a1', background: '#23262f', border: '1px solid #2b2e36', borderRadius: 5, padding: '2px 7px' }}>
                      {featured.group}
                    </span>
                    <span className="al-mono" style={{ fontSize: 10, color: '#59606e' }}>{featured.phase}</span>
                    <span style={{ fontSize: 10, color: '#59606e' }}>·</span>
                    <span className="al-mono" style={{ fontSize: 10, color: '#59606e' }}>{featured.venue}, {featured.city}</span>
                  </div>
                  {featured.status === 'live' && featured.minute && (
                    <span className="al-mono" style={{ fontSize: 11, fontWeight: 700, color: '#ff6b6b', background: 'rgba(255,107,107,.12)', border: '1px solid rgba(255,107,107,.25)', borderRadius: 5, padding: '3px 8px' }}>
                      {featured.minute}&apos;
                    </span>
                  )}
                </div>

                {/* Score row */}
                <div style={{ padding: '24px 20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                    <span style={{ fontSize: 44 }}>{featured.aFlag}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', textAlign: 'center' }}>{featured.aName}</span>
                  </div>

                  <div style={{ textAlign: 'center', flex: 'none' }}>
                    <div className="al-mono" style={{ fontSize: 44, fontWeight: 700, color: '#fff', letterSpacing: '.04em', lineHeight: 1 }}>
                      {featured.status === 'upcoming'
                        ? <span style={{ fontSize: 22, color: '#8b93a1' }}>{featured.time}</span>
                        : featured.score.replace('-', ' – ')}
                    </div>
                    <div style={{ marginTop: 8 }}>{statusBadge(featured, 'lg')}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                    <span style={{ fontSize: 44 }}>{featured.bFlag}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', textAlign: 'center' }}>{featured.bName}</span>
                  </div>
                </div>

                {/* Momentum bar */}
                {featured.momentum && (
                  <div style={{ padding: '0 20px 16px' }}>
                    <div className="al-mono" style={{ fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: '#59606e', marginBottom: 5 }}>Momentum</div>
                    <div style={{ display: 'flex', height: 6, borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${featured.probA}%`, background: '#3b82d6' }} />
                      <div style={{ width: `${featured.probDraw}%`, background: '#4b5563' }} />
                      <div style={{ width: `${featured.probB}%`, background: '#3ddc97' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span className="al-mono" style={{ fontSize: 9, color: '#3b82d6' }}>{featured.probA}%</span>
                      <span className="al-mono" style={{ fontSize: 9, color: '#4b5563' }}>Draw {featured.probDraw}%</span>
                      <span className="al-mono" style={{ fontSize: 9, color: '#3ddc97' }}>{featured.probB}%</span>
                    </div>
                  </div>
                )}

                {/* Signal badge */}
                {featured.signal && (
                  <div style={{ padding: '0 20px 14px' }}>
                    <span className="al-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#a99bff', background: 'rgba(91,80,216,.15)', border: '1px solid rgba(91,80,216,.3)', borderRadius: 5, padding: '3px 8px' }}>
                      ✦ signal · {featured.signal}
                    </span>
                  </div>
                )}

                {/* Live feed */}
                {featured.feed && featured.feed.length > 0 && (
                  <div style={{ padding: '0 20px 16px', borderTop: '1px solid #23262f', paddingTop: 14, marginTop: 2 }}>
                    <div className="al-mono" style={{ fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: '#59606e', marginBottom: 8 }}>Live feed</div>
                    {featured.feed.slice(-3).map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 6, padding: '3px 0' }}>
                        <span style={{ fontSize: 12, flexShrink: 0 }}>{f.icon}</span>
                        <span className="al-mono" style={{ fontSize: 11, color: '#59606e', flexShrink: 0 }}>{f.time}&apos;</span>
                        <span className="al-mono" style={{ fontSize: 11, color: '#aab2bf' }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div style={{ padding: '14px 20px', borderTop: '1px solid #23262f', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button
                    className="btn btn-ai btn-sm"
                    onClick={() => openMatchAngleModal(featured.id, `${featured.aName} vs ${featured.bName}`)}
                  >
                    ✦ Generate AI Warm-up
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ background: 'transparent', color: '#8b93a1', border: '1px solid #2b2e36' }}
                    onClick={() => router.push('/warmup')}
                  >
                    View all matchday →
                  </button>
                </div>
              </div>

              {/* Today's Matches list */}
              {otherMatches.map(m => (
                <div
                  key={m.id}
                  className="al-card-hover"
                  style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 13, padding: '14px 16px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                      {statusBadge(m)}
                      <span style={{ fontSize: 18 }}>{m.aFlag}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#16181d', whiteSpace: 'nowrap' }}>{m.aName}</span>
                      <span style={{ fontSize: 11, color: '#8b93a1' }}>vs</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#16181d', whiteSpace: 'nowrap' }}>{m.bName}</span>
                      <span style={{ fontSize: 18 }}>{m.bFlag}</span>
                      {m.status !== 'upcoming' && (
                        <span className="al-mono" style={{ fontSize: 13, fontWeight: 600, color: '#16181d' }}>
                          {m.score.replace('-', ' – ')}
                        </span>
                      )}
                      {m.signal && (
                        <span className="al-mono" style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#a99bff', background: '#efeefb', border: '1px solid #ddd9f6', borderRadius: 4, padding: '1px 5px' }}>
                          signal
                        </span>
                      )}
                    </div>
                    <button
                      className="btn btn-ai btn-sm"
                      style={{ flexShrink: 0 }}
                      onClick={(e) => { e.stopPropagation(); openMatchAngleModal(m.id, `${m.aName} vs ${m.bName}`) }}
                    >
                      ✦ AI Warm-up
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN (sidebar) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* AlphaLens Odds widget */}
              <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '13px 16px', borderBottom: '1px solid #f0ece1' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#59606e', marginBottom: 2 }}>AlphaLens Odds</div>
                  <div style={{ fontSize: 12, color: '#8b93a1' }}>
                    {featured.aFlag} {featured.aName} vs {featured.bFlag} {featured.bName}
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  {[
                    { label: `${featured.aName} Win`, crowd: featured.crowdA, alpha: featured.probA },
                    { label: 'Draw', crowd: featured.crowdDraw, alpha: featured.probDraw },
                    { label: `${featured.bName} Win`, crowd: featured.crowdB, alpha: featured.probB },
                  ].map((row, i) => {
                    const gap = Math.abs(row.alpha - row.crowd)
                    return (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span className="al-mono" style={{ fontSize: 10, color: '#59606e' }}>{row.label}</span>
                          {gap > 5 && (
                            <span className="al-mono" style={{ fontSize: 9, fontWeight: 700, color: '#5b50d8' }}>gap {gap > 0 ? '+' : ''}{row.alpha - row.crowd}%</span>
                          )}
                        </div>
                        {/* Crowd bar */}
                        <div style={{ marginBottom: 3 }}>
                          <div className="al-mono" style={{ fontSize: 9, color: '#8b93a1', marginBottom: 2 }}>Crowd {row.crowd}%</div>
                          <div style={{ height: 6, borderRadius: 99, background: '#f0ece1', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${row.crowd}%`, background: '#dcd5c6', borderRadius: 99 }} />
                          </div>
                        </div>
                        {/* AlphaLens bar */}
                        <div>
                          <div className="al-mono" style={{ fontSize: 9, color: '#5b50d8', marginBottom: 2 }}>AlphaLens {row.alpha}%</div>
                          <div style={{ height: 6, borderRadius: 99, background: '#efeefb', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${row.alpha}%`, background: '#5b50d8', borderRadius: 99 }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Today's Fixtures summary */}
              <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '13px 16px', borderBottom: '1px solid #f0ece1' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: '#59606e' }}>Today&apos;s Fixtures</div>
                </div>
                <div style={{ padding: '8px 0' }}>
                  {matches.map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 16px', borderBottom: '1px solid #f9f6f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14 }}>{m.aFlag}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#16181d' }}>{m.aCode}</span>
                        <span style={{ fontSize: 11, color: '#8b93a1' }}>–</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#16181d' }}>{m.bCode}</span>
                        <span style={{ fontSize: 14 }}>{m.bFlag}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {m.status !== 'upcoming' && (
                          <span className="al-mono" style={{ fontSize: 11, fontWeight: 600, color: '#16181d' }}>{m.score}</span>
                        )}
                        {statusBadge(m)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AlphaLens WC Edge card */}
              <div style={{ background: '#16181d', borderRadius: 16, padding: 16, border: '1px solid #2b2e36' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: '#5b50d8' }}>✦</span>
                  <span className="al-mono" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#aab2bf' }}>AlphaLens WC Edge</span>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: 13, color: '#fff', fontWeight: 600 }}>
                  {edgeMatches.length} match{edgeMatches.length !== 1 ? 'es' : ''} priced incorrectly today
                </p>
                {edgeMatches.map(m => (
                  <div key={m.id} style={{ padding: '8px 0', borderBottom: '1px solid #23262f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="al-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#a99bff', background: 'rgba(91,80,216,.15)', border: '1px solid rgba(91,80,216,.25)', borderRadius: 4, padding: '1px 5px' }}>
                        signal
                      </span>
                      <span style={{ fontSize: 12, color: '#aab2bf' }}>{m.aFlag}{m.bFlag} {m.aCode}–{m.bCode}</span>
                    </div>
                    <span className="al-mono" style={{ fontSize: 10, color: '#3ddc97', flexShrink: 0 }}>{m.signal}</span>
                  </div>
                ))}
                {edgeMatches.length === 0 && (
                  <p style={{ margin: 0, fontSize: 12, color: '#59606e' }}>No strong signals detected today.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
