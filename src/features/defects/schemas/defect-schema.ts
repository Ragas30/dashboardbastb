import { z } from 'zod'
import { DEFECT_STATUSES } from '../domain/defect-status'
import { DEFECT_FILE_STAGES } from '../domain/defect-file-stage'

const defectFields = {
  bastbId: z.coerce.number().int().positive('BASTB wajib dipilih.').optional(),
  projectCluster: z.string().trim().min(1, 'Project / Cluster wajib diisi.'),
  unit: z.string().trim().min(1, 'Unit wajib diisi.'),
  defectDate: z.coerce.date({ message: 'Tanggal defect tidak valid.' }),
  totalDefect: z.preprocess(
    (value) => {
      if (value === '' || value == null) return undefined
      const number = Number(value)
      return Number.isNaN(number) ? undefined : number
    },
    z.number({ message: 'Total defect wajib diisi dan harus berupa angka.' })
      .int('Total defect harus berupa angka bulat.')
      .min(1, 'Total defect minimal 1.'),
  ),
  picId: z.coerce.number().int().positive('PIC wajib dipilih.'),
  targetRepair: z.preprocess((value) => value === '' || value == null ? undefined : value, z.coerce.date({ message: 'Target repair tidak valid.' }).optional()),
  description: z.string().trim().max(1000, 'Keterangan maksimal 1000 karakter.').optional(),
  status: z.enum(DEFECT_STATUSES),
}

export const createDefectSchema = z.object(defectFields)
export const updateDefectSchema = createDefectSchema.extend({ id: z.coerce.number({ message: 'ID defect tidak valid.' }).int().positive('ID defect tidak valid.') })
export const updateDefectStatusSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(DEFECT_STATUSES),
})
export const defectFileStageSchema = z.enum(DEFECT_FILE_STAGES)
export const uploadDefectFileSchema = z.object({
  defectId: z.coerce.number().int().positive('ID defect tidak valid.'),
  stage: defectFileStageSchema,
})
export const defectImportRowSchema = z.object({
  projectCluster: z.string().trim().min(1, 'Project / Cluster wajib diisi.'),
  unit: z.string().trim().min(1, 'Unit wajib diisi.'),
  defectDate: z.date({ message: 'Tanggal defect tidak valid.' }),
  totalDefect: z.preprocess(
    (value) => {
      if (value === '' || value == null) return undefined
      const number = Number(value)
      return Number.isNaN(number) ? undefined : number
    },
    z.number({ message: 'Total defect wajib diisi dan harus berupa angka.' })
      .int('Total defect harus berupa angka bulat.')
      .min(1, 'Total defect minimal 1.'),
  ),
  picName: z.string().trim().min(1, 'PIC wajib diisi.'),
  targetRepair: z.preprocess((value) => value === '' || value == null ? undefined : value, z.coerce.date({ message: 'Target repair tidak valid.' }).optional()),
  status: z.enum(DEFECT_STATUSES),
})
export type CreateDefectInput = z.infer<typeof createDefectSchema>
export type UpdateDefectInput = z.infer<typeof updateDefectSchema>
export type UpdateDefectStatusInput = z.infer<typeof updateDefectStatusSchema>
export type UploadDefectFileInput = z.infer<typeof uploadDefectFileSchema>
export type DefectImportRowInput = z.infer<typeof defectImportRowSchema>
