import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createDefectSchema } from '@/features/defects/schemas/defect-schema'

describe('createDefectSchema', () => {
  it('requires a positive integer total and required fields', () => {
    const result = createDefectSchema.safeParse({
      projectCluster: 'Cluster A',
      unit: 'A-01',
      defectDate: '2026-10-07',
      totalDefect: 0,
      picId: 1,
      targetRepair: '2026-10-10',
      status: 'OPEN',
    })

    assert.equal(result.success, false)
  })
})
