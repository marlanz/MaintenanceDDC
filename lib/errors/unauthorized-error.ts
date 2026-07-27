import { AppError } from "./app-error";

export class UnauthorizedError extends AppError {
  constructor(
    message = "Authentication required. Please sign in to continue.",
    code = "UNAUTHORIZED"
  ) {
    super(message, 401, code);
  }
}
