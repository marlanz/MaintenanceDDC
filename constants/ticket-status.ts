/**
 * Repair ticket status lifecycle as defined in app.md §TECHNICIAN
 * and RBAC_MATRIX.md §Business Constraints §Ticket Status Flow.
 *
 * Valid transitions:
 *   PENDING → ASSIGNED → IN_MAINTENANCE → INSPECTION → CLOSED
 *
 * Backward transition: INSPECTION → IN_MAINTENANCE (if inspection fails)
 */
export const TicketStatus = {
  PENDING: "PENDING",
  ASSIGNED: "ASSIGNED",
  IN_MAINTENANCE: "IN_MAINTENANCE",
  INSPECTION: "INSPECTION",
  CLOSED: "CLOSED",
} as const;

export type TicketStatusType = (typeof TicketStatus)[keyof typeof TicketStatus];

/**
 * Defines valid forward transitions per RBAC_MATRIX.md §Ticket Status Flow.
 * Key = current status, Value = allowed next statuses.
 */
export const TICKET_STATUS_TRANSITIONS: Record<
  TicketStatusType,
  TicketStatusType[]
> = {
  [TicketStatus.PENDING]: [TicketStatus.ASSIGNED],
  [TicketStatus.ASSIGNED]: [TicketStatus.IN_MAINTENANCE],
  [TicketStatus.IN_MAINTENANCE]: [TicketStatus.INSPECTION],
  [TicketStatus.INSPECTION]: [TicketStatus.CLOSED, TicketStatus.IN_MAINTENANCE],
  [TicketStatus.CLOSED]: [],
};

/**
 * All status values as an array — useful for Mongoose enum validation.
 */
export const ALL_TICKET_STATUSES = Object.values(TicketStatus) as [
  TicketStatusType,
  ...TicketStatusType[],
];
