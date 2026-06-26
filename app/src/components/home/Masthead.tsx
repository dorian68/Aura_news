'use client'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { TokenMeter } from '@/components/ui/TokenMeter'

// Seules de vraies destinations — pas d'onglets décoratifs morts (qui pointaient
// tous vers '/'). Le cœur produit = Signals → Library ; Briefings = digest ;
// World Cup = verticale parquée.
const NAV_ITEMS = [
  { label: 'Signals', href: '/trade', dot: true, color: '#2469a6' },
  { label: 'Briefings', href: '/briefings', dot: true, color: '#5b50d8' },
  { label: 'Library', href: '/library', color: '#59606e' },
  { label: 'World Cup', href: '/warmup', dot: true, color: '#0f7d56' },
]

export function Masthead() {
  const { credits, openCreditsModal } = useAppStore()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <header style={{ background: '#f7f4ec', borderBottom: '1px solid #16181d' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '18px 28px 0' }}>
        {/* Top line */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
          <div className="al-mono" style={{ fontSize: 10.5, letterSpacing: '.16em', color: '#59606e', textTransform: 'uppercase' }}>
            {today} · Vol. 01 · No. 142
          </div>
          <span className="al-mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10.5, letterSpacing: '.12em', color: '#8a6d1e', background: '#fbf3da', border: '1px solid #f0e1b4', padding: '4px 9px', borderRadius: 999, textTransform: 'uppercase', fontWeight: 600 }}>
            Live data · research only
          </span>
        </div>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '8px 0 12px' }}>
          <div style={{ flex: 1, height: 1, background: '#d9d3c4' }} />
          <h1 className="al-serif" style={{ fontSize: 50, fontWeight: 700, letterSpacing: '-.018em', lineHeight: 1, whiteSpace: 'nowrap', margin: 0 }}>
            AlphaLens <span style={{ fontStyle: 'italic', fontWeight: 500 }}>Daily</span>
          </h1>
          <div style={{ flex: 1, height: 1, background: '#d9d3c4' }} />
        </div>

        {/* Tagline */}
        <div className="al-serif" style={{ textAlign: 'center', fontStyle: 'italic', color: '#59606e', fontSize: 14.5, paddingBottom: 14 }}>
          For every story, see what the markets are already pricing — and what it means for your portfolio.
        </div>
      </div>

      {/* Nav */}
      <div style={{ borderTop: '1px solid #16181d', borderBottom: '1px solid #d9d3c4', background: '#f7f4ec' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, height: 46 }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            {NAV_ITEMS.map(n => (
              <Link key={n.label} href={n.href} className="al-link-hover" style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.01em', color: n.color || '#16181d', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                {n.label}
                {n.dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#5b50d8' }} />}
              </Link>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <TokenMeter />
            <button className="btn btn-sm" style={{ background: '#fff', border: '1px solid #ddd6c6', color: '#16181d', gap: 6 }} onClick={openCreditsModal}>
              <span style={{ color: '#5b50d8', fontSize: 13 }}>✦</span>
              <span className="al-mono" style={{ fontWeight: 600 }}>{credits.plan === 'power' ? '∞' : credits.count}</span>
              <span style={{ color: '#59606e', fontWeight: 600 }}>credits</span>
            </button>
            <Link href="/library" className="btn btn-sm" style={{ background: 'transparent', color: '#59606e', textDecoration: 'none' }}>Library</Link>
            <button className="btn btn-sm" style={{ background: '#fff', border: '1px solid #ddd6c6', color: '#184a73' }} onClick={openCreditsModal}>Upgrade</button>
          </div>
        </div>
      </div>
    </header>
  )
}
