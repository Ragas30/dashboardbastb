import type { DefectFile } from '../types/defect-types'
import type { DefectFileStage } from '../domain/defect-file-stage'

export interface DefectFileRepository {
  listByDefect(defectId: number): Promise<DefectFile[]>
  upload(input: { defectId: number; stage: DefectFileStage; file: File }): Promise<DefectFile>
  remove(id: number): Promise<void>
  removeByDefect(defectId: number): Promise<void>
}
