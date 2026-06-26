'use client'
import { useAppStore } from '@/lib/store'

export function CreditsBadge() {
  const { credits } = useAppStore()
  const isPower = credits.plan === 'power'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: 'var(--al-surface-2)',
      border: '1px solid var(--al-border)',
      borderRadius: 99,
      padding: '4px 12px',
      fontSize: 12,
      fontWeight: 600,
    }}>
      <span style={{ color: isPower ? '#f0c040' : 'var(--al-purple)' }}>
        {isPower ? '∞' : credits.count}
      </span>
      <span style={{ color: 'var(--al-text-muted)', fontWeight: 400 }}>
        {isPower ? 'Power' : 'cr.'}
      </span>
    </div>
  )
}
