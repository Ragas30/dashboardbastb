import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseDashboardDefectFilters } from '@/features/defects/application/parse-dashboard-filters'

describe('parseDashboardDefectFilters', () => {
  it('does not include empty date filters', () => {
    const filters = parseDashboardDefectFilters({ defectDateFrom: '', defectDateTo: '' })

    assert.equal(filters.defectDateFrom, undefined)
    assert.equal(filters.defectDateTo, undefined)
  })

  it('includes only valid date filters', () => {
    const filters = parseDashboardDefectFilters({ defectDateFrom: '2026-10-07', defectDateTo: 'not-a-date' })

    assert.equal(filters.defectDateFrom?.toISOString(), '2026-10-07T00:00:00.000Z')
    assert.equal(filters.defectDateTo, undefined)
  })
})
