import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { SupabasePicRepository } from '@/features/pics/infrastructure/supabase-pic-repository'
import { InfrastructureError, NotFoundError } from '@/lib/errors'
import { createSupabaseStub, findOperation, type QueryDescriptor } from '../../../support/supabase-stub'

const row = { id: 1, name: 'Andi', status: 'ACTIVE', created_at: '2026-10-07T00:00:00.000Z', updated_at: '2026-10-08T00:00:00.000Z' } as const

describe('SupabasePicRepository', () => {
  it('maps PIC rows ordered by name', async () => {
    let descriptor: QueryDescriptor | undefined
    const repository = new SupabasePicRepository(createSupabaseStub((value) => {
      descriptor = value
      return { data: [row] }
    }))

    const pics = await repository.list()

    assert.equal(pics.length, 1)
    assert.equal(pics[0].name, 'Andi')
    assert.equal(pics[0].status, 'ACTIVE')
    assert.ok(pics[0].createdAt instanceof Date)
    assert.deepEqual(findOperation(descriptor!, 'order')?.args, ['name'])
  })

  it('maps create results back to a PIC DTO', async () => {
    const repository = new SupabasePicRepository(createSupabaseStub(() => ({ data: { ...row, name: 'Budi' } })))

    const pic = await repository.create({ name: 'Budi', status: 'ACTIVE' })

    assert.equal(pic.name, 'Budi')
    assert.equal(pic.status, 'ACTIVE')
  })

  it('throws NotFoundError when updating a missing PIC', async () => {
    const repository = new SupabasePicRepository(createSupabaseStub(() => ({ data: null })))

    await assert.rejects(
      () => repository.update(9, { name: 'Budi', status: 'INACTIVE' }),
      (error: unknown) => error instanceof NotFoundError,
    )
  })

  it('maps query errors to InfrastructureError', async () => {
    const repository = new SupabasePicRepository(createSupabaseStub(() => ({ error: { message: 'boom' } })))

    await assert.rejects(
      () => repository.list(),
      (error: unknown) => error instanceof InfrastructureError,
    )
  })
})
