import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { formatDefectDate, normalizeDefectDate, normalizeDefectStatus } from '@/features/defects/domain/defect-import-rules'

describe('defect import rules', () => {
  it('normalizes status aliases', () => {
    assert.equal(normalizeDefectStatus('Open'), 'OPEN')
    assert.equal(normalizeDefectStatus('on progress'), 'ON_PROGRESS')
    assert.equal(normalizeDefectStatus('ON_PROGRESS'), 'ON_PROGRESS')
    assert.equal(normalizeDefectStatus('Done'), 'COMPLETED')
    assert.equal(normalizeDefectStatus('Selesai'), 'COMPLETED')
    assert.equal(normalizeDefectStatus('unknown'), null)
  })

  it('normalizes supported date formats to UTC midnight', () => {
    assert.equal(formatDefectDate(normalizeDefectDate('2026-10-07')!), '2026-10-07')
    assert.equal(formatDefectDate(normalizeDefectDate('07/10/2026')!), '2026-10-07')
    assert.equal(formatDefectDate(normalizeDefectDate('7-10-2026')!), '2026-10-07')
  })

  it('rejects invalid dates', () => {
    assert.equal(normalizeDefectDate('2026-13-01'), null)
    assert.equal(normalizeDefectDate('31/02/2026'), null)
    assert.equal(normalizeDefectDate('not-a-date'), null)
  })
})
