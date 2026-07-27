import type { ResourceNameType } from "@/constants/permissions";

/**
 * Data access scope levels per RBAC_MATRIX.md.
 */
export type ScopeLevel = "OWN" | "ASSIGNED" | "TEAM" | "FACTORY" | "ALL";

/**
 * Resource descriptor passed into permission evaluator `can()`.
 */
export interface ResourceDescriptor {
  type: ResourceNameType;
  /** Primary key of the resource */
  id?: string;
  /** Owner user profile ID */
  ownerId?: string;
  /** Workshop ID the resource belongs to */
  workshopId?: string;
  /** Team ID the resource belongs to */
  teamId?: string;
  /** Array of assigned technician profile IDs (for tickets / schedules) */
  assignedTechnicianIds?: string[];
  /** Current status (for ticket lifecycle checks) */
  status?: string;
}

/**
 * Scoped MongoDB filter query object returned by scope helpers.
 */
export interface ScopeFilter {
  [key: string]: unknown;
}
