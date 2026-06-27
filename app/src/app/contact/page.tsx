import type { Metadata } from 'next'
import { PageHeader, CONTACT_EMAIL } from '@/components/SiteFooter'
import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact — AlphaLens Daily',
  description: 'Get in touch with the AlphaLens Daily team.',
}

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#efeae0', color: '#16181d' }}>
      <PageHeader />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '36px 24px 60px' }}>
        <h1 className="al-serif" style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 10px' }}>Contact us</h1>
        <p className="al-serif" style={{ fontSize: 16.5, lineHeight: 1.55, color: '#3b414c', margin: '0 0 24px' }}>
          Questions, feedback, partnership or data requests? Send us a message below, or email us directly at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#2469a6', fontWeight: 600 }}>{CONTACT_EMAIL}</a>. We typically reply within 2 business days.
        </p>

        <div style={{ background: '#f7f4ec', border: '1px solid #e6e0d3', borderRadius: 14, padding: '22px 24px' }}>
          <ContactForm />
        </div>

        <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <div>
            <div className="al-mono" style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8b93a1', marginBottom: 5 }}>Email</div>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ fontSize: 14, color: '#2469a6', fontWeight: 600, textDecoration: 'none' }}>{CONTACT_EMAIL}</a>
          </div>
          <div>
            <div className="al-mono" style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8b93a1', marginBottom: 5 }}>About</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.5, color: '#59606e', margin: 0 }}>
              AlphaLens Daily connects financial news to real prediction markets and your portfolio. Research &amp; education only — not investment advice.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
