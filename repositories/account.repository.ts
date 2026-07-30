import UserProfile from "@/models/user-profile.model";
import { CreateUserProfileInput } from "@/schemas/user-profile.schema";
import { UserProfileDocument } from "@/types";

export async function findEmployeeByCode(
  sessionId: string,
): Promise<UserProfileDocument | null> {
  const doc = await UserProfile.findOne({ userId: sessionId });
  return doc as unknown as UserProfileDocument | null;
}

export async function createProfile(
  data: CreateUserProfileInput,
): Promise<UserProfileDocument> {
  const doc = await UserProfile.create({
    userId: data.userId,
    fullName: data.fullName,
    employeeCode: data.employeeCode.toUpperCase(),
    role: data.role,
    workshopId: data.workshopId,
    teamId: data.teamId,
    phone: data.phone ?? undefined,
    isActive: true,
  });
  return doc as unknown as UserProfileDocument;
}

export async function findAccountById(
  id: string,
): Promise<UserProfileDocument | null> {
  const doc = await UserProfile.findById(id);
  return doc as unknown as UserProfileDocument | null;
}
