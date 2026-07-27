"use server";

import { ZodError } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { PermissionAction } from "@/constants/permissions";
import { searchMachineSchema } from "@/schemas/machine.schema";
import * as machineService from "@/services/machine.service";
import { AppError } from "@/lib/errors";
import type { PaginatedApiResponse, ApiErrorResponse } from "@/types/api.types";
import type { MachineListItem } from "@/types/machine.types";

export async function listMachinesAction(
  rawParams?: unknown
): Promise<PaginatedApiResponse<MachineListItem> | ApiErrorResponse> {
  try {
    const user = await requirePermission(PermissionAction.MACHINE_READ, {
      type: "Machine",
    });

    const parsedParams = searchMachineSchema.parse(rawParams || {});
    const paginatedResult = await machineService.listMachines(parsedParams, user);

    return {
      success: true,
      data: paginatedResult,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid query parameters",
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
