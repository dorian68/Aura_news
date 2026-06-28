'use client'
import { useState } from 'react'
import { ANGLES } from '@/lib/generation/prompts'

export interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  tickers?: string[]
  intensity?: number
  category?: string
}

interface Props {
  item: NewsItem
  variant?: 'hero' | 'card' | 'compact'
}

export function NewsCard({ item, variant = 'card' }: Props) {
  const [showAngles, setShowAngles] = useState(false)

  const timeAgo = getTimeAgo(item.publishedAt)
  const intensityColor = item.intensity
    ? item.intensity > 7 ? 'var(--al-red)' : item.intensity > 4 ? 'var(--al-amber)' : 'var(--al-green)'
    : 'var(--al-purple)'

  if (variant === 'compact') {
    return (
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--al-border)',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--al-surface-2)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          {item.intensity && (
            <div style={{
              width: 3,
              minHeight: 40,
              borderRadius: 99,
              background: intensityColor,
              flexShrink: 0,
              marginTop: 2,
            }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--al-text-primary)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {item.title}
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: 'var(--al-text-muted)', fontWeight: 600 }}>
                {item.source}
              </span>
              <span style={{ fontSize: 10, color: 'var(--al-text-faint)' }}>{timeAgo}</span>
              {item.tickers?.slice(0, 2).map(t => (
                <span key={t} style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'var(--al-purple)',
                  background: 'var(--al-purple-dim)',
                  borderRadius: 4,
                  padding: '1px 5px',
                  letterSpacing: '0.04em',
                }}>${t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="al-card" style={{
      padding: 20,
      cursor: 'pointer',
      transition: 'border-color 0.15s',
      position: 'relative',
    }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(91,80,216,0.3)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--al-border)'}
    >
      {/* Intensity bar */}
      {item.intensity && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: `${(item.intensity / 10) * 100}%`,
          height: 2,
          background: intensityColor,
          borderRadius: '14px 14px 0 0',
          opacity: 0.7,
        }} />
      )}

      {/* Source + time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--al-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {item.source}
        </span>
        <span style={{ fontSize: 10, color: 'var(--al-text-faint)' }}>{timeAgo}</span>
        {item.category && (
          <span style={{
            fontSize: 9,
            fontWeight: 600,
            color: 'var(--al-purple-light)',
            background: 'var(--al-purple-dim)',
            borderRadius: 4,
            padding: '1px 6px',
            marginLeft: 'auto',
          }}>
            {item.category}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        margin: '0 0 8px',
        fontSize: variant === 'hero' ? 20 : 15,
        fontWeight: 700,
        color: 'var(--al-text-primary)',
        lineHeight: 1.35,
        letterSpacing: '-0.01em',
      }}>
        {item.title}
      </h3>

      {/* Summary */}
      {item.summary && (
        <p style={{
          margin: '0 0 14px',
          fontSize: 13,
          color: 'var(--al-text-secondary)',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: variant === 'hero' ? 4 : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.summary}
        </p>
      )}

      {/* Tickers */}
      {item.tickers && item.tickers.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {item.tickers.slice(0, 5).map(t => (
            <span key={t} style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--al-text-secondary)',
              background: 'var(--al-surface-2)',
              border: '1px solid var(--al-border)',
              borderRadius: 5,
              padding: '2px 7px',
            }}>${t}</span>
          ))}
        </div>
      )}

      {/* CTA */}
      {!showAngles ? (
        <button
          className="al-btn-primary"
          style={{ padding: '8px 16px', fontSize: 12, width: '100%' }}
          onClick={(e) => { e.stopPropagation(); setShowAngles(true) }}
        >
          ✦ Signal
        </button>
      ) : (
        <AngleSelector newsId={item.id} onClose={() => setShowAngles(false)} />
      )}
    </div>
  )
}

function AngleSelector({ newsId, onClose }: { newsId: string; onClose: () => void }) {
  return (
    <div style={{
      background: 'var(--al-surface-2)',
      border: '1px solid var(--al-border)',
      borderRadius: 10,
      padding: 12,
      animation: 'al-rise 0.2s ease both',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--al-text-muted)', letterSpacing: '0.04em' }}>
          WHAT DO YOU WANT ALPHALENS TO PRICE?
        </span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--al-text-muted)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {Object.entries(ANGLES).map(([id, angle]) => (
          <AngleChip key={id} id={id} label={angle.label} newsId={newsId} />
        ))}
      </div>
    </div>
  )
}

function AngleChip({ id, label, newsId }: { id: string; label: string; newsId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    // Will navigate to article generation — wired in M4
    window.location.href = `/article/generate?news=${newsId}&angle=${id}`
  }

  return (
    <button
      className="al-btn-ghost"
      style={{ padding: '5px 10px', fontSize: 11, opacity: loading ? 0.5 : 1 }}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? '...' : label}
    </button>
  )
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
