export const DEFECT_STATUSES = ['OPEN', 'ON_PROGRESS', 'COMPLETED'] as const

export type DefectStatus = (typeof DEFECT_STATUSES)[number]

export const DEFECT_STATUS_LABELS: Record<DefectStatus, string> = {
  OPEN: 'Open',
  ON_PROGRESS: 'On Progress',
  COMPLETED: 'Completed',
}
