/**
 * User roles as defined in RBAC_MATRIX.md and SYSTEM_RULES.md.
 * WORKER and TECHNICIAN can self-select on first login.
 * All other roles must be granted by ADMIN.
 */
export const UserRole = {
  WORKER: "WORKER",
  TECHNICIAN: "TECHNICIAN",
  TEAM_LEADER: "TEAM_LEADER",
  ASSET_MANAGER: "ASSET_MANAGER",
  MAINTENANCE_MANAGER: "MAINTENANCE_MANAGER",
  ADMIN: "ADMIN",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

/**
 * Roles that require ADMIN approval to assign.
 */
export const ADMIN_GRANTED_ROLES: UserRoleType[] = [
  UserRole.TEAM_LEADER,
  UserRole.ASSET_MANAGER,
  UserRole.MAINTENANCE_MANAGER,
];

/**
 * Roles that can perform ticket inspection (RBAC_MATRIX.md §Inspection).
 */
export const INSPECTION_ROLES: UserRoleType[] = [
  UserRole.TEAM_LEADER,
  UserRole.MAINTENANCE_MANAGER,
  UserRole.ADMIN,
];

/**
 * Roles that can assign technicians to tickets.
 */
export const ASSIGNMENT_ROLES: UserRoleType[] = [
  UserRole.TEAM_LEADER,
  UserRole.MAINTENANCE_MANAGER,
  UserRole.ADMIN,
];

/**
 * Roles that can create repair tickets (app.md §3.1).
 */
export const TICKET_CREATE_ROLES: UserRoleType[] = [
  UserRole.WORKER,
  UserRole.TEAM_LEADER,
  UserRole.ASSET_MANAGER,
  UserRole.MAINTENANCE_MANAGER,
  UserRole.ADMIN,
];

/**
 * Roles that can create maintenance schedules (app.md §3.2).
 */
export const SCHEDULE_CREATE_ROLES: UserRoleType[] = [
  UserRole.TEAM_LEADER,
  UserRole.ASSET_MANAGER,
  UserRole.MAINTENANCE_MANAGER,
  UserRole.ADMIN,
];

/**
 * All role values as an array — useful for Mongoose enum validation.
 */
export const ALL_ROLES = Object.values(UserRole) as [
  UserRoleType,
  ...UserRoleType[],
];

export const USER_ROLE_VN_LABELS: Record<UserRoleType, string> = {
  [UserRole.WORKER]: "Công nhân",
  [UserRole.TECHNICIAN]: "Kỹ thuật viên",
  [UserRole.TEAM_LEADER]: "Trưởng nhóm",
  [UserRole.ASSET_MANAGER]: "Quản lý tài sản",
  [UserRole.MAINTENANCE_MANAGER]: "Quản lý bảo trì",
  [UserRole.ADMIN]: "Quản trị viên",
};
