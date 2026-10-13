import type { Pic, PicInput } from '../types/pic-types'

export interface PicRepository {
  list(): Promise<Pic[]>
  findById(id: number): Promise<Pic | null>
  create(input: PicInput): Promise<Pic>
  update(id: number, input: PicInput): Promise<Pic>
}
