import type { Defect, DefectFilters, DefectSummary } from './defect-types'
import type { Pic } from '@/features/pics/types/pic-types'
import type { Bastb } from '@/features/bastbs/types/bastb-types'

export type DashboardData = {
  summary: DefectSummary
  defects: Defect[]
  pics: Pic[]
  bastbs: Bastb[]
}

export type DashboardFilterState = Omit<DefectFilters, 'page' | 'pageSize' | 'defectDateFrom' | 'defectDateTo'> & {
  defectDateFrom?: string
  defectDateTo?: string
}
