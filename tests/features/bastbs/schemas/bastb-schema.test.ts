import test from 'node:test'
import assert from 'node:assert/strict'
import { createBastbSchema } from '@/features/bastbs/schemas/bastb-schema'

test('accepts a valid BASTB input', () => {
  const result = createBastbSchema.safeParse({ cluster: 'Cluster A', noUnit: 'A-01', bastbDate: '2026-10-20' })
  assert.equal(result.success, true)
})

test('rejects empty BASTB fields', () => {
  const result = createBastbSchema.safeParse({ cluster: '', noUnit: '', bastbDate: '' })
  assert.equal(result.success, false)
})
