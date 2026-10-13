export const DEFECT_STATUSES = ['OPEN', 'ON_PROGRESS', 'COMPLETED'] as const

export type DefectStatus = (typeof DEFECT_STATUSES)[number]
