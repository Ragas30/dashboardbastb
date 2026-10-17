import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { updateDefectStatus } from '@/features/defects/application/update-defect-status'
import type { DefectRepository } from '@/features/defects/application/defect-repository'
import type { Defect, DefectInput } from '@/features/defects/types/defect-types'
import { NotFoundError } from '@/lib/errors'

const defect: Defect = {
  id: 1, projectCluster: 'Cluster A', unit: 'A-01', defectDate: new Date('2026-10-07'),
  totalDefect: 5, picId: 3, targetRepair: new Date('2026-10-10'), status: 'OPEN',
  createdAt: new Date('2026-10-07'), updatedAt: new Date('2026-10-07'),
}

function repository(existing: Defect | null) {
  let captured: { id: number; input: DefectInput } | null = null
  const repo: DefectRepository = {
    list: async () => ({ items: [], total: 0 }),
    findById: async () => existing,
    findPicById: async () => null,
    findPicByName: async () => null,
    create: async () => existing ?? defect,
    update: async (id, input) => { captured = { id, input }; return { ...defect, ...input, id } },
    delete: async () => {},
    summary: async () => ({ total: 0, open: 0, onProgress: 0, completed: 0 }),
  }
  return { repo, updated: () => captured }
}

describe('updateDefectStatus', () => {
  it('updates only the status field and preserves the rest', async () => {
    const { repo, updated } = repository(defect)

    const result = await updateDefectStatus(repo, { id: 1, status: 'COMPLETED' })

    assert.equal(result.status, 'COMPLETED')
    assert.equal(updated()?.id, 1)
    assert.equal(updated()?.input.status, 'COMPLETED')
    assert.equal(updated()?.input.totalDefect, 5)
    assert.equal(updated()?.input.picId, 3)
    assert.equal(updated()?.input.unit, 'A-01')
  })

  it('throws NotFoundError when the defect is missing', async () => {
    const { repo, updated } = repository(null)

    await assert.rejects(
      updateDefectStatus(repo, { id: 99, status: 'OPEN' }),
      (error: unknown) => error instanceof NotFoundError,
    )
    assert.equal(updated(), null)
  })
})
