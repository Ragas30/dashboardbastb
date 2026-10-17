import { serializeCsv } from '@/lib/csv'
import { DEFECT_STATUS_LABELS } from '../domain/defect-status'
import { formatDefectDate } from '../domain/defect-import-rules'
import type { Defect } from '../types/defect-types'

export const DEFECT_CSV_HEADERS = [
  'Project / Cluster',
  'Unit',
  'Tanggal',
  'Total Defect',
  'PIC',
  'Target Repair',
  'Status',
]

export function serializeDefectsCsv(defects: Defect[]): string {
  const rows = [
    DEFECT_CSV_HEADERS,
    ...defects.map((defect) => [
      defect.projectCluster,
      defect.unit,
      formatDefectDate(defect.defectDate),
      String(defect.totalDefect),
      defect.pic?.name ?? '',
      formatDefectDate(defect.targetRepair),
      DEFECT_STATUS_LABELS[defect.status],
    ]),
  ]
  return serializeCsv(rows)
}
