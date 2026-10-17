import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { importDefects } from '@/features/defects/application/import-defects'
import type { DefectRepository } from '@/features/defects/application/defect-repository'
import type { Defect, DefectInput } from '@/features/defects/types/defect-types'

const HEADER: Record<string, string> = {
  'Project / Cluster': 'Cluster A',
  Unit: 'A-01',
  Tanggal: '2026-10-07',
  'Total Defect': '5',
  PIC: 'Andi',
  'Target Repair': '2026-10-10',
  Status: 'Open',
}

function repository(pics: Record<string, 'ACTIVE' | 'INACTIVE'> = { Andi: 'ACTIVE' }) {
  const created: DefectInput[] = []
  const repo: DefectRepository = {
    list: async () => ({ items: [], total: 0 }),
    findById: async () => null,
    findPicById: async () => null,
    findPicByName: async (name) => {
      const status = pics[name]
      return status ? { id: Object.keys(pics).indexOf(name) + 1, name, status } : null
    },
    create: async (input) => {
      created.push(input)
      return { id: created.length, createdAt: new Date(), updatedAt: new Date(), ...input } as Defect
    },
    update: async () => {
      throw new Error('unused')
    },
    delete: async () => {},
    summary: async () => ({ total: 0, open: 0, onProgress: 0, completed: 0 }),
  }
  return { repo, created }
}

describe('importDefects', () => {
  it('creates one defect per valid row', async () => {
    const { repo, created } = repository()
    const result = await importDefects(repo, [
      { ...HEADER },
      { ...HEADER, Unit: 'A-02', 'Total Defect': '3', Status: 'On Progress' },
    ])
    assert.deepEqual(result, { created: 2, errors: [] })
    assert.equal(created.length, 2)
    assert.equal(created[0].picId, 1)
    assert.equal(created[1].status, 'ON_PROGRESS')
    assert.equal(created[1].unit, 'A-02')
  })

  it('reports invalid rows and skips empty rows', async () => {
    const { repo, created } = repository()
    const result = await importDefects(repo, [
      { ...HEADER, 'Total Defect': '0' },
      { 'Project / Cluster': '', Unit: '', Tanggal: '', 'Total Defect': '', PIC: '', 'Target Repair': '', Status: '' },
      { ...HEADER, Status: 'unknown' },
    ])
    assert.equal(result.created, 0)
    assert.equal(created.length, 0)
    assert.deepEqual(result.errors.map((error) => error.row), [2, 4])
  })

  it('reports missing and inactive PIC', async () => {
    const { repo } = repository({ Andi: 'INACTIVE' })
    const result = await importDefects(repo, [
      { ...HEADER, PIC: 'Budi' },
      { ...HEADER },
    ])
    assert.equal(result.created, 0)
    assert.match(result.errors[0].message, /tidak ditemukan/)
    assert.match(result.errors[1].message, /tidak aktif/)
  })

  it('accepts header aliases and dd/mm/yyyy dates', async () => {
    const { repo, created } = repository()
    const result = await importDefects(repo, [
      { project: 'Cluster B', UNIT: 'B-1', tanggal: '07/10/2026', total: '2', 'nama pic': 'Andi', 'target repair': '10/10/2026', status: 'completed' },
    ])
    assert.deepEqual(result.errors, [])
    assert.equal(result.created, 1)
    assert.equal(created[0].projectCluster, 'Cluster B')
    assert.equal(created[0].defectDate.toISOString().slice(0, 10), '2026-10-07')
    assert.equal(created[0].status, 'COMPLETED')
  })
})
