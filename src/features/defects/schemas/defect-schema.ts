import { z } from 'zod'
import { DEFECT_STATUSES } from '../domain/defect-status'

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
export type CreateDefectInput = z.infer<typeof createDefectSchema>
export type UpdateDefectInput = z.infer<typeof updateDefectSchema>
