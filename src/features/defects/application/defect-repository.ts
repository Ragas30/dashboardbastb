import type { Defect, DefectFilters, DefectInput, DefectSummary } from '../types/defect-types'

export interface DefectRepository {
  list(filters: DefectFilters): Promise<{ items: Defect[]; total: number }>
  findById(id: number): Promise<Defect | null>
  create(input: DefectInput): Promise<Defect>
  update(id: number, input: DefectInput): Promise<Defect>
  delete(id: number): Promise<void>
  summary(filters: Omit<DefectFilters, 'page' | 'pageSize'>): Promise<DefectSummary>
}
