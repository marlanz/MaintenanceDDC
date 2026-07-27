import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "@/constants/pagination";
import { ALL_MAINTENANCE_CYCLES } from "@/constants/maintenance-cycle";

/**
 * Reusable ObjectId validator.
 */
const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId format");

/**
 * Zod v4 schema for the embedded maintenance cycle configuration.
 */
export const maintenanceCycleConfigSchema = z.object({
  type: z.enum(ALL_MAINTENANCE_CYCLES),
  value: z
    .number()
    .int("Cycle value must be an integer")
    .min(1, "Cycle value must be at least 1"),
});

/**
 * Zod v4 validation schemas for Machine.
 */
export const createMachineSchema = z.object({
  machineCode: z
    .string()
    .min(1, "Machine code is required")
    .max(30, "Machine code must not exceed 30 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Machine code must contain only uppercase letters, numbers, underscores, or hyphens"
    ),
  machineName: z
    .string()
    .min(1, "Machine name is required")
    .max(150, "Machine name must not exceed 150 characters"),
  serialNumber: z.string().max(100).optional(),
  categoryId: objectIdSchema.optional(),
  workshopId: objectIdSchema,
  teamId: objectIdSchema,
  manufacturer: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  installDate: z.string().optional(),
  maintenanceCycle: maintenanceCycleConfigSchema,
  currentStatus: z.string().max(100).optional(),
  note: z.string().max(500).optional(),
});

export const updateMachineSchema = createMachineSchema.partial();

/**
 * Schema for validating a single Machine ID parameter.
 */
export const machineIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid Machine ID format"),
});

/**
 * Schema for search and list/filter queries.
 */
export const searchMachineSchema = z.object({
  query: z.string().optional(),
  workshopId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid workshopId")
    .optional(),
  teamId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid teamId")
    .optional(),
  status: z.string().optional(),
  categoryId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid categoryId")
    .optional(),
  page: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_LIMIT),
});

export type CreateMachineInput = z.infer<typeof createMachineSchema>;
export type UpdateMachineInput = z.infer<typeof updateMachineSchema>;
export type MaintenanceCycleConfigInput = z.infer<
  typeof maintenanceCycleConfigSchema
>;
export type MachineIdInput = z.infer<typeof machineIdSchema>;
export type SearchMachineInput = z.infer<typeof searchMachineSchema>;
