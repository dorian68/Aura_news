import { NextRequest, NextResponse } from 'next/server'

export interface PolyMarket {
  id: string
  question: string
  yes: number    // 0-100
  no: number     // 0-100
  volume: string
  liquidity: string
  change24h: string
  change24hColor: string
  url: string
}

function scoreMatch(question: string, query: string): number {
  const q = query.toLowerCase()
  const t = question.toLowerCase()
  const words = q.split(/\s+/).filter(w => w.length > 3)
  return words.reduce((acc, w) => acc + (t.includes(w) ? 1 : 0), 0)
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') || ''

  try {
    // Polymarket Gamma API — public, no auth required
    const url = `https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=50&order=volume&ascending=false`
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 300 },
    })

    if (res.ok) {
      const data = await res.json()
      const markets = (data as Record<string, unknown>[])
        .filter(m => m.active && !m.closed && m.outcomePrices)
        .map(m => {
          let prices: number[] = [0.5, 0.5]
          try { prices = JSON.parse(m.outcomePrices as string).map(Number) } catch { /* skip */ }
          const yes = Math.round(prices[0] * 100)
          const no = Math.round((1 - prices[0]) * 100)
          const vol = Number(m.volumeNum || m.volume || 0)
          const liq = Number(m.liquidityNum || m.liquidity || 0)
          return {
            id: String(m.id || ''),
            question: String(m.question || m.title || ''),
            yes,
            no,
            volume: vol > 1_000_000 ? `$${(vol / 1_000_000).toFixed(1)}M` : `$${(vol / 1000).toFixed(0)}K`,
            liquidity: liq > 100_000 ? 'High' : liq > 10_000 ? 'Med' : 'Low',
            change24h: '+0.0%',
            change24hColor: '#8b93a1',
            url: `https://polymarket.com/event/${m.slug || m.id}`,
          } as PolyMarket
        })

      if (query) {
        const top = markets
          .map(m => ({ m, score: scoreMatch(m.question, query) }))
          .filter(x => x.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(x => x.m)
        return NextResponse.json(top)
      }
      return NextResponse.json(markets.slice(0, 10))
    }
  } catch {
    // Real API failed — return empty rather than fabricated markets.
  }

  return NextResponse.json([])
}
