import { AppError } from './app-error'
export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR'
  constructor(message: string, public readonly issues?: unknown, cause?: unknown) {
    super(message, cause)
  }
}

