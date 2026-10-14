import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createPic } from '@/features/pics/application/create-pic'
import type { PicRepository } from '@/features/pics/application/pic-repository'

describe('createPic', () => {
  it('trims the PIC name before persisting', async () => {
    const repository = { create: async (input: { name: string; status: 'ACTIVE' | 'INACTIVE' }) => input } as PicRepository
    assert.deepEqual(await createPic(repository, { name: '  Andi  ', status: 'ACTIVE' }), { name: 'Andi', status: 'ACTIVE' })
  })
})
