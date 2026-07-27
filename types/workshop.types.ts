import type { Types, Document, Model } from "mongoose";

/**
 * Workshop business entity — SYSTEM_RULES.md §Workshop.
 * A workshop (Xưởng) is the top-level organizational unit.
 * Teams and machines belong to a workshop.
 */
export interface IWorkshop {
  workshopCode: string;
  workshopName: string;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkshopDocument = IWorkshop & Document<Types.ObjectId>;

export type WorkshopModel = Model<IWorkshop>;
