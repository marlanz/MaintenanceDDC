import type { Types, Document, Model } from "mongoose";
import type { TicketTypeType } from "@/constants/ticket-type";
import type { PriorityType } from "@/constants/priority";
import type { TicketStatusType } from "@/constants/ticket-status";

/**
 * RepairTicket business entity — SYSTEM_RULES.md §RepairTicket.
 *
 * Covers both manual repair tickets (REPAIR) and auto-generated
 * maintenance tickets (MAINTENANCE) from a MaintenanceSchedule.
 *
 * Business rules:
 *  - A ticket may have multiple assigned technicians.
 *  - Maximum 2 incident images (URLs from Cloudinary).
 *  - Maximum 2 repair images (URLs from Cloudinary).
 *  - Never store binary image data — URLs only.
 *  - Ticket ID is MongoDB ObjectId — no custom IDs.
 */
export interface IRepairTicket {
  ticketType: TicketTypeType;
  /** Reference to UserProfile._id of the person who created the ticket */
  requesterId: Types.ObjectId;
  /** Reference to Machine._id */
  machineId: Types.ObjectId;
  /** Reference to Workshop._id (denormalized for scoped queries) */
  workshopId: Types.ObjectId;
  /** Free-text exact location of the machine within the workshop */
  exactLocation?: string;
  priority: PriorityType;
  status: TicketStatusType;
  /** References to UserProfile._id — supports multiple technicians */
  assignedTechnicianIds: Types.ObjectId[];
  description: string;
  repairReport?: string;
  /** Cloudinary URLs — max 2 per business rules */
  incidentImages: string[];
  /** Cloudinary URLs — max 2 per business rules */
  repairImages: string[];
  /** Reference to UserProfile._id of who performed inspection */
  inspectionBy?: Types.ObjectId;
  inspectionAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type RepairTicketDocument = IRepairTicket & Document<Types.ObjectId>;

export type RepairTicketModel = Model<IRepairTicket>;
