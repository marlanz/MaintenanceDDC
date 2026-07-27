import { z } from "zod";

/**
 * Reusable ObjectId validator — validates a 24-character hex string
 * representing a MongoDB ObjectId.
 */
const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId format");

/**
 * Zod validation schemas for Team.
 */
export const createTeamSchema = z.object({
  teamCode: z
    .string()
    .min(1, "Team code is required")
    .max(20, "Team code must not exceed 20 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Team code must contain only uppercase letters, numbers, underscores, or hyphens"
    ),
  teamName: z
    .string()
    .min(1, "Team name is required")
    .max(100, "Team name must not exceed 100 characters"),
  workshopId: objectIdSchema,
  leaderId: objectIdSchema.optional(),
});

export const updateTeamSchema = createTeamSchema.partial();

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
