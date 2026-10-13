import type { DefectFilters } from '../types/defect-types'
import type { DefectRepository } from './defect-repository'

export function getDefects(repository: DefectRepository, filters: DefectFilters = {}) {
  return repository.list({ ...filters, page: Math.max(1, filters.page ?? 1), pageSize: filters.pageSize ?? 10 })
}
