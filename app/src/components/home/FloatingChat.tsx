'use client'
import { useState } from 'react'

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {/* Chat panel */}
      {isOpen && (
        <div
          style={{
            width: 320,
            background: '#fff',
            border: '1px solid #e6e0d3',
            borderRadius: 16,
            boxShadow: '0 20px 50px rgba(20,26,40,.15)',
            marginBottom: 14,
            animation: 'al-rise .2s ease both',
            overflow: 'hidden',
          }}
        >
          {/* Panel header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f0ece1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                className="al-serif"
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#16181d',
                  lineHeight: 1.3,
                }}
              >
                AlphaLens AI
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#8b93a1',
                  lineHeight: 1.3,
                  marginTop: 1,
                }}
              >
                Ask about any market event
              </div>
            </div>
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: '#8b93a1',
                fontSize: 14,
                cursor: 'pointer',
                lineHeight: 1,
                padding: 4,
              }}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Panel body */}
          <div style={{ padding: '12px 16px' }}>
            <div
              style={{
                background: '#f3f0e8',
                borderRadius: 10,
                padding: '10px 12px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  color: '#3b414c',
                }}
              >
                Hi! I can help you price market events and analyze news. Click any article to get started, or ask me a question.
              </p>
            </div>
          </div>

          {/* Panel footer */}
          <div
            style={{
              padding: '10px 16px',
              borderTop: '1px solid #f0ece1',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Ask AlphaLens..."
              style={{
                background: '#f3f0e8',
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                flex: 1,
                outline: 'none',
                color: '#16181d',
                fontFamily: 'inherit',
              }}
            />
            <button className="btn btn-ai btn-sm">→</button>
          </div>
        </div>
      )}

      {/* Bubble button */}
      <button
        className="al-bubble"
        style={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #5b50d8, #2469a6)',
          boxShadow: '0 8px 28px rgba(91,80,216,.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: 'none',
        }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close AlphaLens AI' : 'Open AlphaLens AI'}
      >
        <span style={{ color: '#fff', fontSize: 22, lineHeight: 1 }}>✦</span>
      </button>
    </div>
  )
}
