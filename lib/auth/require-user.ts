import { getCurrentUser } from "./get-current-user";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";
import type { CurrentAuthUser } from "@/types/auth.types";

/**
 * Asserts that a user is authenticated and active.
 * Throws UnauthorizedError if unauthenticated, or ForbiddenError if account is inactive.
 */
export async function requireUser(): Promise<CurrentAuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError("Authentication required. Please sign in to continue.");
  }

  if (!user.isActive) {
    throw new ForbiddenError("Your account has been deactivated. Please contact an administrator.");
  }

  return user;
}
