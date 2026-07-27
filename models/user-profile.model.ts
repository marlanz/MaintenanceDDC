import mongoose, { Schema } from "mongoose";
import { ALL_ROLES, UserRole } from "@/constants/roles";
import type { IUserProfile, UserProfileModel } from "@/types/user-profile.types";

/**
 * UserProfile — business extension of Better Auth's user.
 *
 * Better Auth manages authentication fields (name, email, image, emailVerified)
 * in its own `user` collection using the native MongoDB driver.
 * This model holds ONLY business fields and links to the Better Auth user
 * via `userId` (the string representation of Better Auth's user._id).
 *
 * Relationship: one UserProfile per Better Auth user (1:1, enforced by unique index).
 *
 * Indexes:
 *   - userId: unique — one profile per auth user.
 *   - employeeCode: unique — employee codes are organization-wide unique.
 *   - role: for filtering users by role.
 *   - workshopId: for scoping users to a workshop.
 *   - teamId: for scoping users to a team.
 *   - isActive: for filtering active/inactive users.
 */
const userProfileSchema = new Schema<IUserProfile>(
  {
    // String reference to Better Auth user._id
    userId: {
      type: String,
      required: [true, "Better Auth userId is required"],
      unique: true,
    },
    employeeCode: {
      type: String,
      required: [true, "Employee code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ALL_ROLES,
        message: `Role must be one of: ${ALL_ROLES.join(", ")}`,
      },
      default: UserRole.WORKER,
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
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "user_profiles",
  }
);

userProfileSchema.index({ userId: 1 }, { unique: true });
userProfileSchema.index({ employeeCode: 1 }, { unique: true });
userProfileSchema.index({ role: 1 });
userProfileSchema.index({ workshopId: 1 });
userProfileSchema.index({ teamId: 1 });
userProfileSchema.index({ isActive: 1 });
// Compound index for scoped queries used frequently in RBAC checks
userProfileSchema.index({ workshopId: 1, teamId: 1 });
userProfileSchema.index({ workshopId: 1, role: 1 });

const UserProfile =
  (mongoose.models.UserProfile as UserProfileModel) ||
  mongoose.model<IUserProfile, UserProfileModel>(
    "UserProfile",
    userProfileSchema
  );

export default UserProfile;
