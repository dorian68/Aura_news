'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'

function fmt(n: number): string {
  return n.toLocaleString('en-US')
}

function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

/**
 * Cumulative LLM token usage for the session, shown next to the credits badge.
 * Hover reveals the input / output breakdown.
 */
export function TokenMeter() {
  const { tokenUsage } = useAppStore()
  const [hover, setHover] = useState(false)
  const total = tokenUsage.input + tokenUsage.output

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="al-mono"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#fff', border: '1px solid #ddd6c6', borderRadius: 99,
          padding: '5px 11px', fontSize: 12, fontWeight: 600, cursor: 'default',
          color: '#16181d',
        }}
      >
        <span style={{ color: '#2f9488', fontSize: 12 }}>⛁</span>
        <span>{compact(total)}</span>
        <span style={{ color: '#59606e', fontWeight: 500 }}>tokens</span>
      </div>

      {hover && (
        <div
          className="al-mono"
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 100,
            minWidth: 188, background: '#16181d', color: '#fff',
            border: '1px solid #2b2e36', borderRadius: 10, padding: '11px 13px',
            boxShadow: '0 12px 30px rgba(12,15,20,.4)', fontSize: 11.5, lineHeight: 1.5,
          }}
        >
          <div style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 7 }}>
            Token usage · session
          </div>
          <Row label="Input" value={tokenUsage.input} color="#7eb0e8" />
          <Row label="Output" value={tokenUsage.output} color="#3ddc97" />
          <div style={{ height: 1, background: '#2b2e36', margin: '7px 0' }} />
          <Row label="Total" value={total} color="#fff" bold />
        </div>
      )}
    </div>
  )
}

function Row({ label, value, color, bold }: { label: string; value: number; color: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18, padding: '1px 0' }}>
      <span style={{ color: '#aab2bf', fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ color, fontWeight: bold ? 700 : 600 }}>{fmt(value)}</span>
    </div>
  )
}
