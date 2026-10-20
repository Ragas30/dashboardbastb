'use server'

import { revalidatePath } from 'next/cache'
import { createBastbSchema, updateBastbSchema } from '@/features/bastbs/schemas/bastb-schema'
import { createBastb, createBastbRepository, updateBastb } from '@/features/bastbs/application'
import { requireSupabaseUser } from '@/lib/supabase/auth'
import { AppError } from '@/lib/errors'

export type BastbActionResult = { ok: true } | { ok: false; message: string; fieldErrors?: Record<string, string[]> }
function message(error: unknown) { return error instanceof AppError ? error.message : 'Terjadi kesalahan pada sistem. Silakan coba lagi.' }
export async function createBastbAction(formData: FormData): Promise<BastbActionResult> {
  try { await requireSupabaseUser(); const parsed = createBastbSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return { ok: false, message: 'Periksa data BASTB.', fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }; await createBastb(await createBastbRepository(), parsed.data); revalidatePath('/bastb'); revalidatePath('/defects'); return { ok: true } } catch (error) { return { ok: false, message: message(error) } }
}
export async function updateBastbAction(formData: FormData): Promise<BastbActionResult> {
  try { await requireSupabaseUser(); const parsed = updateBastbSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return { ok: false, message: 'Periksa data BASTB.', fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }; const { id, ...input } = parsed.data; await updateBastb(await createBastbRepository(), id, input); revalidatePath('/bastb'); revalidatePath('/defects'); return { ok: true } } catch (error) { return { ok: false, message: message(error) } }
}
