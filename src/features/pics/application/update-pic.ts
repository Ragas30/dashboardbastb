import { NotFoundError } from '@/lib/errors'
import { updatePicSchema, type UpdatePicInput } from '../schemas/pic-schema'
import type { PicRepository } from './pic-repository'

export async function updatePic(repository: PicRepository, input: UpdatePicInput) {
  const parsed = updatePicSchema.parse(input)
  if (!await repository.findById(parsed.id)) throw new NotFoundError('PIC tidak ditemukan.')
  return repository.update(parsed.id, { name: parsed.name, status: parsed.status })
}
