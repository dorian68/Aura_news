'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { ANGLES } from '@/lib/generation/prompts'

const ANGLE_ICONS: Record<string, string> = {
  macro: '📊',
  fx: '💱',
  equities: '📈',
  commodities: '🛢️',
  credit: '🏦',
  volatility: '⚡',
  crypto: '₿',
  geopolitical: '🌐',
  technical: '📐',
  ai_select: '✦',
}

export function AngleModal() {
  const router = useRouter()
  const {
    showAngleModal,
    activeNewsForAngle,
    selectedAngleId,
    credits,
    closeAngleModal,
    setSelectedAngle,
    openCreditsModal,
  } = useAppStore()

  if (!showAngleModal || !activeNewsForAngle) return null

  function handlePriceClick() {
    if (credits.count <= 0 && credits.plan !== 'power') {
      openCreditsModal()
      return
    }
    router.push(`/article/generate?news=${activeNewsForAngle!.id}&angle=${selectedAngleId}`)
    closeAngleModal()
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
      onClick={closeAngleModal}
    >
      {/* Modal box */}
      <div
        style={{
          background: '#f7f4ec',
          borderRadius: 20,
          width: '100%',
          maxWidth: 760,
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
            background: '#f7f4ec',
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
                ✦ What do you want AlphaLens to price?
              </p>
              <h2
                className="al-serif"
                style={{
                  margin: 0,
                  fontSize: 23,
                  fontWeight: 600,
                  lineHeight: 1.18,
                  color: '#16181d',
                }}
              >
                {activeNewsForAngle.title}
              </h2>
            </div>
            <button
              className="btn"
              style={{
                background: '#fff',
                border: '1px solid #ddd6c6',
                color: '#59606e',
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: 8,
                fontSize: 16,
                cursor: 'pointer',
              }}
              onClick={closeAngleModal}
              aria-label="Close"
            >
              ✕
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
          {Object.entries(ANGLES).map(([id, angle]) => {
            const isSelected = selectedAngleId === id
            const isAiSelect = id === 'ai_select'
            return (
              <div
                key={id}
                onClick={() => setSelectedAngle(id)}
                style={{
                  cursor: 'pointer',
                  borderRadius: 12,
                  padding: '12px 14px',
                  background: isSelected ? '#efeefb' : '#fff',
                  border: isSelected
                    ? '1.5px solid #5b50d8'
                    : '1.5px solid #e6e0d3',
                  boxShadow: isSelected
                    ? '0 0 0 3px rgba(91,80,216,.08)'
                    : 'none',
                  transition: 'background .15s, border-color .15s, box-shadow .15s',
                }}
              >
                {/* Top row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: 1,
                      color: isAiSelect ? '#5b50d8' : undefined,
                    }}
                  >
                    {ANGLE_ICONS[id]}
                  </span>
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: '#16181d',
                    }}
                  >
                    {angle.label}
                  </span>
                  {isSelected && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        color: '#5b50d8',
                        fontWeight: 800,
                        fontSize: 13,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                {/* Description */}
                <p
                  style={{
                    margin: 0,
                    fontSize: 11.5,
                    lineHeight: 1.4,
                    color: '#59606e',
                  }}
                >
                  {angle.description}
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
            background: 'linear-gradient(180deg, rgba(247,244,236,0), #f7f4ec 24%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            {/* CTA button */}
            <button
              className="btn btn-ai al-cta-sheen"
              style={{
                flex: 1,
                height: 44,
                padding: '0 20px',
                fontSize: 14,
              }}
              onClick={handlePriceClick}
            >
              ✦ Price this event — 1 credit
            </button>

            {/* Credits info */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div
                className="al-mono"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#16181d',
                  lineHeight: 1.4,
                }}
              >
                {credits.count} credits left
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: '#8b93a1',
                  lineHeight: 1.4,
                }}
              >
                Free plan: 3 / day
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p
            style={{
              margin: '11px 0 0',
              fontSize: 11,
              color: '#8b93a1',
              textAlign: 'center',
            }}
          >
            Generated analysis is for research and education only. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  )
}
