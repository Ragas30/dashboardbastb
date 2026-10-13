import { BusinessRuleError } from '@/lib/errors'
import type { DefectStatus } from './defect-status'

export function assertValidDefectTotal(totalDefect: number): void {
  if (!Number.isInteger(totalDefect) || totalDefect < 1) {
    throw new BusinessRuleError('Total defect harus berupa angka bulat minimal 1.')
  }
}

export function assertValidDefectStatus(status: string): asserts status is DefectStatus {
  if (!['OPEN', 'ON_PROGRESS', 'COMPLETED'].includes(status)) {
    throw new BusinessRuleError('Status defect tidak valid.')
  }
}
