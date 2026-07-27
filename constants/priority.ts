/**
 * Ticket priority levels as defined in app.md §8 General Business Rules.
 * Only two levels are permitted — no other values are valid.
 */
export const Priority = {
  HIGH: "HIGH",
  NORMAL: "NORMAL",
} as const;

export type PriorityType = (typeof Priority)[keyof typeof Priority];

/**
 * All priority values as an array — useful for Mongoose enum validation.
 */
export const ALL_PRIORITIES = Object.values(Priority) as [
  PriorityType,
  ...PriorityType[],
];
