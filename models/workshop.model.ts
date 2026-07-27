import mongoose, { Schema } from "mongoose";
import type { IWorkshop, WorkshopModel } from "@/types/workshop.types";

/**
 * Workshop (Xưởng) — top-level organizational unit.
 * Teams and Machines reference Workshop via workshopId.
 *
 * Indexes:
 *   - workshopCode: unique — workshop codes must be globally unique.
 */
const workshopSchema = new Schema<IWorkshop>(
  {
    workshopCode: {
      type: String,
      required: [true, "Workshop code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    workshopName: {
      type: String,
      required: [true, "Workshop name is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "workshops",
  }
);

// Index for fast lookup by code (also enforces uniqueness)
workshopSchema.index({ workshopCode: 1 }, { unique: true });

const Workshop =
  (mongoose.models.Workshop as WorkshopModel) ||
  mongoose.model<IWorkshop, WorkshopModel>("Workshop", workshopSchema);

export default Workshop;
