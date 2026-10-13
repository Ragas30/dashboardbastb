import { z } from 'zod'
import { PIC_STATUSES } from '../domain/pic-status'

export const createPicSchema = z.object({
  name: z.string().trim().min(1, 'Nama PIC wajib diisi.'),
  status: z.enum(PIC_STATUSES),
})

export const updatePicSchema = createPicSchema.extend({ id: z.coerce.number().int().positive() })
export type CreatePicInput = z.infer<typeof createPicSchema>
export type UpdatePicInput = z.infer<typeof updatePicSchema>
