import mongoose, { Schema } from "mongoose";
import { ALL_MAINTENANCE_CYCLES } from "@/constants/maintenance-cycle";
import type {
  IMaintenanceSchedule,
  MaintenanceScheduleModel,
} from "@/types/maintenance-schedule.types";

/**
 * MaintenanceSchedule — SYSTEM_RULES.md §MaintenanceSchedule.
 *
 * Represents a recurring preventive maintenance plan for a machine.
 * When `autoGenerateTicket` is true and `nextMaintenanceDate` is reached,
 * the application creates a RepairTicket of type MAINTENANCE automatically.
 *
 * Indexes:
 *   - machineId: for fetching all schedules for a machine.
 *   - technicianIds: for Technician's "my schedules" view.
 *   - isActive + nextMaintenanceDate: for the background job that
 *     generates maintenance tickets when due dates arrive.
 */
const maintenanceScheduleSchema = new Schema<IMaintenanceSchedule>(
  {
    machineId: {
      type: Schema.Types.ObjectId,
      ref: "Machine",
      required: [true, "Machine reference is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
      required: [true, "Creator reference is required"],
    },
    technicianIds: {
      type: [Schema.Types.ObjectId],
      ref: "UserProfile",
      default: [],
    },
    cycleType: {
      type: String,
      required: [true, "Cycle type is required"],
      enum: {
        values: ALL_MAINTENANCE_CYCLES,
        message: `Cycle type must be one of: ${ALL_MAINTENANCE_CYCLES.join(", ")}`,
      },
    },
    // Required when cycleType is WEEKLY or MONTHLY
    interval: {
      type: Number,
      min: [1, "Interval must be at least 1"],
      default: null,
    },
    // Required when cycleType is CUSTOM — day of month (1–31)
    fixedDay: {
      type: Number,
      min: [1, "Fixed day must be between 1 and 31"],
      max: [31, "Fixed day must be between 1 and 31"],
      default: null,
    },
    nextMaintenanceDate: {
      type: Date,
      required: [true, "Next maintenance date is required"],
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    autoGenerateTicket: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "maintenance_schedules",
  }
);

maintenanceScheduleSchema.index({ machineId: 1 });
maintenanceScheduleSchema.index({ technicianIds: 1 });
// Critical compound index for the background job that generates tickets on due date
maintenanceScheduleSchema.index({ isActive: 1, nextMaintenanceDate: 1 });
maintenanceScheduleSchema.index({
  isActive: 1,
  autoGenerateTicket: 1,
  nextMaintenanceDate: 1,
});

const MaintenanceSchedule =
  (mongoose.models.MaintenanceSchedule as MaintenanceScheduleModel) ||
  mongoose.model<IMaintenanceSchedule, MaintenanceScheduleModel>(
    "MaintenanceSchedule",
    maintenanceScheduleSchema
  );

export default MaintenanceSchedule;
