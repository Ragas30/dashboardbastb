import type { PicStatus } from '../domain/pic-status'

export type Pic = {
  id: number
  name: string
  status: PicStatus
  createdAt: Date
  updatedAt: Date
}

export type PicInput = { name: string; status: PicStatus }
