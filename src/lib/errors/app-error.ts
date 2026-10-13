export abstract class AppError extends Error {
  abstract readonly code: string
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace?.(this, this.constructor)
    if (cause !== undefined) (this as any).cause = cause
  }
}

