import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/supabase'

// Réception des messages du formulaire de contact. Validation + persistance
// Supabase si la table `aura_contact_messages` existe (sinon log serveur — le
// formulaire reste fonctionnel pour l'utilisateur). Aucune donnée fabriquée.
export async function POST(req: NextRequest) {
  const { name = '', email = '', message = '' } = await req.json().catch(() => ({}))
  const n = String(name).trim(), e = String(email).trim(), m = String(message).trim()

  if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return NextResponse.json({ ok: false, error: 'Email invalide.' }, { status: 400 })
  if (m.length < 5) return NextResponse.json({ ok: false, error: 'Message trop court.' }, { status: 400 })

  const row = {
    name: n.slice(0, 200),
    email: e.slice(0, 320),
    message: m.slice(0, 5000),
    created_at: new Date().toISOString(),
  }

  const db = getDb()
  if (db) {
    const { error } = await db.from('alphalens_contact_messages').insert(row)
    if (error) console.error('[contact] insert KO (table absente ?):', error.message)
  }
  // Toujours visible côté serveur (logs), même sans DB.
  console.log(`[contact] de ${row.email} (${row.name || 'anonyme'}): ${row.message.slice(0, 140)}`)

  return NextResponse.json({ ok: true })
}
