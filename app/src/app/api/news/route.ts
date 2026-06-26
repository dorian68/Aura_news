import { NextResponse } from 'next/server'
import { fetchNews } from '@/lib/news'

// Real Finnhub news only — returns [] if the key is missing or the API fails.
export async function GET() {
  const news = await fetchNews()
  return NextResponse.json(news)
}
