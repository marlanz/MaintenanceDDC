import { z } from "zod";
import {
  ALL_MAINTENANCE_CYCLES,
  MaintenanceCycle,
} from "@/constants/maintenance-cycle";

/**
 * Reusable ObjectId validator.
 */
const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId format");

/**
 * Base fields shared across all cycle types.
 */
const baseMaintScheduleSchema = z.object({
  machineId: objectIdSchema,
  createdBy: objectIdSchema,
  technicianIds: z.array(objectIdSchema).default([]),
  nextMaintenanceDate: z.coerce.date({
    error: "Next maintenance date must be a valid date",
  }),
  isActive: z.boolean().default(true),
  autoGenerateTicket: z.boolean().default(true),
});

/**
 * Zod v4 — discriminated union on cycleType ensures correct companion
 * fields are present per cycle type.
 *
 *  WEEKLY  → requires interval (weeks)
 *  MONTHLY → requires interval (months)
 *  CUSTOM  → requires fixedDay (1–31)
 */
export const createMaintenanceScheduleSchema = z.discriminatedUnion(
  "cycleType",
  [
    baseMaintScheduleSchema.extend({
      cycleType: z.literal(MaintenanceCycle.WEEKLY),
      interval: z
        .number()
        .int()
        .min(1, "Interval must be at least 1 week"),
      fixedDay: z.undefined().optional(),
    }),
    baseMaintScheduleSchema.extend({
      cycleType: z.literal(MaintenanceCycle.MONTHLY),
      interval: z
        .number()
        .int()
        .min(1, "Interval must be at least 1 month"),
      fixedDay: z.undefined().optional(),
    }),
    baseMaintScheduleSchema.extend({
      cycleType: z.literal(MaintenanceCycle.CUSTOM),
      fixedDay: z
        .number()
        .int()
        .min(1, "Fixed day must be between 1 and 31")
        .max(31, "Fixed day must be between 1 and 31"),
      interval: z.undefined().optional(),
    }),
  ]
);

/**
 * For updates — all fields are optional.
 */
export const updateMaintenanceScheduleSchema = z.object({
  machineId: objectIdSchema.optional(),
  technicianIds: z.array(objectIdSchema).optional(),
  cycleType: z.enum(ALL_MAINTENANCE_CYCLES).optional(),
  interval: z.number().int().min(1).optional(),
  fixedDay: z.number().int().min(1).max(31).optional(),
  nextMaintenanceDate: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
  autoGenerateTicket: z.boolean().optional(),
});

export type CreateMaintenanceScheduleInput = z.infer<
  typeof createMaintenanceScheduleSchema
>;
export type UpdateMaintenanceScheduleInput = z.infer<
  typeof updateMaintenanceScheduleSchema
>;
