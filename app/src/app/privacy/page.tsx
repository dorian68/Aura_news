import type { Metadata } from 'next'
import { PageHeader, CONTACT_EMAIL } from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Privacy Policy — AlphaLens Daily',
  description: 'How AlphaLens Daily collects, uses, and protects your data.',
}

function S({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 26 }}>
      <h2 className="al-serif" style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>{title}</h2>
      <div className="al-serif" style={{ fontSize: 15, lineHeight: 1.65, color: '#3b414c' }}>{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#efeae0', color: '#16181d' }}>
      <PageHeader />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '36px 24px 60px' }}>
        <h1 className="al-serif" style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 6px' }}>Privacy Policy</h1>
        <p className="al-mono" style={{ fontSize: 11.5, color: '#8b93a1', marginBottom: 26 }}>Last updated: June 27, 2026</p>

        <S title="1. Who we are">
          AlphaLens Daily (&quot;AlphaLens&quot;, &quot;we&quot;, &quot;us&quot;) operates a research and
          education tool that connects financial news to real prediction markets and to a user&apos;s
          portfolio context. This policy explains what data we process and why. Contact:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#2469a6' }}>{CONTACT_EMAIL}</a>.
        </S>

        <S title="2. Data we collect">
          <ul style={{ margin: '6px 0', paddingLeft: 20 }}>
            <li><strong>Preferences you enter</strong> (e.g. your watchlist of tickers). This is stored locally in your browser; it is not tied to your identity on our servers.</li>
            <li><strong>Contact requests</strong> — the name, email and message you submit through our contact form, used only to respond to you.</li>
            <li><strong>Brokerage data (only if you connect an account)</strong> — if you choose to link a brokerage through our integration partner SnapTrade, we receive read-only account information (such as holdings and balances) to provide portfolio context. We do not place trades and do not have withdrawal access.</li>
            <li><strong>Usage &amp; technical data</strong> — basic logs (e.g. request times, errors) needed to operate and secure the service.</li>
          </ul>
        </S>

        <S title="3. How we use data">
          To provide and improve the service, respond to your messages, personalize the news → portfolio
          analysis you ask for, and keep the platform secure. We do not sell your personal data.
        </S>

        <S title="4. Brokerage connections (SnapTrade)">
          Brokerage account linking is powered by <strong>SnapTrade</strong>. When you connect an account,
          your brokerage credentials are handled by SnapTrade and their supported institutions — we never
          see or store your brokerage password. Access is <strong>read-only</strong> and used solely to
          show you portfolio-relevant context. You can disconnect at any time, which revokes our access.
          See SnapTrade&apos;s own privacy terms for how they process connection data.
        </S>

        <S title="5. Third-party services">
          We rely on reputable providers to operate, including: OpenAI (text generation), market &amp; news
          data providers (e.g. Finnhub, Polymarket, CoinGecko, Yahoo Finance), Supabase (database hosting),
          and SnapTrade (brokerage connectivity). Each processes data only as needed to deliver their part
          of the service.
        </S>

        <S title="6. Data retention &amp; security">
          We keep data only as long as necessary for the purposes above, then delete or anonymize it.
          We apply reasonable technical and organizational measures to protect data in transit (HTTPS) and
          at rest. No method of transmission or storage is 100% secure.
        </S>

        <S title="7. Your rights">
          Depending on your location, you may have rights to access, correct, export or delete your personal
          data, and to object to certain processing. To exercise them, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#2469a6' }}>{CONTACT_EMAIL}</a>. You can also
          clear locally-stored preferences by clearing your browser storage.
        </S>

        <S title="8. Cookies &amp; local storage">
          We use local browser storage to remember your preferences (e.g. watchlist). We do not use
          advertising trackers.
        </S>

        <S title="9. Changes">
          We may update this policy; we will revise the &quot;Last updated&quot; date above. Material changes
          will be highlighted on this page.
        </S>

        <p style={{ fontSize: 12.5, color: '#a9a18f', borderTop: '1px solid #e6e0d3', paddingTop: 16, marginTop: 8 }}>
          This document is provided for transparency and does not constitute legal advice. It should be
          reviewed by qualified counsel before relying on it for compliance.
        </p>
      </main>
    </div>
  )
}
