import { z } from 'zod'
import { DEFECT_STATUSES } from '../domain/defect-status'
import { DEFECT_FILE_STAGES } from '../domain/defect-file-stage'

const defectFields = {
  projectCluster: z.string().trim().min(1, 'Project / Cluster wajib diisi.'),
  unit: z.string().trim().min(1, 'Unit wajib diisi.'),
  defectDate: z.coerce.date({ message: 'Tanggal defect tidak valid.' }),
  totalDefect: z.coerce.number().int().min(1, 'Total defect minimal 1.'),
  picId: z.coerce.number().int().positive('PIC wajib dipilih.'),
  targetRepair: z.coerce.date({ message: 'Target repair tidak valid.' }),
  status: z.enum(DEFECT_STATUSES),
}

export const createDefectSchema = z.object(defectFields)
export const updateDefectSchema = createDefectSchema.extend({ id: z.coerce.number().int().positive() })
export const updateDefectStatusSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(DEFECT_STATUSES),
})
export const defectFileStageSchema = z.enum(DEFECT_FILE_STAGES)
export const uploadDefectFileSchema = z.object({
  defectId: z.coerce.number().int().positive('ID defect tidak valid.'),
  stage: defectFileStageSchema,
})
export type CreateDefectInput = z.infer<typeof createDefectSchema>
export type UpdateDefectInput = z.infer<typeof updateDefectSchema>
export type UpdateDefectStatusInput = z.infer<typeof updateDefectStatusSchema>
export type UploadDefectFileInput = z.infer<typeof uploadDefectFileSchema>
