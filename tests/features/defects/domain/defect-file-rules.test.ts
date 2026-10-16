import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { assertValidDefectFile, isPdfFile, MAX_DEFECT_FILE_BYTES } from '@/features/defects/domain/defect-file-rules'
import { BusinessRuleError } from '@/lib/errors'

describe('defect file rules', () => {
  it('accepts a PDF by mime type or extension', () => {
    assert.equal(isPdfFile({ name: 'berita-acara.pdf', type: 'application/pdf' }), true)
    assert.equal(isPdfFile({ name: 'scan.PDF', type: 'application/octet-stream' }), true)
    assert.equal(isPdfFile({ name: 'foto.jpg', type: 'image/jpeg' }), false)
  })

  it('rejects non-pdf files', () => {
    assert.throws(
      () => assertValidDefectFile({ name: 'foto.jpg', type: 'image/jpeg', size: 1024 }),
      (error: unknown) => error instanceof BusinessRuleError,
    )
  })

  it('rejects empty and oversized files', () => {
    assert.throws(() => assertValidDefectFile({ name: 'a.pdf', type: 'application/pdf', size: 0 }), /tidak valid/)
    assert.throws(
      () => assertValidDefectFile({ name: 'a.pdf', type: 'application/pdf', size: MAX_DEFECT_FILE_BYTES + 1 }),
      /maksimal 5 MB/,
    )
  })
})
