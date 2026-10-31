import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createDefectSchema, updateDefectSchema } from '@/features/defects/schemas/defect-schema'

describe('createDefectSchema', () => {
  it('accepts an empty target repair and optional description', () => {
    const result = createDefectSchema.safeParse({
      projectCluster: 'Cluster A',
      unit: 'A-01',
      defectDate: '2026-10-07',
      totalDefect: 5,
      picId: 1,
      targetRepair: '',
      description: 'Menunggu jadwal perbaikan.',
      status: 'OPEN',
    })

    assert.equal(result.success, true)
  })

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

  it('explains when total defect is empty or NaN', () => {
    for (const totalDefect of ['', Number.NaN]) {
      const result = createDefectSchema.safeParse({
        projectCluster: 'Cluster A',
        unit: 'A-01',
        defectDate: '2026-10-07',
        totalDefect,
        picId: 1,
        targetRepair: '2026-10-10',
        status: 'OPEN',
      })

      assert.equal(result.success, false)
      if (!result.success) assert.equal(result.error.flatten().fieldErrors.totalDefect?.[0], 'Total defect wajib diisi dan harus berupa angka.')
    }
  })

  it('explains when the update defect id is missing', () => {
    const result = updateDefectSchema.safeParse({
      projectCluster: 'Cluster A',
      unit: 'A-01',
      defectDate: '2026-10-07',
      totalDefect: 5,
      picId: 1,
      targetRepair: '2026-10-10',
      status: 'OPEN',
    })

    assert.equal(result.success, false)
    if (!result.success) assert.equal(result.error.flatten().fieldErrors.id?.[0], 'ID defect tidak valid.')
  })
})
