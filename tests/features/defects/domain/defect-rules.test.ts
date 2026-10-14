import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { assertValidDefectStatus, assertValidDefectTotal } from '@/features/defects/domain/defect-rules'

describe('defect rules', () => {
  it('rejects zero, negative, and fractional totals', () => {
    assert.throws(() => assertValidDefectTotal(0))
    assert.throws(() => assertValidDefectTotal(-1))
    assert.throws(() => assertValidDefectTotal(1.5))
  })

  it('accepts only the three PRD statuses', () => {
    assert.doesNotThrow(() => assertValidDefectStatus('OPEN'))
    assert.doesNotThrow(() => assertValidDefectStatus('ON_PROGRESS'))
    assert.doesNotThrow(() => assertValidDefectStatus('COMPLETED'))
    assert.throws(() => assertValidDefectStatus('CANCELLED'))
  })
})
