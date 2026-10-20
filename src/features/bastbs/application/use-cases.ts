import { normalizeBastbInput } from '../domain/bastb-rules'
import type { BastbRepository } from './bastb-repository'
import type { BastbInput } from '../types/bastb-types'

export const getBastbs = (repository: BastbRepository, search?: string) => repository.list(search)
export const getAvailableBastbsForDefect = (repository: BastbRepository, search?: string) => repository.listAvailableForDefect(search)
export const createBastb = (repository: BastbRepository, input: BastbInput) => repository.create(normalizeBastbInput(input))
export const updateBastb = (repository: BastbRepository, id: number, input: BastbInput) => repository.update(id, normalizeBastbInput(input))
