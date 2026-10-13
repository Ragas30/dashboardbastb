import type { DefectFilters } from '../types/defect-types'
import type { DefectRepository } from './defect-repository'

export function getDefectSummary(repository: DefectRepository, filters: Omit<DefectFilters, 'page' | 'pageSize'> = {}) {
  return repository.summary(filters)
}
