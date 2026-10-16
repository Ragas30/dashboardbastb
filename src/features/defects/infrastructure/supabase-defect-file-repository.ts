import { randomUUID } from 'node:crypto'
import { InfrastructureError, NotFoundError } from '@/lib/errors'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DefectFileRepository } from '../application/defect-file-repository'
import type { DefectFile } from '../types/defect-types'
import type { DefectFileStage } from '../domain/defect-file-stage'

const BUCKET = 'defect-files'
const SIGNED_URL_TTL_SECONDS = 60 * 60

type DefectFileRow = {
  id: number
  defect_id: number
  stage: DefectFileStage
  file_path: string
  file_name: string
  file_size: number
  created_at: string
}

type SignedUrlEntry = { path: string | null; signedUrl: string | null }

function mapFile(row: DefectFileRow, signedUrl: string | null): DefectFile {
  return {
    id: row.id,
    defectId: row.defect_id,
    stage: row.stage,
    fileName: row.file_name,
    fileSize: row.file_size,
    createdAt: new Date(row.created_at),
    signedUrl,
  }
}

export class SupabaseDefectFileRepository implements DefectFileRepository {
  constructor(private readonly client: SupabaseClient) {}

  async listByDefect(defectId: number) {
    const { data, error } = await this.client
      .from('defect_files')
      .select('*')
      .eq('defect_id', defectId)
      .order('created_at', { ascending: true })
    if (error) throw new InfrastructureError('Gagal mengambil lampiran defect.', error)
    const rows = (data ?? []) as DefectFileRow[]
    if (rows.length === 0) return []
    const { data: signed, error: signError } = await this.client.storage
      .from(BUCKET)
      .createSignedUrls(rows.map((row) => row.file_path), SIGNED_URL_TTL_SECONDS)
    if (signError) throw new InfrastructureError('Gagal membuat tautan lampiran.', signError)
    const urlByPath = new Map<string, string | null>(
      ((signed ?? []) as SignedUrlEntry[]).map((entry) => [entry.path ?? '', entry.signedUrl]),
    )
    return rows.map((row) => mapFile(row, urlByPath.get(row.file_path) ?? null))
  }

  async upload(input: { defectId: number; stage: DefectFileStage; file: File }) {
    const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${input.defectId}/${input.stage.toLowerCase()}/${randomUUID()}-${safeName}`
    const { error: uploadError } = await this.client.storage
      .from(BUCKET)
      .upload(path, input.file, { contentType: input.file.type || 'application/pdf', upsert: false })
    if (uploadError) throw new InfrastructureError('Gagal mengunggah lampiran.', uploadError)
    const { data, error } = await this.client
      .from('defect_files')
      .insert({
        defect_id: input.defectId,
        stage: input.stage,
        file_path: path,
        file_name: input.file.name,
        file_size: input.file.size,
      })
      .select('*')
      .single()
    if (error) {
      await this.client.storage.from(BUCKET).remove([path])
      throw new InfrastructureError('Gagal menyimpan data lampiran.', error)
    }
    const { data: signed } = await this.client.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL_SECONDS)
    return mapFile(data as DefectFileRow, signed?.signedUrl ?? null)
  }

  async remove(id: number) {
    const { data, error } = await this.client.from('defect_files').select('*').eq('id', id).maybeSingle()
    if (error) throw new InfrastructureError('Gagal mengambil lampiran.', error)
    if (!data) throw new NotFoundError('Lampiran tidak ditemukan.')
    const row = data as DefectFileRow
    const { error: deleteError } = await this.client.from('defect_files').delete().eq('id', id)
    if (deleteError) throw new InfrastructureError('Gagal menghapus lampiran.', deleteError)
    await this.client.storage.from(BUCKET).remove([row.file_path])
  }

  async removeByDefect(defectId: number) {
    const { data, error } = await this.client.from('defect_files').select('file_path').eq('defect_id', defectId)
    if (error) throw new InfrastructureError('Gagal mengambil lampiran defect.', error)
    const paths = ((data ?? []) as { file_path: string }[]).map((row) => row.file_path)
    if (paths.length > 0) await this.client.storage.from(BUCKET).remove(paths)
  }
}
