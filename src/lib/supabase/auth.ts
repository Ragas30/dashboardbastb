import 'server-only'

import { connection } from 'next/server'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from './server'

export async function requireSupabaseUser() {
  await connection()
  const client = await createSupabaseServerClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) redirect('/login')
  return { client, user }
}
