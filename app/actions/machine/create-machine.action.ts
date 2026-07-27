"use me server"; // Directive at top
"use server";

import { ZodError } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { PermissionAction } from "@/constants/permissions";
import { createMachineSchema } from "@/schemas/machine.schema";
import * as machineService from "@/services/machine.service";
import { AppError } from "@/lib/errors";
import type { ApiResponse, ApiErrorResponse } from "@/types/api.types";
import type { MachineListItem } from "@/types/machine.types";

export async function createMachineAction(
  rawData: unknown
): Promise<ApiResponse<MachineListItem> | ApiErrorResponse> {
  try {
    const user = await requirePermission(PermissionAction.MACHINE_CREATE, {
      type: "Machine",
    });

    const parsedData = createMachineSchema.parse(rawData);
    const result = await machineService.createMachine(parsedData, user);

    return {
      success: true,
      data: result,
      message: "Machine created successfully",
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
