import { NotFoundError } from '@/lib/errors'
import type { DefectRepository } from './defect-repository'
import type { DefectFileRepository } from './defect-file-repository'

export async function deleteDefect(repository: DefectRepository, fileRepository: DefectFileRepository, id: number) {
  const defect = await repository.findById(id)
  if (!defect) throw new NotFoundError('Defect tidak ditemukan.')
  await fileRepository.removeByDefect(id)
  await repository.delete(id)
}
