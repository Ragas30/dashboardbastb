import { NotFoundError } from '@/lib/errors'
import type { DefectRepository } from './defect-repository'

export async function getDefectById(repository: DefectRepository, id: number) {
  const defect = await repository.findById(id)
  if (!defect) throw new NotFoundError('Defect tidak ditemukan.')
  return defect
}
