import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeBastbInput } from '@/features/bastbs/domain/bastb-rules'

test('normalizes BASTB text fields', () => {
  assert.deepEqual(normalizeBastbInput({ cluster: ' Cluster A ', noUnit: ' A-01 ', bastbDate: new Date('2026-10-20') }), {
    cluster: 'Cluster A', noUnit: 'A-01', bastbDate: new Date('2026-10-20'),
  })
})
