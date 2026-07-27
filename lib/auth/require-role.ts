import { requireUser } from "./require-user";
import { ForbiddenError } from "@/lib/errors";
import { UserRole, type UserRoleType } from "@/constants/roles";
import type { CurrentAuthUser } from "@/types/auth.types";

/**
 * Asserts that the authenticated user possesses one of the allowed roles.
 * ADMIN role always satisfies any role requirement.
 * Throws ForbiddenError if user role is not allowed.
 */
export async function requireRole(
  allowedRoles: UserRoleType[]
): Promise<CurrentAuthUser> {
  const user = await requireUser();

  if (user.role === UserRole.ADMIN) {
    return user;
  }

  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError(
      `Access denied. Requires one of the following roles: ${allowedRoles.join(", ")}.`
    );
  }

  return user;
}
