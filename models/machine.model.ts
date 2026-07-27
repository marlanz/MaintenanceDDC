import mongoose, { Schema } from "mongoose";
import { ALL_MAINTENANCE_CYCLES } from "@/constants/maintenance-cycle";
import type { IMachine, MachineModel } from "@/types/machine.types";

/**
 * Machine (Máy móc thiết bị) — SYSTEM_RULES.md §Machine.
 *
 * A machine belongs to one Workshop and one Team.
 * Repair and maintenance history is derived from RepairTicket and
 * MaintenanceSchedule documents that reference this machine.
 *
 * The `maintenanceCycle` sub-document is embedded because it is a
 * small, cohesive configuration that always travels with the machine.
 *
 * Indexes:
 *   - machineCode: unique — machine codes are globally unique.
 *   - workshopId: for scoped machine listings.
 *   - teamId: for team-scoped machine listings.
 *   - workshopId + teamId compound: most common combined filter.
 */
const maintenanceCycleSchema = new Schema(
  {
    type: {
      type: String,
      required: [true, "Maintenance cycle type is required"],
      enum: {
        values: ALL_MAINTENANCE_CYCLES,
        message: `Cycle type must be one of: ${ALL_MAINTENANCE_CYCLES.join(", ")}`,
      },
    },
    value: {
      type: Number,
      required: [true, "Maintenance cycle value is required"],
      min: [1, "Cycle value must be at least 1"],
    },
  },
  { _id: false } // Embedded — no separate _id needed
);

const machineSchema = new Schema<IMachine>(
  {
    machineCode: {
      type: String,
      required: [true, "Machine code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    machineName: {
      type: String,
      required: [true, "Machine name is required"],
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
      default: null,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "MachineCategory",
      default: null,
    },
    workshopId: {
      type: Schema.Types.ObjectId,
      ref: "Workshop",
      required: [true, "Workshop reference is required"],
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team reference is required"],
    },
    manufacturer: {
      type: String,
      trim: true,
      default: null,
    },
    model: {
      type: String,
      trim: true,
      default: null,
    },
    installDate: {
      type: Date,
      default: null,
    },
    maintenanceCycle: {
      type: maintenanceCycleSchema,
      required: [true, "Maintenance cycle configuration is required"],
    },
    currentStatus: {
      type: String,
      trim: true,
      default: null,
    },
    note: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "machines",
  }
);

machineSchema.index({ machineCode: 1 }, { unique: true });
machineSchema.index({ workshopId: 1 });
machineSchema.index({ teamId: 1 });
machineSchema.index({ workshopId: 1, teamId: 1 });

const Machine =
  (mongoose.models.Machine as MachineModel) ||
  mongoose.model<IMachine, MachineModel>("Machine", machineSchema);

export default Machine;
