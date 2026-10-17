import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createDefect } from '@/features/defects/application/create-defect'
import type { DefectRepository } from '@/features/defects/application/defect-repository'
import type { Defect, DefectInput } from '@/features/defects/types/defect-types'

const input: DefectInput = {
  projectCluster: 'Cluster A', unit: 'A-01', defectDate: new Date('2026-10-07'),
  totalDefect: 5, picId: 1, targetRepair: new Date('2026-10-10'), status: 'OPEN',
}

function repository(picStatus: 'ACTIVE' | 'INACTIVE' = 'ACTIVE'): DefectRepository {
  const defect = { ...input, id: 1, createdAt: new Date(), updatedAt: new Date(), pic: { id: 1, name: 'Andi', status: picStatus } } as Defect
  return {
    list: async () => ({ items: [], total: 0 }), findById: async () => null,
    findPicById: async () => ({ id: 1, name: 'Andi', status: picStatus }),
    findPicByName: async () => ({ id: 1, name: 'Andi', status: picStatus }),
    create: async (value) => ({ ...defect, ...value }), update: async () => defect,
    delete: async () => {}, summary: async () => ({ total: 0, open: 0, onProgress: 0, completed: 0 }),
  }
}

describe('createDefect', () => {
  it('rejects a defect whose PIC is inactive', async () => {
    await assert.rejects(createDefect(repository('INACTIVE'), input), /PIC tidak aktif/)
  })
})
