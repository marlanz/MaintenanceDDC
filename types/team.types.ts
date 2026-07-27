import type { Types, Document, Model } from "mongoose";

/**
 * Team (Tổ) business entity — SYSTEM_RULES.md §Team.
 * A team belongs to one workshop and has an optional team leader.
 * Workers and Technicians are scoped to their team.
 */
export interface ITeam {
  teamCode: string;
  teamName: string;
  /** Reference to Workshop._id */
  workshopId: Types.ObjectId;
  /** Reference to UserProfile._id of the team leader (optional) */
  leaderId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type TeamDocument = ITeam & Document<Types.ObjectId>;

export type TeamModel = Model<ITeam>;
