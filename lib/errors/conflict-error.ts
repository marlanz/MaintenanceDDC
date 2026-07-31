import { AppError } from "./app-error";

export class ConflictError extends AppError {
  constructor(
    message: string,
    code = "CONFLICT_VIOLATION",
    details?: Record<string, unknown> | unknown[],
  ) {
    super(message, 409, code, details);
  }
}
