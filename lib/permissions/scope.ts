import mongoose from "mongoose";
import { UserRole } from "@/constants/roles";
import type { CurrentAuthUser } from "@/types/auth.types";
import type { ScopeFilter } from "@/types/permission.types";

/**
 * Returns a MongoDB query filter object for RepairTickets based on the user's role and scope.
 */
export function getTicketScopeFilter(user: CurrentAuthUser): ScopeFilter {
  if (user.role === UserRole.ADMIN) {
    return {};
  }

  const profileObjectId = new mongoose.Types.ObjectId(user.profileId);
  const workshopObjectId = new mongoose.Types.ObjectId(user.workshopId);

  if (user.role === UserRole.WORKER) {
    return { requesterId: profileObjectId };
  }

  if (user.role === UserRole.TECHNICIAN) {
    return { assignedTechnicianIds: profileObjectId };
  }

  if (user.role === UserRole.TEAM_LEADER) {
    const teamObjectId = new mongoose.Types.ObjectId(user.teamId);
    return {
      workshopId: workshopObjectId,
      teamId: teamObjectId,
    };
  }

  // ASSET_MANAGER & MAINTENANCE_MANAGER
  return { workshopId: workshopObjectId };
}

/**
 * Returns a MongoDB query filter object for MaintenanceSchedules.
 */
export function getScheduleScopeFilter(user: CurrentAuthUser): ScopeFilter {
  if (user.role === UserRole.ADMIN) {
    return {};
  }

  if (user.role === UserRole.WORKER) {
    return { _id: null }; // Workers cannot access schedules
  }

  if (user.role === UserRole.TECHNICIAN) {
    const profileObjectId = new mongoose.Types.ObjectId(user.profileId);
    return { technicianIds: profileObjectId };
  }

  if (user.role === UserRole.TEAM_LEADER) {
    const teamObjectId = new mongoose.Types.ObjectId(user.teamId);
    return { teamId: teamObjectId };
  }

  return {}; // Factory wide for Managers
}

/**
 * Returns a MongoDB query filter object for Machine listings based on user role.
 *
 * Per RBAC_MATRIX.md §Data Scope:
 *   - TEAM_LEADER may only access machines belonging to their own team.
 *   - WORKER and TECHNICIAN can see all machines (needed to create/search for tickets).
 *   - ASSET_MANAGER and MAINTENANCE_MANAGER have factory-wide access.
 *   - ADMIN has unrestricted access.
 */
export function getMachineScopeFilter(user: CurrentAuthUser): ScopeFilter {
  if (user.role === UserRole.ADMIN) {
    return {};
  }

  if (user.role === UserRole.TEAM_LEADER) {
    const workshopObjectId = new mongoose.Types.ObjectId(user.workshopId);
    const teamObjectId = new mongoose.Types.ObjectId(user.teamId);
    return {
      workshopId: workshopObjectId,
      teamId: teamObjectId,
    };
  }

  // WORKER, TECHNICIAN, ASSET_MANAGER, MAINTENANCE_MANAGER — full visibility
  return {};
}

/**
 * Returns a MongoDB query filter object for Workshop scoping.
 */
export function getWorkshopScopeFilter(user: CurrentAuthUser): ScopeFilter {
  if (user.role === UserRole.ADMIN) {
    return {};
  }
  return { workshopId: new mongoose.Types.ObjectId(user.workshopId) };
}
