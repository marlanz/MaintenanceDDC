"use server";

import { ZodError } from "zod";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongoose";
import UserProfile from "@/models/user-profile.model";
import Workshop from "@/models/workshop.model";
import Team from "@/models/team.model";
import { getSessionUser } from "@/lib/auth/get-current-user";
import { selfRegisterProfileSchema } from "@/schemas/user-profile.schema";
import type { ApiResponse, ApiErrorResponse } from "@/types/api.types";
import * as accountService from "@/services/account.service";
import { UserRoleType } from "@/constants";

export interface SelfRegisterPayload {
  fullName: string;
  employeeCode: string;
  role: UserRoleType;
  workshopId: string;
  teamId: string;
  phone?: string;
}

export async function selfRegisterProileAction(
  rawData: SelfRegisterPayload,
): Promise<ApiResponse<{ profileId: string }> | ApiErrorResponse> {
  try {
    // 1. Must have an active Better Auth session
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "You must be signed in to complete your profile.",
        },
      };
    }

    await connectDB();

    // 2. Guard: Profile must not already exist
    const existing = await UserProfile.findOne({ userId: sessionUser.id });
    if (existing) {
      // Profile already set up — just redirect
      redirect("/machines");
    }

    // 3. Validate input
    const parsed = selfRegisterProfileSchema.parse({
      userId: sessionUser.id,
      ...rawData,
    });

    // 4. Validate workshop exists
    // const workshop = await Workshop.findById(parsed.workshopId);
    // if (!workshop) {
    //   return {
    //     success: false,
    //     error: {
    //       code: "NOT_FOUND",
    //       message: "Selected workshop does not exist.",
    //     },
    //   };
    // }

    // // 5. Validate team exists and belongs to workshop
    // const team = await Team.findById(parsed.teamId);
    // if (!team) {
    //   return {
    //     success: false,
    //     error: {
    //       code: "NOT_FOUND",
    //       message: "Selected team does not exist.",
    //     },
    //   };
    // }
    // if (team.workshopId.toString() !== parsed.workshopId) {
    //   return {
    //     success: false,
    //     error: {
    //       code: "BUSINESS_ERROR",
    //       message: "Selected team does not belong to the selected workshop.",
    //     },
    //   };
    // }

    // 6. Check employee code uniqueness
    const codeExists = await UserProfile.findOne({
      employeeCode: parsed.employeeCode.toUpperCase(),
    }).lean();
    if (codeExists) {
      return {
        success: false,
        error: {
          code: "CONFLICT",
          message: `Mã nhân viên "${parsed.employeeCode.toUpperCase()}" đã tồn tại. Hãy sử dụng mã nhân viên khác`,
        },
      };
    }

    // 7. Create the profile
    const created = await UserProfile.create({
      userId: sessionUser.id,
      fullName: parsed.fullName,
      employeeCode: parsed.employeeCode.toUpperCase(),
      role: parsed.role,
      workshopId: parsed.workshopId,
      teamId: parsed.teamId,
      phone: parsed.phone ?? undefined,
      isActive: true,
    });
    const profile = created as { _id: { toString(): string } };

    return {
      success: true,
      data: { profileId: profile._id.toString() },
      message: "Profile created successfully",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input data",
          details: error.flatten().fieldErrors,
        },
      };
    }

    const err = error as Error;
    // next/navigation redirect throws internally — re-throw it
    if (err.message === "NEXT_REDIRECT") throw error;

    return {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: err.message || "An unexpected error occurred.",
      },
    };
  }
}

export async function selfRegisterProfileAction(
  rawData: SelfRegisterPayload,
): Promise<ApiResponse<{ profileId: string }> | ApiErrorResponse> {
  try {
    // Authentication
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "You must be signed in.",
        },
      };
    }

    // Validate input
    const payload = selfRegisterProfileSchema.parse({
      userId: sessionUser.id,
      ...rawData,
    });

    // Business
    const result = await accountService.selfRegisterProfile(payload);

    if (result.redirectTo) {
      redirect(result.redirectTo);
    }

    return {
      success: true,
      data: {
        profileId: result.profileId,
      },
      message: "Profile created successfully.",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input data.",
          details: error.flatten().fieldErrors,
        },
      };
    }

    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    return {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Unknown error.",
      },
    };
  }
}
