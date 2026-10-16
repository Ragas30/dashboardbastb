import type { DefectStatus } from '@/features/defects/domain/defect-status'

export const DEFECT_STATUS_LABELS: Record<DefectStatus, string> = {
  OPEN: 'Open',
  ON_PROGRESS: 'On Progress',
  COMPLETED: 'Completed',
}
