export function TrustStrip() {
  return (
    <section style={{ marginTop: 30, background: '#f7f4ec', border: '1px solid #e6e0d3', borderRadius: 16, padding: '22px 24px', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 24 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase', color: '#2469a6', marginBottom: 8 }}>How AlphaLens generates reports</div>
        <p style={{ fontSize: 13, lineHeight: 1.55, color: '#59606e' }}>Each story is an editorial angle, not a finished article. When you choose how to read it, AlphaLens AI reads the source headlines, pulls live market context and prediction-market probabilities, builds scenarios, and writes a structured research note.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderLeft: '1px solid #e6e0d3', paddingLeft: 24 }}>
        {['Sources checked before generation', 'Assumptions shown on every report', 'Prediction odds for context, not betting'].map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ color: '#0f7d56' }}>✓</span>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ borderLeft: '1px solid #e6e0d3', paddingLeft: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
        <p style={{ fontSize: 11.5, lineHeight: 1.5, color: '#8b93a1' }}>Research &amp; education only. Not investment advice. AI-generated — verify with independent sources. Market probabilities are real Polymarket prices; asset views are AlphaLens&apos;s own.</p>
      </div>
    </section>
  )
}
