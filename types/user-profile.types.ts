import type { Types, Document, Model } from "mongoose";
import type { UserRoleType } from "@/constants/roles";

/**
 * UserProfile is the business extension of Better Auth's user.
 * Better Auth owns the `user` collection (name, email, image, emailVerified).
 * This collection holds ONLY business-specific fields.
 *
 * Relationship: UserProfile.userId → BetterAuth user._id (1:1, unique)
 *
 * Per SYSTEM_RULES.md §Authentication:
 *   "Extend Better Auth's user collection with business-related fields."
 *   "Do not create a separate authentication table."
 */
export interface IUserProfile {
  /** Reference to Better Auth user._id (stored as string by Better Auth) */
  userId: string;
  employeeCode: string;
  role: UserRoleType;
  /** Reference to Workshop._id */
  workshopId: Types.ObjectId;
  /** Reference to Team._id */
  teamId: Types.ObjectId;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserProfileDocument = IUserProfile & Document<Types.ObjectId>;

export type UserProfileModel = Model<IUserProfile>;
