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
import { ConflictError } from "@/lib/errors/conflict-error";

export interface SelfRegisterPayload {
  fullName: string;
  employeeCode: string;
  role: UserRoleType;
  workshopId: string;
  teamId: string;
  phone?: string;
}

export async function selfRegisterProfileAction(
  rawData: SelfRegisterPayload,
): Promise<ApiResponse<{ profileId?: string }> | ApiErrorResponse> {
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
    if (error instanceof ConflictError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      };
    }

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
