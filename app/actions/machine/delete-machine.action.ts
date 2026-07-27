"use server";

import { ZodError } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { PermissionAction } from "@/constants/permissions";
import { machineIdSchema } from "@/schemas/machine.schema";
import * as machineService from "@/services/machine.service";
import { AppError } from "@/lib/errors";
import type { ApiResponse, ApiErrorResponse } from "@/types/api.types";

export async function deleteMachineAction(
  id: string
): Promise<ApiResponse<{ deleted: boolean }> | ApiErrorResponse> {
  try {
    const { id: validId } = machineIdSchema.parse({ id });
    const user = await requirePermission(PermissionAction.MACHINE_DELETE, {
      type: "Machine",
      id: validId,
    });

    const deleted = await machineService.deleteMachine(validId, user);

    return {
      success: true,
      data: { deleted },
      message: "Machine deleted successfully",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid Machine ID format",
          details: error.flatten().fieldErrors,
        },
      };
    }

    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      };
    }

    const err = error as Error;
    return {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: err.message || "An unexpected error occurred",
      },
    };
  }
}
