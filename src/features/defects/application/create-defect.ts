import { createDefectSchema, type CreateDefectInput } from '../schemas/defect-schema'
import { assertValidDefectTotal } from '../domain/defect-rules'
import type { DefectRepository } from './defect-repository'

export async function createDefect(repository: DefectRepository, input: CreateDefectInput) {
  const parsed = createDefectSchema.parse(input)
  assertValidDefectTotal(parsed.totalDefect)
  return repository.create(parsed)
}
