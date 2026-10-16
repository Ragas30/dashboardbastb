import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { SupabaseDefectRepository } from '@/features/defects/infrastructure/supabase-defect-repository'
import { InfrastructureError, NotFoundError } from '@/lib/errors'
import { createSupabaseStub, findOperation, type QueryDescriptor } from '../../../support/supabase-stub'

const row = {
  id: 1, project_cluster: 'Cluster A', unit: 'A-01', defect_date: '2026-10-07', total_defect: 5,
  pic_id: 2, target_repair: '2026-10-10', status: 'ON_PROGRESS',
  created_at: '2026-10-07T00:00:00.000Z', updated_at: '2026-10-08T00:00:00.000Z',
  master_pics: { id: 2, name: 'Andi', status: 'ACTIVE' },
} as const

describe('SupabaseDefectRepository', () => {
  it('maps rows and applies default pagination', async () => {
    let descriptor: QueryDescriptor | undefined
    const repository = new SupabaseDefectRepository(createSupabaseStub((value) => {
      descriptor = value
      return { data: [row], count: 1 }
    }))

    const result = await repository.list({})

    assert.equal(result.total, 1)
    assert.equal(result.items.length, 1)
    assert.equal(result.items[0].projectCluster, 'Cluster A')
    assert.equal(result.items[0].totalDefect, 5)
    assert.equal(result.items[0].pic?.name, 'Andi')
    assert.ok(result.items[0].defectDate instanceof Date)
    assert.deepEqual(findOperation(descriptor!, 'range')?.args, [0, 9])
  })

  it('resolves PIC search into an or-filter', async () => {
    let orArgs: unknown[] | undefined
    const repository = new SupabaseDefectRepository(createSupabaseStub((value) => {
      if (value.table === 'master_pics') return { data: [{ id: 2 }], error: null }
      orArgs = findOperation(value, 'or')?.args
      return { data: [], count: 0 }
    }))

    await repository.list({ search: 'Andi' })

    assert.ok(typeof orArgs?.[0] === 'string')
    assert.match(orArgs![0] as string, /project_cluster\.ilike\.%Andi%/)
    assert.match(orArgs![0] as string, /pic_id\.in\.\(2\)/)
  })

  it('accumulates defect totals by status', async () => {
    const rows = [
      { ...row, id: 1, status: 'OPEN', total_defect: 5 },
      { ...row, id: 2, status: 'OPEN', total_defect: 3 },
      { ...row, id: 3, status: 'ON_PROGRESS', total_defect: 7 },
      { ...row, id: 4, status: 'COMPLETED', total_defect: 11 },
    ]
    const repository = new SupabaseDefectRepository(createSupabaseStub(() => ({ data: rows, count: rows.length })))

    assert.deepEqual(await repository.summary({}), { total: 26, open: 8, onProgress: 7, completed: 11 })
  })

  it('throws NotFoundError when updating a missing defect', async () => {
    const repository = new SupabaseDefectRepository(createSupabaseStub(() => ({ data: null })))

    await assert.rejects(
      () => repository.update(99, {
        projectCluster: 'Cluster A', unit: 'A-01', defectDate: new Date('2026-10-07'),
        totalDefect: 5, picId: 2, targetRepair: new Date('2026-10-10'), status: 'OPEN',
      }),
      (error: unknown) => error instanceof NotFoundError,
    )
  })

  it('maps query errors to InfrastructureError', async () => {
    const repository = new SupabaseDefectRepository(createSupabaseStub(() => ({ error: { message: 'boom' } })))

    await assert.rejects(
      () => repository.list({}),
      (error: unknown) => error instanceof InfrastructureError,
    )
  })
})
