import { NextResponse } from 'next/server'
import { isConfigured } from '@/lib/snaptrade'

// Indique à l'UI si la connexion courtier est disponible (clés présentes côté serveur).
export async function GET() {
  return NextResponse.json({ configured: isConfigured() })
}
