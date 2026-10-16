import { MAX_DEFECT_FILE_BYTES } from '../domain/defect-file-rules'

export async function compressDefectPdf(file: File): Promise<File> {
  if (file.size <= MAX_DEFECT_FILE_BYTES) return file
  return file
}
