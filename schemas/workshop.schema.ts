import { z } from "zod";

/**
 * Zod validation schemas for Workshop.
 * Used for both server-side validation in Server Actions and
 * form validation via React Hook Form (future sprints).
 */
export const createWorkshopSchema = z.object({
  workshopCode: z
    .string()
    .min(1, "Workshop code is required")
    .max(20, "Workshop code must not exceed 20 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Workshop code must contain only uppercase letters, numbers, underscores, or hyphens"
    ),
  workshopName: z
    .string()
    .min(1, "Workshop name is required")
    .max(100, "Workshop name must not exceed 100 characters"),
});

export const updateWorkshopSchema = createWorkshopSchema.partial();

export type CreateWorkshopInput = z.infer<typeof createWorkshopSchema>;
export type UpdateWorkshopInput = z.infer<typeof updateWorkshopSchema>;
