'use server'

import { revalidatePath } from 'next/cache'
import { createPicSchema, updatePicSchema } from '@/features/pics/schemas/pic-schema'
import { createPic } from '@/features/pics/application/create-pic'
import { updatePic } from '@/features/pics/application/update-pic'
import { createPicRepository } from '@/features/pics/application/factories'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { AppError, BusinessRuleError } from '@/lib/errors'

type ActionResult = { ok: true } | { ok: false; message: string; fieldErrors?: Record<string, string[]> }

async function requireUser() {
  const client = await createSupabaseServerClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw new BusinessRuleError('Anda harus login untuk melakukan perubahan.')
}

function failure(error: unknown): ActionResult {
  if (error instanceof AppError) return { ok: false, message: error.message }
  return { ok: false, message: 'Terjadi kesalahan pada sistem. Silakan coba lagi.' }
}

export async function createPicAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireUser()
    const parsed = createPicSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { ok: false, message: 'Periksa data PIC.', fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
    await createPic(await createPicRepository(), parsed.data)
    revalidatePath('/master/pics'); revalidatePath('/defects/new')
    return { ok: true }
  } catch (error) { return failure(error) }
}

export async function updatePicAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireUser()
    const parsed = updatePicSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { ok: false, message: 'Periksa data PIC.', fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
    await updatePic(await createPicRepository(), parsed.data)
    revalidatePath('/master/pics'); revalidatePath('/defects/new')
    return { ok: true }
  } catch (error) { return failure(error) }
}
