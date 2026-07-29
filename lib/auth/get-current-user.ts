import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import UserProfile from "@/models/user-profile.model";
import type { CurrentAuthUser } from "@/types/auth.types";

/**
 * Reads Better Auth session and loads the corresponding Mongoose UserProfile.
 * Returns a strongly-typed CurrentAuthUser or null if unauthenticated / profile missing.
 *
 * No business module should communicate with Better Auth directly.
 */
export async function getCurrentUser(): Promise<CurrentAuthUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return null;
    }

    await connectDB();

    const profile = await UserProfile.findOne({
      userId: session.user.id,
    }).lean();

    if (!profile || !profile.isActive) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      profileId: profile._id.toString(),
      employeeCode: profile.employeeCode,
      role: profile.role,
      workshopId: profile.workshopId.toString(),
      teamId: profile.teamId.toString(),
      phone: profile.phone,
      isActive: profile.isActive,
      fullName: profile.fullName,
    };
  } catch {
    return null;
  }
}

/**
 * Returns the raw Better Auth session user (no Mongoose profile needed).
 * Used on the first-login page to identify who is registering.
 */
export async function getSessionUser(): Promise<{
  id: string;
  email: string;
  name: string;
  image?: string | null;
} | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) return null;
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    };
  } catch {
    return null;
  }
}

/**
 * Returns true when the user has an active Better Auth session
 * but has NOT yet created a UserProfile (first login scenario).
 */
export async function sessionExistsButNoProfile(): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) return false;

    await connectDB();
    const profile = await UserProfile.findOne({
      userId: session.user.id,
    }).lean();
    return !profile;
  } catch {
    return false;
  }
}
