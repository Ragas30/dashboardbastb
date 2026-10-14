import type { Defect, DefectFilters, DefectInput, DefectSummary } from '../types/defect-types'

export interface DefectRepository {
  list(filters: DefectFilters): Promise<{ items: Defect[]; total: number }>
  findById(id: number): Promise<Defect | null>
  findPicById(id: number): Promise<{ id: number; name: string; status: 'ACTIVE' | 'INACTIVE' } | null>
  create(input: DefectInput): Promise<Defect>
  update(id: number, input: DefectInput): Promise<Defect>
  delete(id: number): Promise<void>
  summary(filters: Omit<DefectFilters, 'page' | 'pageSize'>): Promise<DefectSummary>
}
