'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'

const MATCH_ANGLES = [
  { id: 'beginner', icon: '🎓', label: 'Beginner Brief', desc: 'Match summary for non-football experts' },
  { id: 'trading', icon: '⚡', label: 'Live Trading', desc: 'Prediction market edge & mispriced outcomes' },
  { id: 'tactical', icon: '📊', label: 'Tactical Analysis', desc: 'Formations, pressing, key duels' },
  { id: 'h2h', icon: '🏆', label: 'Historical H2H', desc: 'Head-to-head records & tournament context' },
  { id: 'crowd_vs_ai', icon: '📈', label: 'Crowd vs AlphaLens', desc: 'Where the model diverges from bookmakers' },
  { id: 'key_player', icon: '🎯', label: 'Key Player', desc: 'The player who decides the match' },
  { id: 'market', icon: '💰', label: 'Market Impact', desc: 'Trading & economic implications' },
]

export function MatchAngleModal() {
  const router = useRouter()
  const {
    showMatchAngleModal,
    activeMatchId,
    activeMatchName,
    matchAngleId,
    credits,
    closeMatchAngleModal,
    setMatchAngle,
    debitCredit,
    openCreditsModal,
  } = useAppStore()

  if (!showMatchAngleModal || !activeMatchId) return null

  function handleGenerate() {
    if (credits.count <= 0 && credits.plan !== 'power') {
      openCreditsModal()
      return
    }
    debitCredit()
    router.push(`/warmup/generate?match=${activeMatchId}&angle=${matchAngleId}`)
    closeMatchAngleModal()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(20,22,29,.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        animation: 'al-rise .25s ease both',
      }}
      onClick={closeMatchAngleModal}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          width: '100%',
          maxWidth: 560,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 30px 80px rgba(20,26,40,.4)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 2,
            padding: '22px 26px 16px',
            borderBottom: '1px solid #e6e0d3',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#5b50d8',
                  letterSpacing: '0.05em',
                }}
              >
                ✦ Choose your analysis angle
              </p>
              <h2
                className="al-serif"
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 600,
                  lineHeight: 1.18,
                  color: '#16181d',
                }}
              >
                {activeMatchName}
              </h2>
            </div>
            <button
              style={{
                background: 'transparent',
                border: '1px solid #ddd6c6',
                color: '#59606e',
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: 8,
                fontSize: 16,
                cursor: 'pointer',
              }}
              onClick={closeMatchAngleModal}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Angles grid */}
        <div
          style={{
            padding: '18px 26px 8px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          {MATCH_ANGLES.map((angle, i) => {
            const isSelected = matchAngleId === angle.id
            const isLast = i === MATCH_ANGLES.length - 1
            return (
              <div
                key={angle.id}
                onClick={() => setMatchAngle(angle.id)}
                style={{
                  cursor: 'pointer',
                  borderRadius: 12,
                  padding: '12px 14px',
                  background: isSelected ? '#efeefb' : '#f7f4ec',
                  border: isSelected ? '2px solid #5b50d8' : '1.5px solid #e6e0d3',
                  boxShadow: isSelected ? '0 0 0 3px rgba(91,80,216,.08)' : 'none',
                  transition: 'background .15s, border-color .15s, box-shadow .15s',
                  gridColumn: isLast ? '1 / -1' : undefined,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, lineHeight: 1 }}>{angle.icon}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: '#16181d' }}>
                    {angle.label}
                  </span>
                  {isSelected && (
                    <span style={{ marginLeft: 'auto', color: '#5b50d8', fontWeight: 800, fontSize: 13 }}>
                      ✓
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.4, color: '#59606e' }}>
                  {angle.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            padding: '16px 26px 22px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0), #fff 24%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              className="btn btn-ai"
              style={{ flex: 1, height: 44, padding: '0 20px', fontSize: 14 }}
              onClick={handleGenerate}
            >
              ✦ Generate AI Warm-up · 1 credit
            </button>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div
                className="al-mono"
                style={{ fontSize: 12, fontWeight: 600, color: '#16181d', lineHeight: 1.4 }}
              >
                {credits.plan === 'power' ? '∞ credits' : `${credits.count} credits left`}
              </div>
              <div style={{ fontSize: 10.5, color: '#8b93a1', lineHeight: 1.4 }}>
                Free plan: 3 / day
              </div>
            </div>
          </div>
          <p style={{ margin: '11px 0 0', fontSize: 11, color: '#8b93a1', textAlign: 'center' }}>
            Generated analysis is for research and education only. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  )
}
