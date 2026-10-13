import { AppError } from './app-error'
export class InfrastructureError extends AppError {
  readonly code = 'INFRASTRUCTURE_ERROR'
  constructor(message: string, cause?: unknown) {
    super(message, cause)
  }
}

