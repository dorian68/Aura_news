'use client'
import Link from 'next/link'
import { CreditsBadge } from '@/components/ui/CreditsBadge'

export function Header() {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(13,14,18,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--al-border)',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
    }}>
      <div style={{
        maxWidth: 1200,
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: 'var(--al-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 800,
              color: '#fff',
            }}>
              A
            </div>
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--al-text-primary)',
              letterSpacing: '-0.02em',
            }}>
              AlphaLens
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--al-text-muted)',
              background: 'var(--al-surface-2)',
              border: '1px solid var(--al-border)',
              borderRadius: 4,
              padding: '1px 5px',
              letterSpacing: '0.05em',
            }}>
              DAILY
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <NavLink href="/">Feed</NavLink>
          <NavLink href="/library">Library</NavLink>
          <NavLink href="/composer">Composer</NavLink>
        </nav>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CreditsBadge />
          <button className="al-btn-primary" style={{ padding: '6px 14px' }}>
            Sign in
          </button>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        padding: '5px 12px',
        borderRadius: 7,
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--al-text-secondary)',
        textDecoration: 'none',
        transition: 'color 0.15s, background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--al-text-primary)'
        e.currentTarget.style.background = 'var(--al-surface-2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--al-text-secondary)'
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </Link>
  )
}
