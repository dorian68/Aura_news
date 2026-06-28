import { NextRequest, NextResponse } from 'next/server'
import { isConfigured, listHoldings } from '@/lib/snaptrade'
import { getDb } from '@/lib/supabase'

// Holdings LECTURE SEULE de l'utilisateur (récupère le userSecret stocké côté serveur).
export async function GET(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ ok: false, reason: 'not_configured', holdings: [] }, { status: 503 })
  }
  const uid = String(req.nextUrl.searchParams.get('userId') || '').trim()
  if (!uid) return NextResponse.json({ ok: false, error: 'userId requis' }, { status: 400 })

  const db = getDb()
  if (!db) return NextResponse.json({ ok: false, error: 'stockage indisponible' }, { status: 503 })

  const { data } = await db.from('alphalens_snaptrade_users').select('user_secret').eq('user_id', uid).maybeSingle()
  const secret = data?.user_secret as string | undefined
  if (!secret) return NextResponse.json({ ok: false, error: 'aucun courtier connecté' }, { status: 404 })

  try {
    const holdings = await listHoldings(uid, secret)
    return NextResponse.json({ ok: true, holdings })
  } catch (e) {
    console.error('[snaptrade/holdings]', e instanceof Error ? e.message : e)
    return NextResponse.json({ ok: false, error: 'Lecture des positions impossible.' }, { status: 502 })
  }
}
