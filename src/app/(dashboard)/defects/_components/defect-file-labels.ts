import type { DefectFileStage } from '@/features/defects/domain/defect-file-stage'

export const DEFECT_FILE_STAGE_LABELS: Record<DefectFileStage, string> = {
  BEFORE: 'Sebelum Dikerjakan',
  AFTER: 'Sesudah Dikerjakan',
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
