import { can } from "./can";
import { ForbiddenError } from "@/lib/errors";
import type { PermissionActionType } from "@/constants/permissions";
import type { CurrentAuthUser } from "@/types/auth.types";
import type { ResourceDescriptor } from "@/types/permission.types";

/**
 * Asserts that the current user has permission to perform an action on a resource.
 * Throws a typed `ForbiddenError` if permission check fails.
 */
export function authorize(
  user: CurrentAuthUser,
  action: PermissionActionType,
  resource?: ResourceDescriptor,
  customErrorMessage?: string
): void {
  const allowed = can(user, action, resource);
  if (!allowed) {
    throw new ForbiddenError(
      customErrorMessage ||
        `Permission denied for action "${action}" on resource "${resource?.type || "unspecified"}".`
    );
  }
}
