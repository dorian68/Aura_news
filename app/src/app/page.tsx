import { TickerTape } from '@/components/home/TickerTape'
import { Masthead } from '@/components/home/Masthead'
import { HeroSection } from '@/components/home/HeroSection'
import { Mosaic } from '@/components/home/Mosaic'
import { NewsSections } from '@/components/home/NewsSections'
import { TrustStrip } from '@/components/home/TrustStrip'
import { MatchdayWidget } from '@/components/home/MatchdayWidget'
import { LiveSearch } from '@/components/home/LiveSearch'
import { fetchNews } from '@/lib/news'
import { fetchTickerItems } from '@/lib/ticker'

export const revalidate = 300

export default async function HomePage() {
  const [news, ticker] = await Promise.all([fetchNews(), fetchTickerItems()])

  return (
    <div style={{ minHeight: '100vh', background: '#efeae0', color: '#16181d' }}>
      <TickerTape items={ticker} />
      <MatchdayWidget />
      <Masthead />
      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '26px 28px 60px' }}>
        <div style={{ marginBottom: 34 }}>
          <LiveSearch />
        </div>
        <HeroSection news={news} />
        <SectionDivider />
        <Mosaic news={news} />
        <div style={{ height: 8 }} />
        <NewsSections news={news} />
        <TrustStrip />
      </main>
    </div>
  )
}

function SectionDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, marginTop: 4 }}>
      <h3 className="al-serif" style={{ fontSize: 15, fontWeight: 700, letterSpacing: '.02em', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>
        Today&apos;s market desk
      </h3>
      <div style={{ flex: 1, height: 1, background: '#d9d3c4' }} />
      <span className="al-mono" style={{ fontSize: 11, color: '#8b93a1', whiteSpace: 'nowrap' }}>
        Tap any story — the report is generated on demand
      </span>
    </div>
  )
}
