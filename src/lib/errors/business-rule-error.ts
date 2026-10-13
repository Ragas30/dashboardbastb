import { AppError } from './app-error'
export class BusinessRuleError extends AppError {
  readonly code = 'BUSINESS_RULE_ERROR'
  constructor(message: string, cause?: unknown) {
    super(message, cause)
  }
}

