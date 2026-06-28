import { NextRequest, NextResponse } from 'next/server'
import { isConfigured, registerUser, connectionPortalUrl } from '@/lib/snaptrade'
import { getDb } from '@/lib/supabase'

// Démarre la connexion d'un courtier : enregistre/retrouve l'utilisateur SnapTrade,
// stocke son userSecret CÔTÉ SERVEUR (Supabase), renvoie l'URL du Connection Portal.
// Le userSecret n'est JAMAIS renvoyé au client.
export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ ok: false, reason: 'not_configured', message: 'Connexion courtier bientôt disponible.' }, { status: 503 })
  }
  const { userId } = await req.json().catch(() => ({}))
  const uid = String(userId || '').trim()
  if (!uid) return NextResponse.json({ ok: false, error: 'userId requis' }, { status: 400 })

  const db = getDb()
  if (!db) return NextResponse.json({ ok: false, error: 'stockage indisponible' }, { status: 503 })

  try {
    // Réutilise le secret existant, sinon enregistre l'utilisateur SnapTrade.
    const { data } = await db.from('alphalens_snaptrade_users').select('user_secret').eq('user_id', uid).maybeSingle()
    let secret = data?.user_secret as string | undefined
    if (!secret) {
      const u = await registerUser(uid)
      secret = u.userSecret
      await db.from('alphalens_snaptrade_users').upsert({ user_id: uid, user_secret: secret, created_at: new Date().toISOString() }, { onConflict: 'user_id' })
    }
    const url = await connectionPortalUrl(uid, secret)
    return NextResponse.json({ ok: true, url })
  } catch (e) {
    console.error('[snaptrade/connect]', e instanceof Error ? e.message : e)
    return NextResponse.json({ ok: false, error: 'Échec de la connexion SnapTrade.' }, { status: 502 })
  }
}
