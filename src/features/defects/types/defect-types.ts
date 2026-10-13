import type { DefectStatus } from '../domain/defect-status'

export type Defect = {
  id: number
  projectCluster: string
  unit: string
  defectDate: Date
  totalDefect: number
  picId: number
  targetRepair: Date
  status: DefectStatus
  createdAt: Date
  updatedAt: Date
  pic?: { id: number; name: string; status: 'ACTIVE' | 'INACTIVE' }
}

export type DefectFilters = {
  search?: string
  projectCluster?: string
  unit?: string
  picId?: number
  status?: DefectStatus
  defectDateFrom?: Date
  defectDateTo?: Date
  page?: number
  pageSize?: number
}

export type DefectInput = Omit<Defect, 'id' | 'createdAt' | 'updatedAt' | 'pic'>
export type DefectSummary = { total: number; open: number; onProgress: number; completed: number }
