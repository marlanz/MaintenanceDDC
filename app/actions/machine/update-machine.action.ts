"use server";

import { ZodError } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { PermissionAction } from "@/constants/permissions";
import { updateMachineSchema, machineIdSchema } from "@/schemas/machine.schema";
import * as machineService from "@/services/machine.service";
import { AppError } from "@/lib/errors";
import type { ApiResponse, ApiErrorResponse } from "@/types/api.types";
import type { MachineListItem } from "@/types/machine.types";

export async function updateMachineAction(
  id: string,
  rawData: unknown
): Promise<ApiResponse<MachineListItem> | ApiErrorResponse> {
  try {
    const { id: validId } = machineIdSchema.parse({ id });
    const user = await requirePermission(PermissionAction.MACHINE_UPDATE, {
      type: "Machine",
      id: validId,
    });

    const parsedData = updateMachineSchema.parse(rawData);
    const result = await machineService.updateMachine(validId, parsedData, user);

    return {
      success: true,
      data: result,
      message: "Machine updated successfully",
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
