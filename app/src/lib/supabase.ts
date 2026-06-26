// Server-side Supabase client (service role). Used by the ingester to write
// articles and by the read layer to query them. Returns null when not
// configured so everything degrades to the live feed.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

export function getDb(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  if (!cached) cached = createClient(url, key, { auth: { persistSession: false } })
  return cached
}
