import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { deleteDefect } from '@/features/defects/application/delete-defect'
import type { DefectFileRepository } from '@/features/defects/application/defect-file-repository'
import type { DefectRepository } from '@/features/defects/application/defect-repository'
import type { Defect } from '@/features/defects/types/defect-types'
import { NotFoundError } from '@/lib/errors'

const defect = {
  id: 1, projectCluster: 'Cluster A', unit: 'A-01', defectDate: new Date('2026-10-07'),
  totalDefect: 5, picId: 1, targetRepair: new Date('2026-10-10'), status: 'OPEN',
  createdAt: new Date(), updatedAt: new Date(),
} as Defect

function repositories(exists: boolean) {
  const calls: string[] = []
  const defectRepository: DefectRepository = {
    list: async () => ({ items: [], total: 0 }),
    findById: async () => (exists ? defect : null),
    findPicById: async () => null,
    findPicByName: async () => null,
    create: async () => defect,
    update: async () => defect,
    delete: async () => { calls.push('defect:delete') },
    summary: async () => ({ total: 0, open: 0, onProgress: 0, completed: 0 }),
  }
  const fileRepository: DefectFileRepository = {
    listByDefect: async () => [],
    upload: async () => { throw new Error('unused') },
    remove: async () => {},
    removeByDefect: async () => { calls.push('files:remove') },
  }
  return { defectRepository, fileRepository, calls }
}

describe('deleteDefect', () => {
  it('removes the attached files before deleting the defect', async () => {
    const { defectRepository, fileRepository, calls } = repositories(true)

    await deleteDefect(defectRepository, fileRepository, 1)

    assert.deepEqual(calls, ['files:remove', 'defect:delete'])
  })

  it('throws NotFoundError without touching files when the defect is missing', async () => {
    const { defectRepository, fileRepository, calls } = repositories(false)

    await assert.rejects(
      deleteDefect(defectRepository, fileRepository, 99),
      (error: unknown) => error instanceof NotFoundError,
    )
    assert.deepEqual(calls, [])
  })
})
