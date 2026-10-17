import type { ZodError } from 'zod'
import { defectImportRowSchema } from '../schemas/defect-schema'
import { normalizeDefectDate, normalizeDefectStatus } from '../domain/defect-import-rules'
import type { DefectRepository } from './defect-repository'

export type DefectImportRowError = { row: number; message: string }
export type DefectImportResult = { created: number; errors: DefectImportRowError[] }

type ImportField = 'projectCluster' | 'unit' | 'defectDate' | 'totalDefect' | 'picName' | 'targetRepair' | 'status'

const COLUMN_ALIASES: Record<ImportField, string[]> = {
  projectCluster: ['project / cluster', 'project/cluster', 'projectcluster', 'project cluster', 'project', 'cluster'],
  unit: ['unit'],
  defectDate: ['tanggal', 'tanggal defect', 'defect date', 'defectdate', 'defect_date'],
  totalDefect: ['total defect', 'totaldefect', 'total_defect', 'total'],
  picName: ['pic', 'nama pic', 'pic name', 'nama_pic'],
  targetRepair: ['target repair', 'targetrepair', 'target_repair'],
  status: ['status'],
}

function normalizeRecord(record: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {}
  for (const [key, value] of Object.entries(record)) {
    normalized[key.trim().toLowerCase().replace(/\s+/g, ' ')] = value ?? ''
  }
  return normalized
}

function pick(record: Record<string, string>, field: ImportField): string {
  for (const alias of COLUMN_ALIASES[field]) {
    if (alias in record) return record[alias]
  }
  return ''
}

function firstMessage(error: ZodError): string {
  return error.issues[0]?.message ?? 'Data baris tidak valid.'
}

export async function importDefects(
  repository: DefectRepository,
  records: Record<string, string>[],
): Promise<DefectImportResult> {
  const errors: DefectImportRowError[] = []
  let created = 0

  for (let index = 0; index < records.length; index += 1) {
    const row = index + 2
    const record = normalizeRecord(records[index])
    if (Object.values(record).every((value) => value.trim() === '')) continue

    const parsed = defectImportRowSchema.safeParse({
      projectCluster: pick(record, 'projectCluster'),
      unit: pick(record, 'unit'),
      defectDate: normalizeDefectDate(pick(record, 'defectDate')),
      totalDefect: pick(record, 'totalDefect'),
      picName: pick(record, 'picName'),
      targetRepair: normalizeDefectDate(pick(record, 'targetRepair')),
      status: normalizeDefectStatus(pick(record, 'status')),
    })
    if (!parsed.success) {
      errors.push({ row, message: firstMessage(parsed.error) })
      continue
    }

    const pic = await repository.findPicByName(parsed.data.picName)
    if (!pic) {
      errors.push({ row, message: `PIC "${parsed.data.picName}" tidak ditemukan.` })
      continue
    }
    if (pic.status !== 'ACTIVE') {
      errors.push({ row, message: `PIC "${parsed.data.picName}" tidak aktif.` })
      continue
    }

    try {
      await repository.create({
        projectCluster: parsed.data.projectCluster,
        unit: parsed.data.unit,
        defectDate: parsed.data.defectDate,
        totalDefect: parsed.data.totalDefect,
        picId: pic.id,
        targetRepair: parsed.data.targetRepair,
        status: parsed.data.status,
      })
      created += 1
    } catch {
      errors.push({ row, message: 'Gagal menyimpan baris ini.' })
    }
  }

  return { created, errors }
}
