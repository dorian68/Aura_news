import { searchMarkets } from '@/lib/market-search'

// Live autocomplete + trending feed for the search bar. q='' → trending.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q') || ''
  const items = await searchMarkets(q, 6)
  return Response.json(items)
}
