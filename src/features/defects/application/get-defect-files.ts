import type { DefectFileRepository } from './defect-file-repository'

export function getDefectFiles(repository: DefectFileRepository, defectId: number) {
  return repository.listByDefect(defectId)
}
