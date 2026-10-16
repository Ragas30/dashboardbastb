import type { DefectFileRepository } from './defect-file-repository'

export async function deleteDefectFile(repository: DefectFileRepository, id: number) {
  await repository.remove(id)
}
