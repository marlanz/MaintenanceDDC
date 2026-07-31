import { SelfRegisterPayload } from "@/app/actions/profile/self-register-profile.action";
import { BusinessError } from "@/lib/errors";
import { ConflictError } from "@/lib/errors/conflict-error";
import connectDB from "@/lib/mongoose";
import * as accountRepository from "@/repositories/account.repository";

type SelfRegisterProfilePayload = SelfRegisterPayload & { userId: string };

export async function selfRegisterProfile(
  input: SelfRegisterProfilePayload,
): Promise<{ redirectTo?: string; profileId?: string }> {
  await connectDB();

  const existing = await accountRepository.findProfileByUserId(input.userId);

  if (existing) {
    return {
      redirectTo: "/machines",
    };
  }

  //   TODO: add data for workshop and team for validation
  //   await validateWorkshopAndTeam(input.workshopId, input.teamId);

  // Check for duplicate employee code
  await ensureEmployeeCodeUnique(input.employeeCode);

  const profile = await accountRepository.createProfile({
    ...input,
    isActive: true,
  });

  return {
    profileId: profile._id.toString(),
  };
}

async function ensureEmployeeCodeUnique(employeeCode: string) {
  const existing = await accountRepository.findEmployeeByCode(
    employeeCode.toUpperCase(),
  );

  if (existing) {
    throw new ConflictError(
      `Mã nhân viên "${employeeCode.toUpperCase()}" đã tồn tại.`,
    );
  }
}
