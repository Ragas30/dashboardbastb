import { BusinessRuleError, NotFoundError } from '@/lib/errors'
import { updateDefectSchema, type UpdateDefectInput } from '../schemas/defect-schema'
import { assertValidDefectTotal } from '../domain/defect-rules'
import type { DefectRepository } from './defect-repository'

export async function updateDefect(repository: DefectRepository, input: UpdateDefectInput) {
  const parsed = updateDefectSchema.parse(input)
  if (!await repository.findById(parsed.id)) throw new NotFoundError('Defect tidak ditemukan.')
  assertValidDefectTotal(parsed.totalDefect)
  const pic = await repository.findPicById(parsed.picId)
  if (!pic) throw new NotFoundError('PIC tidak ditemukan.')
  if (pic.status !== 'ACTIVE') throw new BusinessRuleError('PIC tidak aktif.')
  const { id, ...data } = parsed
  return repository.update(id, data)
}
