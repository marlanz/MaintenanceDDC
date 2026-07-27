import type { Types, Document, Model } from "mongoose";
import type { MaintenanceCycleType } from "@/constants/maintenance-cycle";

/**
 * Embedded sub-document for machine maintenance cycle configuration.
 * Used in both Machine and MaintenanceSchedule.
 */
export interface IMaintenanceCycleConfig {
  type: MaintenanceCycleType;
  /** Number of weeks/months between cycles (WEEKLY / MONTHLY) */
  value: number;
}

/**
 * Machine (Máy móc thiết bị) business entity — SYSTEM_RULES.md §Machine.
 * Machines belong to a workshop and team.
 * All repair and maintenance history is derived from RepairTickets and
 * MaintenanceSchedules referencing this machine's _id.
 */
export interface IMachine {
  machineCode: string;
  machineName: string;
  serialNumber?: string | null;
  /** Reference to a future MachineCategory._id */
  categoryId?: Types.ObjectId | null;
  /** Reference to Workshop._id */
  workshopId: Types.ObjectId;
  /** Reference to Team._id */
  teamId: Types.ObjectId;
  manufacturer?: string | null;
  model?: string | null;
  installDate?: Date | null;
  maintenanceCycle: IMaintenanceCycleConfig;
  /** Free-form status string — to be formalized in a future sprint */
  currentStatus?: string | null;
  note?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type MachineDocument = IMachine & Document<Types.ObjectId>;

export type MachineModel = Model<IMachine>;

/**
 * Serialized machine for list views — all ObjectId fields are converted to strings.
 * This type safely crosses the server boundary (Server Action return).
 */
export interface MachineListItem {
  id: string;
  machineCode: string;
  machineName: string;
  serialNumber?: string | null;
  workshopId: string;
  teamId: string;
  categoryId?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  installDate?: string | null;
  maintenanceCycle: {
    type: string;
    value: number;
  };
  currentStatus?: string | null;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Enriched detail view — workshop and team names are populated.
 */
export interface MachineDetail extends MachineListItem {
  workshopName?: string;
  teamName?: string;
}

/**
 * Minimal shape for search/dropdown results — consumed by the future Ticket module.
 */
export interface MachineSummary {
  id: string;
  machineCode: string;
  machineName: string;
  workshopId: string;
  currentStatus?: string | null;
}
