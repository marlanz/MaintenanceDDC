import mongoose, { Schema } from "mongoose";
import { ALL_TICKET_TYPES } from "@/constants/ticket-type";
import { ALL_PRIORITIES } from "@/constants/priority";
import { ALL_TICKET_STATUSES, TicketStatus } from "@/constants/ticket-status";
import type {
  IRepairTicket,
  RepairTicketModel,
} from "@/types/repair-ticket.types";

/**
 * RepairTicket — SYSTEM_RULES.md §RepairTicket.
 *
 * Covers both REPAIR (manual) and MAINTENANCE (auto-generated) tickets.
 * Images are stored as Cloudinary URLs — never binary data.
 * Max 2 incident images and 2 repair images per business rules (app.md §8).
 *
 * Indexes:
 *   - status: for queue-style filtering of tickets by status.
 *   - workshopId: for workshop-scoped ticket lists (RBAC).
 *   - requesterId: for Worker's "my tickets" view.
 *   - assignedTechnicianIds: for Technician's "my assigned tickets" view.
 *   - machineId: for machine repair history.
 */
const repairTicketSchema = new Schema<IRepairTicket>(
  {
    ticketType: {
      type: String,
      required: [true, "Ticket type is required"],
      enum: {
        values: ALL_TICKET_TYPES,
        message: `Ticket type must be one of: ${ALL_TICKET_TYPES.join(", ")}`,
      },
    },
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
      required: [true, "Requester reference is required"],
    },
    machineId: {
      type: Schema.Types.ObjectId,
      ref: "Machine",
      required: [true, "Machine reference is required"],
    },
    // Denormalized for scoped queries — avoids joining through Machine for every list query
    workshopId: {
      type: Schema.Types.ObjectId,
      ref: "Workshop",
      required: [true, "Workshop reference is required"],
    },
    exactLocation: {
      type: String,
      trim: true,
      default: null,
    },
    priority: {
      type: String,
      required: [true, "Priority is required"],
      enum: {
        values: ALL_PRIORITIES,
        message: `Priority must be one of: ${ALL_PRIORITIES.join(", ")}`,
      },
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ALL_TICKET_STATUSES,
        message: `Status must be one of: ${ALL_TICKET_STATUSES.join(", ")}`,
      },
      default: TicketStatus.PENDING,
    },
    assignedTechnicianIds: {
      type: [Schema.Types.ObjectId],
      ref: "UserProfile",
      default: [],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    repairReport: {
      type: String,
      trim: true,
      default: null,
    },
    // Cloudinary URLs — validation of max 2 is enforced at the service/schema layer
    incidentImages: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.length <= 2,
        message: "Maximum 2 incident images are allowed",
      },
    },
    repairImages: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.length <= 2,
        message: "Maximum 2 repair images are allowed",
      },
    },
    inspectionBy: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
      default: null,
    },
    inspectionAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "repair_tickets",
  }
);

repairTicketSchema.index({ status: 1 });
repairTicketSchema.index({ workshopId: 1 });
repairTicketSchema.index({ workshopId: 1, status: 1 });
repairTicketSchema.index({ requesterId: 1 });
repairTicketSchema.index({ machineId: 1 });
repairTicketSchema.index({ assignedTechnicianIds: 1 });
// Compound for team leader's team-scoped queue
repairTicketSchema.index({
  workshopId: 1,
  status: 1,
  assignedTechnicianIds: 1,
});

const RepairTicket =
  (mongoose.models.RepairTicket as RepairTicketModel) ||
  mongoose.model<IRepairTicket, RepairTicketModel>(
    "RepairTicket",
    repairTicketSchema
  );

export default RepairTicket;
