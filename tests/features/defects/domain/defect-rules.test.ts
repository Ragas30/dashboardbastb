import { describe, expect, it } from 'vitest'
import { assertValidDefectStatus, assertValidDefectTotal } from '@/features/defects/domain/defect-rules'

describe('defect rules', () => {
  it('rejects zero, negative, and fractional totals', () => {
    expect(() => assertValidDefectTotal(0)).toThrow()
    expect(() => assertValidDefectTotal(-1)).toThrow()
    expect(() => assertValidDefectTotal(1.5)).toThrow()
  })

  it('accepts only the three PRD statuses', () => {
    expect(() => assertValidDefectStatus('OPEN')).not.toThrow()
    expect(() => assertValidDefectStatus('ON_PROGRESS')).not.toThrow()
    expect(() => assertValidDefectStatus('COMPLETED')).not.toThrow()
    expect(() => assertValidDefectStatus('CANCELLED')).toThrow()
  })
})
