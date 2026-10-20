import type { BastbInput } from '../types/bastb-types'

export function normalizeBastbInput(input: BastbInput): BastbInput {
  return { ...input, cluster: input.cluster.trim(), noUnit: input.noUnit.trim() }
}
