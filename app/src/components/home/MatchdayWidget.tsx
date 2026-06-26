'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { WCMatch } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { ProbabilityDrawer } from './ProbabilityDrawer'

export function MatchdayWidget() {
  const router = useRouter()
  const { openMatchAngleModal } = useAppStore()
  const [matches, setMatches] = useState<WCMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetch('/api/matches')
      .then(r => r.json())
      .then((data: WCMatch[]) => { setMatches(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading || matches.length === 0) return null

  const featured = matches.find(m => m.status === 'live') || matches.find(m => m.status === 'upcoming') || matches[0]
  const upcoming = matches.filter(m => m.id !== featured.id && m.status !== 'finished').slice(0, 3)

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '18px 28px 2px' }}>
      {/* Main card */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        borderRadius: 18,
        overflow: 'hidden',
        border: '1px solid #232a33',
        boxShadow: '0 14px 40px rgba(12,15,20,.28)',
        background: 'radial-gradient(620px 280px at 88% -40%, rgba(91,80,216,.38), transparent), radial-gradient(520px 300px at 4% 130%, rgba(15,125,86,.34), transparent), linear-gradient(180deg,#0c1016,#0a0d12)',
        color: '#fff',
      }}>

        {/* Light sweep overlay */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 18 }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '26%', height: '100%',
            background: 'linear-gradient(90deg,transparent,rgba(150,165,255,.10),transparent)',
            animation: 'al-sweep 5.5s ease-in-out infinite',
          }} />
        </div>

        {/* ── LEFT PANEL — brand ── */}
        <div
          onClick={() => router.push('/warmup')}
          style={{
            cursor: 'pointer',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 5,
            minWidth: 204,
            borderRight: '1px solid #1d232b',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* MATCHDAY badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 10, fontWeight: 800, letterSpacing: '.04em',
            color: '#0c1016',
            background: 'linear-gradient(90deg,#3ddc97,#2f9488)',
            padding: '3px 9px', borderRadius: 99, width: 'max-content',
          }}>
            <span style={{ animation: 'al-flame 1.6s ease-in-out infinite', display: 'inline-block' }}>⚽</span>
            {' '}MATCHDAY
          </div>

          {/* Title */}
          <div className="al-serif" style={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.02, whiteSpace: 'nowrap' }}>
            The AI Daily <span style={{ fontStyle: 'italic', fontWeight: 500 }}>Warm-up</span>
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: 10.5, color: '#9aa3b0' }}>
            World Cup 2026 · {matches.length} fixtures today
          </div>
        </div>

        {/* ── CENTER PANEL — featured match ── */}
        <div
          onClick={() => openMatchAngleModal(featured.id, `${featured.aName} vs ${featured.bName}`)}
          style={{
            flex: 1,
            padding: '14px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 9,
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1,
            minWidth: 0,
          }}
        >
          {/* LIVE pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {featured.status === 'live' ? (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 9.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase',
                color: '#ff8a7a', background: 'rgba(220,81,71,.16)', border: '1px solid rgba(220,81,71,.4)',
                padding: '2px 8px', borderRadius: 99,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc5147', animation: 'al-pulse 1.3s infinite', display: 'inline-block' }} />
                Live · {featured.minute}
              </span>
            ) : (
              <span className="al-mono" style={{ fontSize: 10, color: '#8b93a1' }}>
                {featured.group} · {featured.time}
              </span>
            )}
          </div>

          {/* Score row: Name Flag [score] Flag Name */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
              <span className="al-serif" style={{ fontSize: 17, fontWeight: 600 }}>{featured.aCode}</span>
              <span style={{ fontSize: 34, lineHeight: 1, animation: 'al-bob 3s ease-in-out infinite' }}>{featured.aFlag}</span>
            </div>
            <span className="al-mono" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '.04em', minWidth: 74, textAlign: 'center' }}>
              {featured.status === 'upcoming' ? featured.time : featured.score}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-start' }}>
              <span style={{ fontSize: 34, lineHeight: 1, animation: 'al-bob 3s ease-in-out infinite .4s' }}>{featured.bFlag}</span>
              <span className="al-serif" style={{ fontSize: 17, fontWeight: 600 }}>{featured.bCode}</span>
            </div>
          </div>

          {/* Mini 1X2 probability bar + edge toggle */}
          <div style={{ maxWidth: 360, margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', height: 7, borderRadius: 99, overflow: 'hidden', background: '#161b22' }}>
              <div style={{ width: `${featured.probA}%`, background: '#3b82d6' }} />
              <div style={{ width: `${featured.probDraw}%`, background: '#4b5563' }} />
              <div style={{ width: `${featured.probB}%`, background: '#3ddc97' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
              <span className="al-mono" style={{ fontSize: 10, color: '#7eb0e8', fontWeight: 600 }}>{featured.aCode} {featured.probA}%</span>
              <span className="al-mono" style={{ fontSize: 9.5, color: '#8b93a1' }}>Nul {featured.probDraw}%</span>
              <span className="al-mono" style={{ fontSize: 10, color: '#3ddc97', fontWeight: 600 }}>{featured.bCode} {featured.probB}%</span>
            </div>
            {typeof featured.edge === 'number' && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 7 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setExpanded(v => !v) }}
                  className="al-mono"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    color: '#cfc8ff', background: 'rgba(91,80,216,.16)',
                    border: '1px solid rgba(91,80,216,.4)', padding: '3px 11px', borderRadius: 99,
                  }}
                >
                  ⚡ edge {featured.edge >= 0 ? '+' : ''}{featured.edge} vs marché · probas par score {expanded ? '▴' : '▾'}
                </button>
              </div>
            )}
          </div>

          {/* Signal + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {featured.signal && (
              <span style={{
                fontSize: 10, fontWeight: 600, color: '#cfc8ff',
                background: 'rgba(91,80,216,.18)', border: '1px solid rgba(91,80,216,.4)',
                padding: '3px 9px', borderRadius: 7, whiteSpace: 'nowrap',
              }}>
                ⚡ {featured.signal}
              </span>
            )}
            <span className="al-link-hover" style={{ fontSize: 11, fontWeight: 700, color: '#3ddc97' }}>
              Open the World Cup desk →
            </span>
          </div>
        </div>

        {/* ── RIGHT PANEL — next up + CTA ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 8,
          padding: '14px 16px',
          background: 'rgba(0,0,0,.22)',
          borderLeft: '1px solid #1d232b',
          minWidth: 250,
          position: 'relative',
          zIndex: 1,
        }}>
          <div className="al-mono" style={{ fontSize: 8.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b7280' }}>
            Next up
          </div>

          {/* Upcoming chips */}
          <div style={{ display: 'flex', gap: 7 }}>
            {upcoming.map(u => (
              <div
                key={u.id}
                onClick={() => openMatchAngleModal(u.id, `${u.aName} vs ${u.bName}`)}
                style={{
                  flex: 1, cursor: 'pointer',
                  background: 'rgba(255,255,255,.03)', border: '1px solid #232a33',
                  borderRadius: 10, padding: '8px 7px', textAlign: 'center',
                  transition: 'transform .14s, background .14s, border-color .14s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,.06)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#3a4150' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,.03)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#232a33' }}
              >
                <div style={{ fontSize: 17, lineHeight: 1.1 }}>{u.aFlag} {u.bFlag}</div>
                <div className="al-mono" style={{ fontSize: 9, color: '#9aa3b0', marginTop: 3 }}>{u.time}</div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-sm btn-ai"
            onClick={() => router.push('/warmup')}
            style={{ whiteSpace: 'nowrap', fontWeight: 800 }}
          >
            ✦ Open World Cup desk
          </button>
          <button
            onClick={() => router.push('/warmup')}
            style={{ background: 'transparent', border: 'none', color: '#8a93a0', fontSize: 11, whiteSpace: 'nowrap', height: 24, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Open Warm-up desk · live tracker →
          </button>
        </div>

      </div>

      {/* Probability drawer — expands in place under the card */}
      <ProbabilityDrawer match={featured} open={expanded} />
    </div>
  )
}
