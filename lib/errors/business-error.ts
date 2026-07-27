import { AppError } from "./app-error";

export class BusinessError extends AppError {
  constructor(
    message: string,
    code = "BUSINESS_RULE_VIOLATION",
    details?: Record<string, unknown> | unknown[]
  ) {
    super(message, 422, code, details);
  }
}
