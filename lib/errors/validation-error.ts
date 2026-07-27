import { AppError } from "./app-error";

export class ValidationError extends AppError {
  constructor(
    message = "Validation failed. Please check your inputs.",
    details?: Record<string, unknown> | unknown[],
    code = "VALIDATION_ERROR"
  ) {
    super(message, 400, code, details);
  }
}
