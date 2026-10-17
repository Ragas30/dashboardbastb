import type { DefectFilters } from '../types/defect-types'
import type { DefectRepository } from './defect-repository'

export const DEFECT_EXPORT_LIMIT = 5000

export function getDefectExport(repository: DefectRepository, filters: Omit<DefectFilters, 'page' | 'pageSize'> = {}) {
  return repository.list({ ...filters, page: 1, pageSize: DEFECT_EXPORT_LIMIT })
}
