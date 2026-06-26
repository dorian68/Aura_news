import { NextResponse } from 'next/server'
import { getMatches } from '@/lib/matches-feed'

// Live World Cup data, merged from football-data.org (+ thesportsdb / api-football).
// Mock is used only as a last-resort fallback inside getMatches().
export const revalidate = 30

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  const { matches } = await getMatches()

  if (id) {
    const match = matches.find(m => m.id === id)
    if (!match) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(match)
  }
  return NextResponse.json(matches)
}
