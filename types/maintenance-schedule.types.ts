import type { Types, Document, Model } from "mongoose";
import type { MaintenanceCycleType } from "@/constants/maintenance-cycle";

/**
 * MaintenanceSchedule business entity — SYSTEM_RULES.md §MaintenanceSchedule.
 *
 * Defines a recurring preventive maintenance plan for a machine.
 * When autoGenerateTicket is true and nextMaintenanceDate is reached,
 * the system automatically generates a RepairTicket of type MAINTENANCE.
 *
 * Business rules:
 *  - A schedule may assign multiple technicians.
 *  - Technicians can only see schedules assigned to them.
 *  - Full maintenance history is derivable from resulting RepairTickets.
 */
export interface IMaintenanceSchedule {
  /** Reference to Machine._id */
  machineId: Types.ObjectId;
  /** Reference to UserProfile._id of the user who created this schedule */
  createdBy: Types.ObjectId;
  /** References to UserProfile._id — supports multiple technicians */
  technicianIds: Types.ObjectId[];
  cycleType: MaintenanceCycleType;
  /** Used with WEEKLY and MONTHLY: number of weeks/months between cycles */
  interval?: number;
  /** Used with CUSTOM: day of the month (1–31) */
  fixedDay?: number;
  nextMaintenanceDate: Date;
  isActive: boolean;
  /** When true, a RepairTicket of type MAINTENANCE is auto-created on due date */
  autoGenerateTicket: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type MaintenanceScheduleDocument = IMaintenanceSchedule &
  Document<Types.ObjectId>;

export type MaintenanceScheduleModel = Model<IMaintenanceSchedule>;
