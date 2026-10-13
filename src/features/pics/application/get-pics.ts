import type { PicRepository } from './pic-repository'

export function getPics(repository: PicRepository) {
  return repository.list()
}
