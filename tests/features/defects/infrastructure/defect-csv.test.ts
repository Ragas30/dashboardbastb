import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { serializeDefectsCsv } from '@/features/defects/infrastructure/defect-csv'
import type { Defect } from '@/features/defects/types/defect-types'

const defect: Defect = {
  id: 1,
  projectCluster: 'Cluster A',
  unit: 'A-01',
  defectDate: new Date('2026-10-07T00:00:00Z'),
  totalDefect: 5,
  picId: 1,
  targetRepair: new Date('2026-10-10T00:00:00Z'),
  status: 'ON_PROGRESS',
  createdAt: new Date('2026-10-07T00:00:00Z'),
  updatedAt: new Date('2026-10-09T00:00:00Z'),
  pic: { id: 1, name: 'Andi', status: 'ACTIVE' },
}

describe('serializeDefectsCsv', () => {
  it('writes the header and one row per defect', () => {
    const csv = serializeDefectsCsv([defect])
    assert.ok(csv.includes('Project / Cluster,Unit,Tanggal,Total Defect,PIC,Target Repair,Status'))
    assert.ok(csv.includes('Cluster A,A-01,2026-10-07,5,Andi,2026-10-10,On Progress'))
  })

  it('quotes values containing commas', () => {
    const csv = serializeDefectsCsv([{ ...defect, projectCluster: 'Cluster A, B' }])
    assert.ok(csv.includes('"Cluster A, B"'))
  })
})
