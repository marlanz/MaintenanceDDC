import { z } from "zod";
import { ALL_TOOL_CATEGORIES } from "@/constants/tool-category";

/**
 * Zod v4 validation schemas for Tool (CCDC).
 */
export const createToolSchema = z.object({
  toolCode: z
    .string()
    .min(1, "Tool code is required")
    .max(30, "Tool code must not exceed 30 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Tool code must contain only uppercase letters, numbers, underscores, or hyphens"
    ),
  toolName: z
    .string()
    .min(1, "Tool name is required")
    .max(150, "Tool name must not exceed 150 characters"),
  category: z.enum(ALL_TOOL_CATEGORIES),
  description: z.string().max(500).optional(),
  unit: z.string().max(50).optional(),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative")
    .default(0),
  imageUrl: z.string().url("Image URL must be a valid URL").optional(),
  isActive: z.boolean().default(true),
});

export const updateToolSchema = createToolSchema.partial();

export type CreateToolInput = z.infer<typeof createToolSchema>;
export type UpdateToolInput = z.infer<typeof updateToolSchema>;
