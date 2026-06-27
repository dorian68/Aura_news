import { NextRequest, NextResponse } from 'next/server'
import { getStoredSignal, hydrateSignal } from '@/lib/generation/signal-store'

// Rapport hydraté en JSON (sans SSE) — pour un rendu statique/partage/capture.
export async function GET(req: NextRequest) {
  const newsId = req.nextUrl.searchParams.get('newsId') || ''
  const watchlist = (req.nextUrl.searchParams.get('watchlist') || '').split(',').map(s => s.trim()).filter(Boolean)
  const stored = await getStoredSignal(newsId)
  if (!stored) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const report = await hydrateSignal(stored, watchlist)
  return NextResponse.json({ report })
}
