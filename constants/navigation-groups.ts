import { UserRole, UserRoleType, ALL_ROLES } from "./roles";

/**
 * Role groups to assign navigation access permissions.
 * Avoids role array duplication.
 */

export const OPERATOR_ROLES: UserRoleType[] = [
  UserRole.WORKER,
  UserRole.TECHNICIAN,
];

export const MANAGEMENT_ROLES: UserRoleType[] = [
  UserRole.TEAM_LEADER,
  UserRole.MAINTENANCE_MANAGER,
  UserRole.ASSET_MANAGER,
];

export const ADMIN_ROLES: UserRoleType[] = [
  UserRole.ADMIN,
];

export const AUTHORIZED_ROLES: UserRoleType[] = [...ALL_ROLES];
