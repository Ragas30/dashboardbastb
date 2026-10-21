import { getDefectSummary } from './get-defect-summary'
import { getDefects } from './get-defects'
import type { DashboardData } from '../types/dashboard-types'
import type { DefectRepository } from './defect-repository'
import type { PicRepository } from '@/features/pics/application/pic-repository'
import type { BastbRepository } from '@/features/bastbs/application/bastb-repository'
import { parseDashboardDefectFilters } from './parse-dashboard-filters'

export async function getDashboardData(
  defectRepository: DefectRepository,
  picRepository: PicRepository,
  bastbRepository: BastbRepository,
  rawFilters: Parameters<typeof parseDashboardDefectFilters>[0],
): Promise<DashboardData> {
  const filters = parseDashboardDefectFilters(rawFilters)
  const [summary, pics, bastbs, defects] = await Promise.all([
    getDefectSummary(defectRepository, filters),
    picRepository.list(),
    bastbRepository.list(),
    getDefects(defectRepository, { ...filters, page: 1, pageSize: 10000 }),
  ])
  return { summary, pics, bastbs, defects: defects.items }
}
