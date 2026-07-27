import { requireUser } from "./require-user";
import { authorize } from "@/lib/permissions";
import type { PermissionActionType } from "@/constants/permissions";
import type { CurrentAuthUser } from "@/types/auth.types";
import type { ResourceDescriptor } from "@/types/permission.types";

/**
 * Orchestrates user authentication assertion and RBAC permission evaluation.
 * Throws UnauthorizedError if unauthenticated or ForbiddenError if permission check fails.
 */
export async function requirePermission(
  action: PermissionActionType,
  resource?: ResourceDescriptor
): Promise<CurrentAuthUser> {
  const user = await requireUser();
  authorize(user, action, resource);
  return user;
}
