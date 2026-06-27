import type { Metadata } from 'next'
import { PageHeader, CONTACT_EMAIL } from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Terms of Service — AlphaLens Daily',
  description: 'The terms governing your use of AlphaLens Daily.',
}

function S({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 26 }}>
      <h2 className="al-serif" style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>{title}</h2>
      <div className="al-serif" style={{ fontSize: 15, lineHeight: 1.65, color: '#3b414c' }}>{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#efeae0', color: '#16181d' }}>
      <PageHeader />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '36px 24px 60px' }}>
        <h1 className="al-serif" style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 6px' }}>Terms of Service</h1>
        <p className="al-mono" style={{ fontSize: 11.5, color: '#8b93a1', marginBottom: 26 }}>Last updated: June 27, 2026</p>

        <S title="1. Acceptance">
          By accessing or using AlphaLens Daily (the &quot;Service&quot;), you agree to these Terms. If you
          do not agree, do not use the Service.
        </S>

        <S title="2. Research &amp; education only — not investment advice">
          The Service provides informational and educational content that connects news to real prediction
          markets and to portfolio context. It is <strong>not investment, financial, legal or tax advice</strong>,
          and nothing on the Service is a recommendation or solicitation to buy or sell any security or asset.
          Market probabilities shown are the implied prices of third-party prediction markets; other figures
          come from third-party data providers. You are solely responsible for your own decisions.
        </S>

        <S title="3. Brokerage connections (SnapTrade)">
          If you connect a brokerage account through our partner SnapTrade, access is <strong>read-only</strong>:
          the Service can display portfolio context but cannot place trades, transfer funds, or withdraw assets.
          You are responsible for the accuracy of the accounts you connect and may disconnect them at any time.
          Your use of SnapTrade is also subject to SnapTrade&apos;s own terms.
        </S>

        <S title="4. Acceptable use">
          You agree not to misuse the Service, including: attempting to disrupt or reverse-engineer it,
          scraping at scale, infringing intellectual property, or using it for unlawful purposes. We may
          suspend access that violates these Terms or threatens the platform&apos;s integrity.
        </S>

        <S title="5. Accuracy &amp; availability">
          Data and AI-generated text may contain errors, delays, or omissions and should be independently
          verified. The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without
          warranties of any kind, to the maximum extent permitted by law.
        </S>

        <S title="6. Limitation of liability">
          To the fullest extent permitted by law, AlphaLens Daily and its operators are not liable for any
          indirect, incidental, or consequential damages, or for any investment losses, arising from your use
          of (or inability to use) the Service or reliance on its content.
        </S>

        <S title="7. Intellectual property">
          The Service&apos;s design, code, and original content are owned by us or our licensors. Third-party
          data and trademarks remain the property of their respective owners.
        </S>

        <S title="8. Changes">
          We may modify the Service or these Terms; we will update the &quot;Last updated&quot; date above.
          Continued use after changes constitutes acceptance.
        </S>

        <S title="9. Contact">
          Questions about these Terms? Email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#2469a6' }}>{CONTACT_EMAIL}</a>.
        </S>

        <p style={{ fontSize: 12.5, color: '#a9a18f', borderTop: '1px solid #e6e0d3', paddingTop: 16, marginTop: 8 }}>
          This document is provided for transparency and does not constitute legal advice. It should be
          reviewed by qualified counsel before relying on it for compliance.
        </p>
      </main>
    </div>
  )
}
