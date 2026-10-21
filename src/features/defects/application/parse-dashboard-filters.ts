import { DEFECT_STATUSES, type DefectStatus } from '../domain/defect-status'
import type { DefectFilters } from '../types/defect-types'

type DashboardFilterParams = {
  bastbId?: string
  search?: string
  projectCluster?: string
  unit?: string
  picId?: string
  status?: string
  defectDateFrom?: string
  defectDateTo?: string
}

function nonEmpty(value?: string) {
  const trimmed = value?.trim()
  return trimmed || undefined
}

function positiveInteger(value?: string) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}

function validDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export function parseDashboardDefectFilters(params: DashboardFilterParams): Omit<DefectFilters, 'page' | 'pageSize'> {
  const status = params.status && (DEFECT_STATUSES as readonly string[]).includes(params.status)
    ? params.status as DefectStatus
    : undefined

  return {
    bastbId: positiveInteger(params.bastbId),
    search: nonEmpty(params.search),
    projectCluster: nonEmpty(params.projectCluster),
    unit: nonEmpty(params.unit),
    picId: positiveInteger(params.picId),
    status,
    defectDateFrom: validDate(params.defectDateFrom),
    defectDateTo: validDate(params.defectDateTo),
  }
}
