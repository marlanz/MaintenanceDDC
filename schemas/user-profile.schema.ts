import { z } from "zod";
import { ALL_ROLES, ADMIN_GRANTED_ROLES, UserRole } from "@/constants/roles";

/**
 * Reusable ObjectId validator.
 */
const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId format");

const allRolesEnum = z.enum(ALL_ROLES);

/**
 * Zod v4 validation schemas for UserProfile.
 *
 * Note: On first login, users may only self-assign WORKER or TECHNICIAN roles.
 * TEAM_LEADER, ASSET_MANAGER, and MAINTENANCE_MANAGER must be granted by ADMIN.
 */
export const createUserProfileSchema = z.object({
  /** Better Auth user ID — provided by the auth session */
  userId: z.string().min(1, "User ID is required"),
  employeeCode: z
    .string()
    .min(1, "Employee code is required")
    .max(20, "Employee code must not exceed 20 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Employee code must contain only uppercase letters, numbers, underscores, or hyphens"
    ),
  role: allRolesEnum,
  workshopId: objectIdSchema,
  teamId: objectIdSchema,
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number format")
    .optional(),
  isActive: z.boolean().default(true),
});

/**
 * Schema for first-login self-registration.
 * Only WORKER and TECHNICIAN roles are selectable by the user.
 */
export const selfRegisterProfileSchema = createUserProfileSchema.extend({
  role: z
    .enum([UserRole.WORKER, UserRole.TECHNICIAN])
    .refine(
      (val) =>
        !ADMIN_GRANTED_ROLES.includes(
          val as (typeof ADMIN_GRANTED_ROLES)[number]
        ),
      { message: "This role must be assigned by an administrator" }
    ),
});

export const updateUserProfileSchema = createUserProfileSchema
  .omit({ userId: true })
  .partial();

/**
 * Schema for ADMIN role assignment.
 */
export const assignRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: allRolesEnum,
});

export type CreateUserProfileInput = z.infer<typeof createUserProfileSchema>;
export type SelfRegisterProfileInput = z.infer<typeof selfRegisterProfileSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
