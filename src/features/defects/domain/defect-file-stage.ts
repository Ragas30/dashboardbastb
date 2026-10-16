export const DEFECT_FILE_STAGES = ['BEFORE', 'AFTER'] as const

export type DefectFileStage = (typeof DEFECT_FILE_STAGES)[number]
