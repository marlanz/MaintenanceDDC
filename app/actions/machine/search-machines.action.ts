"use server";

import { ZodError } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { PermissionAction } from "@/constants/permissions";
import { searchMachineSchema } from "@/schemas/machine.schema";
import * as machineService from "@/services/machine.service";
import { AppError } from "@/lib/errors";
import type { ApiResponse, ApiErrorResponse } from "@/types/api.types";
import type { MachineSummary } from "@/types/machine.types";

export async function searchMachinesAction(
  rawParams?: unknown
): Promise<ApiResponse<MachineSummary[]> | ApiErrorResponse> {
  try {
    const user = await requirePermission(PermissionAction.MACHINE_READ, {
      type: "Machine",
    });

    const parsedParams = searchMachineSchema.parse(rawParams || {});
    const machines = await machineService.searchMachines(parsedParams, user);

    return {
      success: true,
      data: machines,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid search parameters",
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
