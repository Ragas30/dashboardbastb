import { AppError } from './app-error'
export class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND'
  constructor(message: string, cause?: unknown) {
    super(message, cause)
  }
}

