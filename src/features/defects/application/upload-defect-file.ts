import { assertValidDefectFile } from '../domain/defect-file-rules'
import { NotFoundError } from '@/lib/errors'
import type { DefectFileRepository } from './defect-file-repository'
import type { DefectRepository } from './defect-repository'
import type { DefectFileStage } from '../domain/defect-file-stage'

export async function uploadDefectFile(
  repository: DefectFileRepository,
  defectRepository: DefectRepository,
  input: { defectId: number; stage: DefectFileStage; file: File },
) {
  assertValidDefectFile(input.file)
  const defect = await defectRepository.findById(input.defectId)
  if (!defect) throw new NotFoundError('Defect tidak ditemukan.')
  return repository.upload(input)
}
