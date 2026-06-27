import Link from 'next/link'

// Email de contact public (surchargeable au build via NEXT_PUBLIC_CONTACT_EMAIL).
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'dorian.labry@optiquant-ia.com'

export function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid #ded7c7', background: '#f7f4ec', marginTop: 40 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '22px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
        <div className="al-serif" style={{ fontSize: 14, fontWeight: 700, color: '#16181d' }}>
          AlphaLens <span style={{ fontStyle: 'italic', fontWeight: 500 }}>Daily</span>
          <span className="al-mono" style={{ fontSize: 10.5, color: '#a9a18f', marginLeft: 10, fontWeight: 400 }}>Research &amp; education only — not investment advice.</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 13 }}>
          <Link href="/contact" className="al-link-hover" style={{ color: '#3b414c', textDecoration: 'none' }}>Contact</Link>
          <Link href="/privacy" className="al-link-hover" style={{ color: '#3b414c', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" className="al-link-hover" style={{ color: '#3b414c', textDecoration: 'none' }}>Terms</Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="al-link-hover" style={{ color: '#2469a6', textDecoration: 'none' }}>{CONTACT_EMAIL}</a>
        </nav>
      </div>
    </footer>
  )
}

// En-tête léger réutilisé par les pages légales/contact.
export function PageHeader() {
  return (
    <header style={{ borderBottom: '1px solid #ded7c7', background: '#f7f4ec' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '14px 24px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#16181d', fontSize: 14, fontWeight: 600 }}>← AlphaLens Daily</Link>
      </div>
    </header>
  )
}
