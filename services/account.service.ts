import { SelfRegisterPayload } from "@/app/actions/profile/self-register-profile.action";
import connectDB from "@/lib/mongoose";
import * as accountRepository from "@/repositories/account.repository";

type SelfRegisterProfilePayload = SelfRegisterPayload & { userId: string };

export async function selfRegisterProfile(
  input: SelfRegisterProfilePayload,
): Promise<{ redirectTo?: string; profileId: string }> {
  await connectDB();

  const existing = await accountRepository.findAccountById(input.userId);

  if (existing) {
    return {
      redirectTo: "/machines",
      profileId: "",
    };
  }

  //   TODO: add data for workshop and team for validation
  //   await validateWorkshopAndTeam(input.workshopId, input.teamId);

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
  const existing = await accountRepository.findEmployeeByCode(employeeCode);
  if (existing) {
    return {
      success: false,
      error: {
        code: "CONFLICT",
        message: `Mã nhân viên "${employeeCode.toUpperCase()}" đã tồn tại. Hãy sử dụng mã nhân viên khác`,
      },
    };
  }
}
