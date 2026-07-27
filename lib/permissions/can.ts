import { UserRole, type UserRoleType } from "@/constants/roles";
import { PermissionAction, type PermissionActionType } from "@/constants/permissions";
import type { CurrentAuthUser } from "@/types/auth.types";
import type { ResourceDescriptor } from "@/types/permission.types";

function hasRole(userRole: UserRoleType, allowedRoles: readonly UserRoleType[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Authorization evaluation function.
 * Validates role permissions, resource ownership, workshop scope, and team scope
 * according to the exact rules in RBAC_MATRIX.md.
 */
export function can(
  user: CurrentAuthUser,
  action: PermissionActionType,
  resource?: ResourceDescriptor
): boolean {
  if (!user || !user.isActive) {
    return false;
  }

  // System Administrator has unrestricted access across all resources
  if (user.role === UserRole.ADMIN) {
    return true;
  }

  const role = user.role;

  switch (action) {
    // ------------------------------------------------------------------------
    // REPAIR TICKET ACTIONS
    // ------------------------------------------------------------------------
    case PermissionAction.TICKET_CREATE:
      return hasRole(role, [
        UserRole.WORKER,
        UserRole.TEAM_LEADER,
        UserRole.ASSET_MANAGER,
        UserRole.MAINTENANCE_MANAGER,
      ]);

    case PermissionAction.TICKET_READ_OWN:
      if (!resource?.ownerId) return true;
      return resource.ownerId === user.profileId;

    case PermissionAction.TICKET_READ_ASSIGNED:
      if (role === UserRole.WORKER) return false;
      if (role === UserRole.TECHNICIAN) {
        if (!resource?.assignedTechnicianIds) return true;
        return resource.assignedTechnicianIds.includes(user.profileId);
      }
      return true;

    case PermissionAction.TICKET_READ_ALL:
      if (hasRole(role, [UserRole.WORKER, UserRole.TECHNICIAN])) {
        return false;
      }
      if (role === UserRole.TEAM_LEADER) {
        if (!resource?.teamId) return true;
        return resource.teamId === user.teamId;
      }
      if (resource?.workshopId && hasRole(role, [UserRole.ASSET_MANAGER, UserRole.MAINTENANCE_MANAGER])) {
        return resource.workshopId === user.workshopId;
      }
      return true;

    case PermissionAction.TICKET_EDIT_BEFORE_ASSIGN:
    case PermissionAction.TICKET_CANCEL_PENDING:
      if (!resource) return true;
      if (resource.ownerId && resource.ownerId !== user.profileId) return false;
      if (resource.status && resource.status !== "PENDING") return false;
      return hasRole(role, [
        UserRole.WORKER,
        UserRole.TEAM_LEADER,
        UserRole.ASSET_MANAGER,
        UserRole.MAINTENANCE_MANAGER,
      ]);

    case PermissionAction.TICKET_ASSIGN_TECHNICIAN:
    case PermissionAction.TICKET_CHANGE_PRIORITY:
    case PermissionAction.TICKET_CLOSE:
      if (hasRole(role, [UserRole.WORKER, UserRole.TECHNICIAN, UserRole.ASSET_MANAGER])) {
        return false;
      }
      if (role === UserRole.TEAM_LEADER && resource?.teamId) {
        return resource.teamId === user.teamId;
      }
      return true;

    case PermissionAction.TICKET_CHANGE_STATUS:
      if (role === UserRole.WORKER || role === UserRole.ASSET_MANAGER) return false;
      if (role === UserRole.TECHNICIAN) {
        if (!resource?.assignedTechnicianIds) return true;
        return resource.assignedTechnicianIds.includes(user.profileId);
      }
      if (role === UserRole.TEAM_LEADER && resource?.teamId) {
        return resource.teamId === user.teamId;
      }
      return true;

    // ------------------------------------------------------------------------
    // TECHNICIAN WORKFLOW ACTIONS
    // ------------------------------------------------------------------------
    case PermissionAction.TICKET_ACCEPT:
    case PermissionAction.TICKET_START_MAINTENANCE:
    case PermissionAction.TICKET_UPDATE_PROGRESS:
    case PermissionAction.TICKET_SUBMIT_REPORT:
      if (role !== UserRole.TECHNICIAN && role !== UserRole.MAINTENANCE_MANAGER) {
        return false;
      }
      if (resource?.assignedTechnicianIds) {
        return resource.assignedTechnicianIds.includes(user.profileId);
      }
      return true;

    // ------------------------------------------------------------------------
    // INSPECTION ACTIONS
    // ------------------------------------------------------------------------
    case PermissionAction.INSPECTION_PERFORM:
    case PermissionAction.INSPECTION_APPROVE:
    case PermissionAction.INSPECTION_REJECT:
      if (!hasRole(role, [UserRole.TEAM_LEADER, UserRole.MAINTENANCE_MANAGER])) {
        return false;
      }
      if (role === UserRole.TEAM_LEADER && resource?.teamId) {
        return resource.teamId === user.teamId;
      }
      return true;

    // ------------------------------------------------------------------------
    // MACHINE MANAGEMENT
    // ------------------------------------------------------------------------
    case PermissionAction.MACHINE_READ:
      return true;

    case PermissionAction.MACHINE_CREATE:
    case PermissionAction.MACHINE_UPDATE:
    case PermissionAction.MACHINE_DELETE:
      return hasRole(role, [UserRole.ASSET_MANAGER, UserRole.MAINTENANCE_MANAGER]);

    // ------------------------------------------------------------------------
    // PREVENTIVE MAINTENANCE SCHEDULES
    // ------------------------------------------------------------------------
    case PermissionAction.SCHEDULE_READ:
      if (role === UserRole.WORKER) return false;
      if (role === UserRole.TECHNICIAN) {
        if (!resource?.assignedTechnicianIds) return true;
        return resource.assignedTechnicianIds.includes(user.profileId);
      }
      if (role === UserRole.TEAM_LEADER && resource?.teamId) {
        return resource.teamId === user.teamId;
      }
      return true;

    case PermissionAction.SCHEDULE_CREATE:
    case PermissionAction.SCHEDULE_UPDATE:
    case PermissionAction.SCHEDULE_DELETE:
      if (hasRole(role, [UserRole.WORKER, UserRole.TECHNICIAN])) {
        return false;
      }
      if (role === UserRole.TEAM_LEADER && resource?.teamId) {
        return resource.teamId === user.teamId;
      }
      return true;

    case PermissionAction.SCHEDULE_DISPATCH:
      return hasRole(role, [UserRole.TEAM_LEADER, UserRole.MAINTENANCE_MANAGER]);

    // ------------------------------------------------------------------------
    // TOOLS (CCDC) MANAGEMENT
    // ------------------------------------------------------------------------
    case PermissionAction.TOOL_READ:
      return true;

    case PermissionAction.TOOL_CREATE:
    case PermissionAction.TOOL_UPDATE:
    case PermissionAction.TOOL_DELETE:
      return hasRole(role, [UserRole.ASSET_MANAGER, UserRole.MAINTENANCE_MANAGER]);

    // ------------------------------------------------------------------------
    // USER & ORGANIZATION MANAGEMENT
    // ------------------------------------------------------------------------
    case PermissionAction.USER_READ:
      if (hasRole(role, [UserRole.WORKER, UserRole.TECHNICIAN])) {
        return false;
      }
      if (role === UserRole.TEAM_LEADER && resource?.teamId) {
        return resource.teamId === user.teamId;
      }
      return true;

    case PermissionAction.USER_CHANGE_WORKSHOP:
    case PermissionAction.USER_CHANGE_TEAM:
      if (role === UserRole.TEAM_LEADER && resource?.teamId) {
        return resource.teamId === user.teamId;
      }
      return role === UserRole.MAINTENANCE_MANAGER;

    case PermissionAction.USER_ACTIVATE:
    case PermissionAction.USER_DEACTIVATE:
    case PermissionAction.USER_ASSIGN_ROLE:
      return false;

    default:
      return false;
  }
}
