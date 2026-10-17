import type { DefectStatus } from './defect-status'

const STATUS_ALIASES: Record<string, DefectStatus> = {
  open: 'OPEN',
  'on progress': 'ON_PROGRESS',
  onprogress: 'ON_PROGRESS',
  progress: 'ON_PROGRESS',
  'in progress': 'ON_PROGRESS',
  completed: 'COMPLETED',
  complete: 'COMPLETED',
  done: 'COMPLETED',
  selesai: 'COMPLETED',
}

export function normalizeDefectStatus(value: string): DefectStatus | null {
  const key = value.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ')
  return STATUS_ALIASES[key] ?? null
}

export function normalizeDefectDate(value: string): Date | null {
  const trimmed = value.trim()
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed)
  if (iso) return buildUtcDate(Number(iso[1]), Number(iso[2]), Number(iso[3]))
  const local = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(trimmed)
  if (local) return buildUtcDate(Number(local[3]), Number(local[2]), Number(local[1]))
  return null
}

function buildUtcDate(year: number, month: number, day: number): Date | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return date
}

export function formatDefectDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}
