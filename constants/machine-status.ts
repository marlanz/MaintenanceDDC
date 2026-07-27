/**
 * Machine operational status constants.
 * The underlying model stores currentStatus as a free string (SYSTEM_RULES.md §Machine)
 * to allow future formalization, but the application restricts input to these values.
 */
export const MachineStatus = {
  OPERATIONAL: "OPERATIONAL",
  UNDER_REPAIR: "UNDER_REPAIR",
  MAINTENANCE: "MAINTENANCE",
  INACTIVE: "INACTIVE",
} as const;

export type MachineStatusType =
  (typeof MachineStatus)[keyof typeof MachineStatus];

export const ALL_MACHINE_STATUSES = Object.values(MachineStatus) as [
  MachineStatusType,
  ...MachineStatusType[],
];

export const MACHINE_STATUS_LABELS: Record<MachineStatusType, string> = {
  [MachineStatus.OPERATIONAL]: "Operational",
  [MachineStatus.UNDER_REPAIR]: "Under Repair",
  [MachineStatus.MAINTENANCE]: "In Maintenance",
  [MachineStatus.INACTIVE]: "Inactive",
};
