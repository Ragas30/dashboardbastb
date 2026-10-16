import { NotFoundError } from '@/lib/errors'
import { updateDefectStatusSchema, type UpdateDefectStatusInput } from '../schemas/defect-schema'
import type { DefectRepository } from './defect-repository'

export async function updateDefectStatus(repository: DefectRepository, input: UpdateDefectStatusInput) {
  const parsed = updateDefectStatusSchema.parse(input)
  const defect = await repository.findById(parsed.id)
  if (!defect) throw new NotFoundError('Defect tidak ditemukan.')
  return repository.update(parsed.id, {
    projectCluster: defect.projectCluster,
    unit: defect.unit,
    defectDate: defect.defectDate,
    totalDefect: defect.totalDefect,
    picId: defect.picId,
    targetRepair: defect.targetRepair,
    status: parsed.status,
  })
}
