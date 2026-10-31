import type { Defect } from '../types/defect-types'

export function sortDefects(items: Defect[], sort = '', direction: 1 | -1 = 1): Defect[] {
  if (!sort) return items

  return items.sort((a, b) => {
    if (sort === 'projectCluster') return a.projectCluster.localeCompare(b.projectCluster) * direction
    if (sort === 'unit') return a.unit.localeCompare(b.unit) * direction
    if (sort === 'totalDefect') return (a.totalDefect - b.totalDefect) * direction
    if (sort === 'status') return a.status.localeCompare(b.status) * direction
    if (sort === 'targetRepair') return ((a.targetRepair?.getTime() ?? Number.MAX_SAFE_INTEGER) - (b.targetRepair?.getTime() ?? Number.MAX_SAFE_INTEGER)) * direction
    if (sort === 'updatedAt') return (a.updatedAt.getTime() - b.updatedAt.getTime()) * direction
    return 0
  })
}
