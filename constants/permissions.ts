/**
 * Granular action permissions used by the authorization engine.
 * Defined in accordance with RBAC_MATRIX.md.
 */
export const PermissionAction = {
  // Ticket actions
  TICKET_CREATE: "ticket:create",
  TICKET_READ_OWN: "ticket:read_own",
  TICKET_READ_ASSIGNED: "ticket:read_assigned",
  TICKET_READ_ALL: "ticket:read_all",
  TICKET_EDIT_BEFORE_ASSIGN: "ticket:edit_before_assign",
  TICKET_CANCEL_PENDING: "ticket:cancel_pending",
  TICKET_ASSIGN_TECHNICIAN: "ticket:assign_technician",
  TICKET_CHANGE_PRIORITY: "ticket:change_priority",
  TICKET_CHANGE_STATUS: "ticket:change_status",
  TICKET_CLOSE: "ticket:close",

  // Technician actions
  TICKET_ACCEPT: "ticket:accept",
  TICKET_START_MAINTENANCE: "ticket:start_maintenance",
  TICKET_UPDATE_PROGRESS: "ticket:update_progress",
  TICKET_SUBMIT_REPORT: "ticket:submit_report",

  // Inspection actions
  INSPECTION_PERFORM: "inspection:perform",
  INSPECTION_APPROVE: "inspection:approve",
  INSPECTION_REJECT: "inspection:reject",

  // Machine actions
  MACHINE_READ: "machine:read",
  MACHINE_CREATE: "machine:create",
  MACHINE_UPDATE: "machine:update",
  MACHINE_DELETE: "machine:delete",

  // Maintenance Schedule actions
  SCHEDULE_READ: "schedule:read",
  SCHEDULE_CREATE: "schedule:create",
  SCHEDULE_UPDATE: "schedule:update",
  SCHEDULE_DELETE: "schedule:delete",
  SCHEDULE_DISPATCH: "schedule:dispatch",

  // Tool (CCDC) actions
  TOOL_READ: "tool:read",
  TOOL_CREATE: "tool:create",
  TOOL_UPDATE: "tool:update",
  TOOL_DELETE: "tool:delete",

  // User & Organization actions
  USER_READ: "user:read",
  USER_CHANGE_WORKSHOP: "user:change_workshop",
  USER_CHANGE_TEAM: "user:change_team",
  USER_ACTIVATE: "user:activate",
  USER_DEACTIVATE: "user:deactivate",
  USER_ASSIGN_ROLE: "user:assign_role",
} as const;

export type PermissionActionType =
  (typeof PermissionAction)[keyof typeof PermissionAction];

export const ResourceName = {
  TICKET: "RepairTicket",
  MACHINE: "Machine",
  SCHEDULE: "MaintenanceSchedule",
  TOOL: "Tool",
  USER: "User",
  WORKSHOP: "Workshop",
  TEAM: "Team",
} as const;

export type ResourceNameType =
  (typeof ResourceName)[keyof typeof ResourceName];
