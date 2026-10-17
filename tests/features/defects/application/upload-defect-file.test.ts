import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { uploadDefectFile } from '@/features/defects/application/upload-defect-file'
import type { DefectFileRepository } from '@/features/defects/application/defect-file-repository'
import type { DefectRepository } from '@/features/defects/application/defect-repository'
import type { Defect } from '@/features/defects/types/defect-types'
import { NotFoundError } from '@/lib/errors'

const pdf = (name = 'berita-acara.pdf', type = 'application/pdf', size = 12) =>
  new File([new Uint8Array(size)], name, { type })

function fileRepository() {
  let uploaded: { defectId: number; stage: 'BEFORE' | 'AFTER'; file: File } | null = null
  const repository: DefectFileRepository = {
    listByDefect: async () => [],
    upload: async (input) => {
      uploaded = input
      return {
        id: 1, defectId: input.defectId, stage: input.stage, fileName: input.file.name,
        fileSize: input.file.size, createdAt: new Date(), signedUrl: null,
      }
    },
    remove: async () => {},
    removeByDefect: async () => {},
  }
  return { repository, uploaded: () => uploaded }
}

function defectRepository(exists: boolean): DefectRepository {
  const defect = {
    id: 1, projectCluster: 'Cluster A', unit: 'A-01', defectDate: new Date('2026-10-07'),
    totalDefect: 5, picId: 1, targetRepair: new Date('2026-10-10'), status: 'OPEN',
    createdAt: new Date(), updatedAt: new Date(),
  } as Defect
  return {
    list: async () => ({ items: [], total: 0 }),
    findById: async () => (exists ? defect : null),
    findPicById: async () => null,
    findPicByName: async () => null,
    create: async () => defect,
    update: async () => defect,
    delete: async () => {},
    summary: async () => ({ total: 0, open: 0, onProgress: 0, completed: 0 }),
  }
}

describe('uploadDefectFile', () => {
  it('stores a valid PDF for an existing defect', async () => {
    const { repository, uploaded } = fileRepository()

    const result = await uploadDefectFile(repository, defectRepository(true), {
      defectId: 1, stage: 'BEFORE', file: pdf(),
    })

    assert.equal(result.stage, 'BEFORE')
    assert.equal(uploaded()?.defectId, 1)
    assert.equal(uploaded()?.stage, 'BEFORE')
    assert.equal(uploaded()?.file.name, 'berita-acara.pdf')
  })

  it('rejects a non-pdf file before touching the repository', async () => {
    const { repository, uploaded } = fileRepository()

    await assert.rejects(
      uploadDefectFile(repository, defectRepository(true), { defectId: 1, stage: 'AFTER', file: pdf('foto.jpg', 'image/jpeg') }),
      /berformat PDF/,
    )
    assert.equal(uploaded(), null)
  })

  it('throws NotFoundError when the defect is missing', async () => {
    const { repository } = fileRepository()

    await assert.rejects(
      uploadDefectFile(repository, defectRepository(false), { defectId: 99, stage: 'BEFORE', file: pdf() }),
      (error: unknown) => error instanceof NotFoundError,
    )
  })
})
