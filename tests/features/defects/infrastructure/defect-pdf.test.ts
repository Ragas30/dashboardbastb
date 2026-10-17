import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildDefectsPdf } from '@/features/defects/infrastructure/defect-pdf'
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

describe('buildDefectsPdf', () => {
  it('produces a valid PDF document', async () => {
    const body = await buildDefectsPdf([defect], { title: 'Daftar Defect', generatedAt: new Date('2026-10-16T08:00:00Z') })
    const header = new TextDecoder().decode(new Uint8Array(body).slice(0, 5))
    assert.equal(header, '%PDF-')
  })

  it('handles an empty list', async () => {
    const body = await buildDefectsPdf([], { title: 'Daftar Defect', generatedAt: new Date('2026-10-16T08:00:00Z') })
    assert.ok(body.byteLength > 0)
  })
})
