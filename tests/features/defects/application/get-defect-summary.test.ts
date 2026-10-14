import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { getDefectSummary } from '@/features/defects/application/get-defect-summary'
import type { DefectRepository } from '@/features/defects/application/defect-repository'

describe('getDefectSummary', () => {
  it('returns accumulated defect totals by status', async () => {
    const repository = { summary: async () => ({ total: 15, open: 5, onProgress: 3, completed: 7 }) } as DefectRepository
    assert.deepEqual(await getDefectSummary(repository), { total: 15, open: 5, onProgress: 3, completed: 7 })
  })
})
