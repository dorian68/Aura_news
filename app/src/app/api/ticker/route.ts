import { NextResponse } from 'next/server'
import { fetchTickerItems } from '@/lib/ticker'

// Real Twelve Data + CoinGecko only — returns [] if keys are missing / APIs fail.
export async function GET() {
  const items = await fetchTickerItems()
  return NextResponse.json(items)
}
