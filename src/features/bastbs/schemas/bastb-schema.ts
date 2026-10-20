import { z } from 'zod'

const fields = {
  cluster: z.string().trim().min(1, 'Cluster wajib diisi.'),
  noUnit: z.string().trim().min(1, 'No unit wajib diisi.'),
  bastbDate: z.coerce.date({ message: 'Tanggal BASTB tidak valid.' }),
}

export const createBastbSchema = z.object(fields)
export const updateBastbSchema = createBastbSchema.extend({ id: z.coerce.number().int().positive() })
export type CreateBastbInput = z.infer<typeof createBastbSchema>
export type UpdateBastbInput = z.infer<typeof updateBastbSchema>
