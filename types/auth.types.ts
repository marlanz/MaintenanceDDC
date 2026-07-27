import type { IUserProfile } from "./user-profile.types";
import type { IWorkshop } from "./workshop.types";
import type { ITeam } from "./team.types";

/**
 * Better Auth user object returned by Better Auth session API.
 */
export interface BetterAuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Strongly typed user combining Better Auth identity with Mongoose business profile.
 * Used by all application guards, services, and server actions.
 */
export interface CurrentAuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  /** Business Profile ID (UserProfile._id as string) */
  profileId: string;
  employeeCode: string;
  role: IUserProfile["role"];
  workshopId: string;
  teamId: string;
  workshop?: IWorkshop;
  team?: ITeam;
  phone?: string | null;
  isActive: boolean;
}

export interface AuthSession {
  user: CurrentAuthUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
  };
}
