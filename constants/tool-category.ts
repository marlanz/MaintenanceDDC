/**
 * Tool (CCDC) categories as defined in app.md §5 Tool Management.
 *
 * TOOL      — Công cụ (hand tools, measuring instruments, etc.)
 * MATERIAL  — Vật tư (consumable materials, spare parts)
 * EQUIPMENT — Thiết bị (machines/devices used for maintenance work)
 */
export const ToolCategory = {
  TOOL: "TOOL",
  MATERIAL: "MATERIAL",
  EQUIPMENT: "EQUIPMENT",
} as const;

export type ToolCategoryType = (typeof ToolCategory)[keyof typeof ToolCategory];

/**
 * All tool category values as an array — useful for Mongoose enum validation.
 */
export const ALL_TOOL_CATEGORIES = Object.values(ToolCategory) as [
  ToolCategoryType,
  ...ToolCategoryType[],
];
