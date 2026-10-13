import { createPicSchema, type CreatePicInput } from '../schemas/pic-schema'
import type { PicRepository } from './pic-repository'

export async function createPic(repository: PicRepository, input: CreatePicInput) {
  return repository.create(createPicSchema.parse(input))
}
