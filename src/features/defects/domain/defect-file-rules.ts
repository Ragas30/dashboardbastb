import { BusinessRuleError } from '@/lib/errors'

export const MAX_DEFECT_FILE_BYTES = 5 * 1024 * 1024
export const DEFECT_FILE_MIME = 'application/pdf'

export function isPdfFile(file: { name: string; type: string }): boolean {
  return file.type === DEFECT_FILE_MIME || file.name.toLowerCase().endsWith('.pdf')
}

export function assertValidDefectFile(file: { name: string; type: string; size: number }): void {
  if (file.size <= 0) throw new BusinessRuleError('File tidak valid.')
  if (!isPdfFile(file)) throw new BusinessRuleError('File harus berformat PDF.')
  if (file.size > MAX_DEFECT_FILE_BYTES) throw new BusinessRuleError('Ukuran file maksimal 5 MB.')
}
