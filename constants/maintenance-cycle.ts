/**
 * Maintenance cycle type as defined in SYSTEM_RULES.md §Machine and §MaintenanceSchedule.
 *
 * WEEKLY  — recurs every N weeks (interval field)
 * MONTHLY — recurs every N months (interval field)
 * CUSTOM  — recurs on a fixed day of the month (fixedDay field)
 */
export const MaintenanceCycle = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  CUSTOM: "CUSTOM",
} as const;

export type MaintenanceCycleType =
  (typeof MaintenanceCycle)[keyof typeof MaintenanceCycle];

/**
 * All maintenance cycle values as an array — useful for Mongoose enum validation.
 */
export const ALL_MAINTENANCE_CYCLES = Object.values(MaintenanceCycle) as [
  MaintenanceCycleType,
  ...MaintenanceCycleType[],
];
