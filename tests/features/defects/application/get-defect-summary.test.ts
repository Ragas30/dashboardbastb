import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { getDefectSummary } from '@/features/defects/application/get-defect-summary'
import type { DefectRepository } from '@/features/defects/application/defect-repository'
import type { Defect } from '@/features/defects/types/defect-types'

describe('getDefectSummary', () => {
  it('returns accumulated defect totals by status', async () => {
    const repository: DefectRepository = {
      summary: async () => ({ total: 15, open: 5, onProgress: 3, completed: 7 }),
      list: async () => ({ items: [], total: 0 }),
      findById: async () => null,
      findPicById: async () => null,
      create: async () => ({ id: 1 } as Defect),
      update: async () => ({ id: 1 } as Defect),
      delete: async () => {},
    }
    assert.deepEqual(await getDefectSummary(repository), { total: 15, open: 5, onProgress: 3, completed: 7 })
  })
})
