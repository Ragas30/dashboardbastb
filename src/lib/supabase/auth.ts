import 'server-only'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from './server'

export async function requireSupabaseUser() {
  const client = await createSupabaseServerClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) redirect('/login')
  return { client, user }
}
