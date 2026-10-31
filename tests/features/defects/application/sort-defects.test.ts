import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { sortDefects } from '@/features/defects/application/sort-defects'
import type { Defect } from '@/features/defects/types/defect-types'

const defect = (id: number, updatedAt: string): Defect => ({
  id,
  projectCluster: 'Cluster A',
  unit: `A-${id}`,
  defectDate: new Date('2026-10-07'),
  totalDefect: 1,
  picId: 1,
  targetRepair: undefined,
  status: 'OPEN',
  createdAt: new Date(updatedAt),
  updatedAt: new Date(updatedAt),
})

describe('sortDefects', () => {
  it('preserves repository order when no column sort is selected', () => {
    const newest = defect(1, '2026-10-31T00:00:00.000Z')
    const oldest = defect(2, '2026-10-20T00:00:00.000Z')

    assert.deepEqual(sortDefects([newest, oldest]), [newest, oldest])
  })
})
