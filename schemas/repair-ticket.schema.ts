import { z } from "zod";
import { ALL_TICKET_TYPES } from "@/constants/ticket-type";
import { ALL_PRIORITIES } from "@/constants/priority";
import { ALL_TICKET_STATUSES } from "@/constants/ticket-status";

/**
 * Reusable ObjectId validator.
 */
const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId format");

/**
 * Cloudinary image URL validator.
 */
const imageUrlSchema = z.string().url("Image must be a valid URL");

/**
 * Zod v4 validation schemas for RepairTicket.
 *
 * Business constraints enforced here:
 *  - Max 2 incident images
 *  - Max 2 repair images
 *  - Only valid ticket types, priorities, and statuses
 */
export const createRepairTicketSchema = z.object({
  ticketType: z.enum(ALL_TICKET_TYPES),
  requesterId: objectIdSchema,
  machineId: objectIdSchema,
  workshopId: objectIdSchema,
  exactLocation: z.string().max(200).optional(),
  priority: z.enum(ALL_PRIORITIES),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must not exceed 2000 characters"),
  incidentImages: z
    .array(imageUrlSchema)
    .max(2, "Maximum 2 incident images are allowed")
    .default([]),
});

/**
 * Schema for assigning technicians — used by Team Leader / Manager.
 */
export const assignTechnicianSchema = z.object({
  ticketId: objectIdSchema,
  technicianIds: z
    .array(objectIdSchema)
    .min(1, "At least one technician must be assigned"),
});

/**
 * Schema for updating the repair report — used by Technician.
 */
export const updateRepairReportSchema = z.object({
  ticketId: objectIdSchema,
  repairReport: z
    .string()
    .min(1, "Repair report cannot be empty")
    .max(5000, "Report must not exceed 5000 characters"),
  repairImages: z
    .array(imageUrlSchema)
    .max(2, "Maximum 2 repair images are allowed")
    .default([]),
});

/**
 * Schema for updating ticket status — validates status value.
 * Transition rules are enforced by the service layer, not here.
 */
export const updateTicketStatusSchema = z.object({
  ticketId: objectIdSchema,
  status: z.enum(ALL_TICKET_STATUSES),
});

/**
 * Schema for priority update — used by Team Leader / Manager.
 */
export const updateTicketPrioritySchema = z.object({
  ticketId: objectIdSchema,
  priority: z.enum(ALL_PRIORITIES),
});

export type CreateRepairTicketInput = z.infer<typeof createRepairTicketSchema>;
export type AssignTechnicianInput = z.infer<typeof assignTechnicianSchema>;
export type UpdateRepairReportInput = z.infer<typeof updateRepairReportSchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;
export type UpdateTicketPriorityInput = z.infer<
  typeof updateTicketPrioritySchema
>;
