'use server'

import { revalidatePath } from 'next/cache'
import { createDefectSchema, updateDefectSchema } from '@/features/defects/schemas/defect-schema'
import { createDefect, deleteDefect, updateDefect } from '@/features/defects/application'
import { createDefectRepository } from '@/features/defects/application/factories'
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

export async function createDefectAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireUser()
    const parsed = createDefectSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { ok: false, message: 'Periksa data defect.', fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
    await createDefect(await createDefectRepository(), parsed.data)
    revalidatePath('/dashboard'); revalidatePath('/defects')
    return { ok: true }
  } catch (error) { return failure(error) }
}

export async function updateDefectAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireUser()
    const parsed = updateDefectSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { ok: false, message: 'Periksa data defect.', fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
    await updateDefect(await createDefectRepository(), parsed.data)
    revalidatePath('/dashboard'); revalidatePath('/defects'); revalidatePath(`/defects/${parsed.data.id}`)
    return { ok: true }
  } catch (error) { return failure(error) }
}

export async function deleteDefectAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireUser()
    const id = Number(formData.get('id'))
    if (!Number.isInteger(id) || id < 1) return { ok: false, message: 'ID defect tidak valid.' }
    await deleteDefect(await createDefectRepository(), id)
    revalidatePath('/dashboard'); revalidatePath('/defects')
    return { ok: true }
  } catch (error) { return failure(error) }
}
