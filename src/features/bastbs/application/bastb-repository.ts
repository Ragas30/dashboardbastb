import type { Bastb, BastbInput } from '../types/bastb-types'

export interface BastbRepository {
  list(search?: string): Promise<Bastb[]>
  listAvailableForDefect(search?: string): Promise<Bastb[]>
  findById(id: number): Promise<Bastb | null>
  create(input: BastbInput): Promise<Bastb>
  update(id: number, input: BastbInput): Promise<Bastb>
}
