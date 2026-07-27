import mongoose, { Schema } from "mongoose";
import type { ITeam, TeamModel } from "@/types/team.types";

/**
 * Team (Tổ) — belongs to one Workshop, has an optional team leader.
 * Workers and Technicians are scoped to their team (RBAC_MATRIX.md §Team Isolation).
 *
 * Indexes:
 *   - teamCode: unique — team codes must be globally unique.
 *   - workshopId: for fast listing of teams within a workshop.
 *   - leaderId: for fast lookup of who leads a team.
 */
const teamSchema = new Schema<ITeam>(
  {
    teamCode: {
      type: String,
      required: [true, "Team code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },
    workshopId: {
      type: Schema.Types.ObjectId,
      ref: "Workshop",
      required: [true, "Workshop reference is required"],
    },
    leaderId: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "teams",
  }
);

teamSchema.index({ teamCode: 1 }, { unique: true });
teamSchema.index({ workshopId: 1 });
teamSchema.index({ leaderId: 1 });

const Team =
  (mongoose.models.Team as TeamModel) ||
  mongoose.model<ITeam, TeamModel>("Team", teamSchema);

export default Team;
