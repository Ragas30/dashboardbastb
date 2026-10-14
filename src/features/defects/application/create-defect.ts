import { createDefectSchema, type CreateDefectInput } from '../schemas/defect-schema'
import { assertValidDefectTotal } from '../domain/defect-rules'
import { BusinessRuleError, NotFoundError } from '@/lib/errors'
import type { DefectRepository } from './defect-repository'

export async function createDefect(repository: DefectRepository, input: CreateDefectInput) {
  const parsed = createDefectSchema.parse(input)
  assertValidDefectTotal(parsed.totalDefect)
  const pic = await repository.findPicById(parsed.picId)
  if (!pic) throw new NotFoundError('PIC tidak ditemukan.')
  if (pic.status !== 'ACTIVE') throw new BusinessRuleError('PIC tidak aktif.')
  return repository.create(parsed)
}
