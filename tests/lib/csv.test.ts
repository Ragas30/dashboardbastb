import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseCsv, rowsToRecords, serializeCsv } from '@/lib/csv'

describe('csv', () => {
  it('parses quoted fields, escaped quotes, and CRLF', () => {
    const rows = parseCsv('a,"b,1","say ""hi"""\r\nc,d,e\r\n')
    assert.deepEqual(rows, [
      ['a', 'b,1', 'say "hi"'],
      ['c', 'd', 'e'],
    ])
  })

  it('strips a leading BOM and keeps multi-line quoted values', () => {
    const rows = parseCsv('\uFEFFname,note\r\nA,"line1\nline2"')
    assert.deepEqual(rows, [
      ['name', 'note'],
      ['A', 'line1\nline2'],
    ])
  })

  it('round-trips through serialize and parse', () => {
    const source = [
      ['Project / Cluster', 'Unit', 'Total Defect'],
      ['Cluster A', 'A-01,2', '5'],
      ['Cluster "X"', 'X-1', '3'],
    ]
    const parsed = parseCsv(serializeCsv(source))
    assert.deepEqual(parsed, [
      ['Project / Cluster', 'Unit', 'Total Defect'],
      ['Cluster A', 'A-01,2', '5'],
      ['Cluster "X"', 'X-1', '3'],
    ])
  })

  it('maps header rows into records', () => {
    const records = rowsToRecords([
      ['Unit', 'Total'],
      ['A-01', '5'],
      ['A-02', ''],
    ])
    assert.deepEqual(records, [
      { Unit: 'A-01', Total: '5' },
      { Unit: 'A-02', Total: '' },
    ])
  })
})
