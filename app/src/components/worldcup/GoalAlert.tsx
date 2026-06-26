'use client'
import { useAppStore } from '@/lib/store'

export function GoalAlert() {
  const { goalAlert, dismissGoalAlert } = useAppStore()
  if (!goalAlert) return null

  return (
    <div style={{
      position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 200, background: '#16181d', border: '1px solid #3ddc97',
      borderRadius: 16, padding: '14px 20px', minWidth: 340,
      boxShadow: '0 8px 40px rgba(61,220,151,.18)',
      display: 'flex', alignItems: 'center', gap: 12,
      animation: 'al-rise .3s ease',
    }}>
      <span style={{ fontSize: 24 }}>⚽</span>
      <div style={{ flex: 1 }}>
        <div className="al-mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#3ddc97', marginBottom: 2 }}>Goal detected</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>France scores! 2-0 vs Germany</div>
      </div>
      <button
        className="btn btn-ai btn-sm"
        style={{ whiteSpace: 'nowrap', fontSize: 11 }}
        onClick={dismissGoalAlert}
      >
        ⚡ Live impact
      </button>
      <button onClick={dismissGoalAlert} style={{ background: 'transparent', border: 'none', color: '#6b7280', fontSize: 16, cursor: 'pointer', padding: '0 4px' }}>✕</button>
    </div>
  )
}
