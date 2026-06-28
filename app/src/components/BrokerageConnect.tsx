'use client'
import { useEffect, useState, useCallback } from 'react'

// Carte "Connecter un courtier" (SnapTrade, lecture seule) pour la Library.
// Dégrade proprement si l'intégration n'est pas configurée côté serveur.

function getUserId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('aura_user_id')
  if (!id) { id = 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('aura_user_id', id) }
  return id
}

type Holding = { sym: string; name: string; units: number; price: number; value: number; currency: string }

export function BrokerageConnect() {
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [holdings, setHoldings] = useState<Holding[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    fetch('/api/snaptrade/status').then(r => r.json()).then(d => setConfigured(!!d.configured)).catch(() => setConfigured(false))
  }, [])

  const loadHoldings = useCallback(() => {
    fetch(`/api/snaptrade/holdings?userId=${encodeURIComponent(getUserId())}`)
      .then(r => (r.ok ? r.json() : null)).then(d => { if (d?.ok) setHoldings(d.holdings) }).catch(() => {})
  }, [])
  useEffect(() => { if (configured) loadHoldings() }, [configured, loadHoldings])

  const connect = async () => {
    setBusy(true); setErr('')
    try {
      const res = await fetch('/api/snaptrade/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: getUserId() }) })
      const d = await res.json()
      if (d.ok && d.url) { window.open(d.url, '_blank', 'noopener'); setTimeout(loadHoldings, 4000) }
      else setErr(d.message || d.error || 'Indisponible pour le moment.')
    } catch { setErr('Erreur réseau.') } finally { setBusy(false) }
  }

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 14, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <h3 className="al-serif" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: '#16181d' }}>Your brokerage</h3>
        <span className="al-mono" style={{ fontSize: 9, color: '#a9a18f', textTransform: 'uppercase', letterSpacing: '.06em' }}>Read-only · SnapTrade</span>
      </div>
      {children}
    </div>
  )

  if (configured === null) return <Card><p style={{ fontSize: 13, color: '#a9a18f', margin: 0 }}>…</p></Card>

  if (!configured) {
    return (
      <Card>
        <p style={{ fontSize: 13, color: '#59606e', margin: '0 0 12px', lineHeight: 1.5 }}>
          Connecte ton courtier pour voir l&apos;impact réel des news sur tes positions — en lecture seule.
        </p>
        <button disabled className="btn btn-sm" style={{ background: '#f3f0e8', color: '#a9a18f', border: '1px solid #e6e0d3', cursor: 'not-allowed', fontWeight: 700 }}>
          🔒 Bientôt disponible
        </button>
      </Card>
    )
  }

  if (holdings && holdings.length > 0) {
    const total = holdings.reduce((s, h) => s + (h.value || 0), 0)
    return (
      <Card>
        <div className="al-mono" style={{ fontSize: 10, color: '#8b93a1', marginBottom: 8 }}>{holdings.length} positions · ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {holdings.slice(0, 8).map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '7px 0', borderBottom: i < Math.min(8, holdings.length) - 1 ? '1px solid #f0ece1' : 'none' }}>
              <span className="al-mono" style={{ fontSize: 12.5, fontWeight: 700 }}>{h.sym}</span>
              <span style={{ flex: 1 }} />
              <span className="al-mono" style={{ fontSize: 11.5, color: '#59606e' }}>{h.units} · ${h.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          ))}
        </div>
        <button onClick={connect} className="al-link-hover" style={{ marginTop: 10, background: 'none', border: 'none', color: '#2469a6', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}>Reconnecter / ajouter</button>
      </Card>
    )
  }

  return (
    <Card>
      <p style={{ fontSize: 13, color: '#59606e', margin: '0 0 12px', lineHeight: 1.5 }}>
        Connecte ton courtier (lecture seule) pour relier les news à tes vraies positions.
      </p>
      <button onClick={connect} disabled={busy} className="btn btn-ai btn-sm" style={{ fontWeight: 700, opacity: busy ? 0.6 : 1 }}>
        {busy ? 'Ouverture…' : '🔗 Connecter un courtier'}
      </button>
      {err && <p style={{ fontSize: 12, color: '#c43d34', margin: '8px 0 0' }}>{err}</p>}
    </Card>
  )
}
