'use server'

import { revalidatePath } from 'next/cache'
import { createDefectSchema, updateDefectSchema, updateDefectStatusSchema, uploadDefectFileSchema } from '@/features/defects/schemas/defect-schema'
import {
  createDefect,
  deleteDefect,
  deleteDefectFile,
  getDefectFiles,
  updateDefect,
  updateDefectStatus,
  uploadDefectFile,
} from '@/features/defects/application'
import { createDefectFileRepository, createDefectRepository } from '@/features/defects/application/factories'
import { compressDefectPdf } from '@/features/defects/infrastructure/pdf-compression'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { AppError, BusinessRuleError } from '@/lib/errors'
import type { DefectFile } from '@/features/defects/types/defect-types'

export type ActionResult = { ok: true } | { ok: false; message: string; fieldErrors?: Record<string, string[]> }
export type DefectFileResult = { ok: true; file: DefectFile } | { ok: false; message: string }
export type DefectFilesResult = { ok: true; files: DefectFile[] } | { ok: false; message: string }

async function requireUser() {
  const client = await createSupabaseServerClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw new BusinessRuleError('Anda harus login untuk melakukan perubahan.')
}

function messageOf(error: unknown): string {
  if (error instanceof AppError) return error.message
  return 'Terjadi kesalahan pada sistem. Silakan coba lagi.'
}

function failure(error: unknown): ActionResult {
  return { ok: false, message: messageOf(error) }
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
    revalidatePath('/dashboard'); revalidatePath('/defects')
    return { ok: true }
  } catch (error) { return failure(error) }
}

export async function updateDefectStatusAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireUser()
    const parsed = updateDefectStatusSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { ok: false, message: 'Status defect tidak valid.' }
    await updateDefectStatus(await createDefectRepository(), parsed.data)
    revalidatePath('/dashboard'); revalidatePath('/defects')
    return { ok: true }
  } catch (error) { return failure(error) }
}

export async function deleteDefectAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireUser()
    const id = Number(formData.get('id'))
    if (!Number.isInteger(id) || id < 1) return { ok: false, message: 'ID defect tidak valid.' }
    await deleteDefect(await createDefectRepository(), await createDefectFileRepository(), id)
    revalidatePath('/dashboard'); revalidatePath('/defects')
    return { ok: true }
  } catch (error) { return failure(error) }
}

export async function listDefectFilesAction(defectId: number): Promise<DefectFilesResult> {
  try {
    await requireUser()
    const id = Number(defectId)
    if (!Number.isInteger(id) || id < 1) return { ok: false, message: 'ID defect tidak valid.' }
    const files = await getDefectFiles(await createDefectFileRepository(), id)
    return { ok: true, files }
  } catch (error) { return { ok: false, message: messageOf(error) } }
}

export async function uploadDefectFileAction(formData: FormData): Promise<DefectFileResult> {
  try {
    await requireUser()
    const parsed = uploadDefectFileSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { ok: false, message: 'Data lampiran tidak valid.' }
    const file = formData.get('file')
    if (!(file instanceof File) || file.size === 0) return { ok: false, message: 'Pilih file PDF terlebih dahulu.' }
    const prepared = await compressDefectPdf(file)
    const saved = await uploadDefectFile(await createDefectFileRepository(), await createDefectRepository(), {
      defectId: parsed.data.defectId,
      stage: parsed.data.stage,
      file: prepared,
    })
    revalidatePath('/defects')
    return { ok: true, file: saved }
  } catch (error) { return { ok: false, message: messageOf(error) } }
}

export async function deleteDefectFileAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireUser()
    const id = Number(formData.get('id'))
    if (!Number.isInteger(id) || id < 1) return { ok: false, message: 'ID lampiran tidak valid.' }
    await deleteDefectFile(await createDefectFileRepository(), id)
    revalidatePath('/defects')
    return { ok: true }
  } catch (error) { return failure(error) }
}
