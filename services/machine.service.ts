import connectDB from "@/lib/mongoose";
import Workshop from "@/models/workshop.model";
import Team from "@/models/team.model";
import * as machineRepo from "@/repositories/machine.repository";
import { authorize } from "@/lib/permissions/authorize";
import { getMachineScopeFilter } from "@/lib/permissions/scope";
import { PermissionAction } from "@/constants/permissions";
import { BusinessError, NotFoundError } from "@/lib/errors";
import type { CurrentAuthUser } from "@/types/auth.types";
import type {
  MachineDocument,
  MachineListItem,
  MachineDetail,
  MachineSummary,
} from "@/types/machine.types";
import type { PaginatedResult } from "@/types/pagination.types";
import type {
  CreateMachineInput,
  UpdateMachineInput,
  SearchMachineInput,
} from "@/schemas/machine.schema";

/**
 * Serialize a Mongoose Machine document into a plain JS MachineListItem object.
 * Safe for Server Action boundary crossing.
 */
function serializeMachineListItem(doc: unknown): MachineListItem {
  const raw = (doc && typeof (doc as { toObject?: () => Record<string, unknown> }).toObject === "function"
    ? (doc as { toObject: () => Record<string, unknown> }).toObject()
    : doc) as Record<string, unknown>;

  return {
    id: String(raw._id),
    machineCode: String(raw.machineCode),
    machineName: String(raw.machineName),
    serialNumber: raw.serialNumber ? String(raw.serialNumber) : null,
    workshopId: String(raw.workshopId),
    teamId: String(raw.teamId),
    categoryId: raw.categoryId ? String(raw.categoryId) : null,
    manufacturer: raw.manufacturer ? String(raw.manufacturer) : null,
    model: raw.model ? String(raw.model) : null,
    installDate: raw.installDate
      ? new Date(raw.installDate as string | number | Date).toISOString()
      : null,
    maintenanceCycle: {
      type: String((raw.maintenanceCycle as { type: string }).type),
      value: Number((raw.maintenanceCycle as { value: number }).value),
    },
    currentStatus: raw.currentStatus ? String(raw.currentStatus) : null,
    note: raw.note ? String(raw.note) : null,
    createdAt: raw.createdAt
      ? new Date(raw.createdAt as string | number | Date).toISOString()
      : new Date().toISOString(),
    updatedAt: raw.updatedAt
      ? new Date(raw.updatedAt as string | number | Date).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Machine Service — implements all business logic, validation rules,
 * authorization checks, scope filters, and document serialization.
 */

export async function createMachine(
  input: CreateMachineInput,
  user: CurrentAuthUser
): Promise<MachineListItem> {
  await connectDB();

  // Authorization check
  authorize(user, PermissionAction.MACHINE_CREATE, { type: "Machine" });

  // 1. Check machineCode uniqueness
  const existingCode = await machineRepo.findByMachineCode(input.machineCode);
  if (existingCode) {
    throw new BusinessError(
      `Machine code "${input.machineCode.toUpperCase()}" already exists.`
    );
  }

  // 2. Validate Workshop existence
  const workshop = await Workshop.findById(input.workshopId);
  if (!workshop) {
    throw new NotFoundError(`Workshop with ID "${input.workshopId}" not found.`);
  }

  // 3. Validate Team existence & association with Workshop
  const team = await Team.findById(input.teamId);
  if (!team) {
    throw new NotFoundError(`Team with ID "${input.teamId}" not found.`);
  }

  if (team.workshopId.toString() !== input.workshopId) {
    throw new BusinessError(
      `Team "${team.teamName}" does not belong to Workshop "${workshop.workshopName}".`
    );
  }

  // Create document via repository
  const doc = await machineRepo.createMachine(input);
  return serializeMachineListItem(doc);
}

export async function updateMachine(
  id: string,
  input: UpdateMachineInput,
  user: CurrentAuthUser
): Promise<MachineListItem> {
  await connectDB();

  // Authorization check
  authorize(user, PermissionAction.MACHINE_UPDATE, { type: "Machine", id });

  // Check machine existence
  const existing = await machineRepo.findById(id);
  if (!existing) {
    throw new NotFoundError(`Machine with ID "${id}" not found.`);
  }

  // 1. If machineCode is changing, check uniqueness
  if (
    input.machineCode &&
    input.machineCode.toUpperCase() !== existing.machineCode
  ) {
    const codeOwner = await machineRepo.findByMachineCode(input.machineCode);
    if (codeOwner && codeOwner._id.toString() !== id) {
      throw new BusinessError(
        `Machine code "${input.machineCode.toUpperCase()}" already exists.`
      );
    }
  }

  // 2. Determine target workshopId and teamId for validation
  const targetWorkshopId = input.workshopId || existing.workshopId.toString();
  const targetTeamId = input.teamId || existing.teamId.toString();

  if (input.workshopId) {
    const workshop = await Workshop.findById(targetWorkshopId);
    if (!workshop) {
      throw new NotFoundError(
        `Workshop with ID "${targetWorkshopId}" not found.`
      );
    }
  }

  if (input.teamId || input.workshopId) {
    const team = await Team.findById(targetTeamId);
    if (!team) {
      throw new NotFoundError(`Team with ID "${targetTeamId}" not found.`);
    }

    if (team.workshopId.toString() !== targetWorkshopId) {
      throw new BusinessError(
        `Team "${team.teamName}" does not belong to Workshop ID "${targetWorkshopId}".`
      );
    }
  }

  const updatedDoc = await machineRepo.updateMachine(id, input);
  if (!updatedDoc) {
    throw new NotFoundError(`Machine with ID "${id}" not found.`);
  }

  return serializeMachineListItem(updatedDoc);
}

export async function deleteMachine(
  id: string,
  user: CurrentAuthUser
): Promise<boolean> {
  await connectDB();

  // Authorization check
  authorize(user, PermissionAction.MACHINE_DELETE, { type: "Machine", id });

  const existing = await machineRepo.findById(id);
  if (!existing) {
    throw new NotFoundError(`Machine with ID "${id}" not found.`);
  }

  return await machineRepo.deleteMachine(id);
}

export async function getMachineById(
  id: string,
  user: CurrentAuthUser
): Promise<MachineDetail> {
  await connectDB();

  // Authorization check
  authorize(user, PermissionAction.MACHINE_READ, { type: "Machine", id });

  const doc = await machineRepo.findById(id);
  if (!doc) {
    throw new NotFoundError(`Machine with ID "${id}" not found.`);
  }

  const baseItem = serializeMachineListItem(doc);

  // Fetch populated names
  const [workshop, team] = await Promise.all([
    Workshop.findById(doc.workshopId).lean(),
    Team.findById(doc.teamId).lean(),
  ]);

  return {
    ...baseItem,
    workshopName: workshop?.workshopName ?? "Unknown Workshop",
    teamName: team?.teamName ?? "Unknown Team",
  };
}

export async function searchMachines(
  input: SearchMachineInput,
  user: CurrentAuthUser
): Promise<MachineSummary[]> {
  await connectDB();

  // Authorization check
  authorize(user, PermissionAction.MACHINE_READ, { type: "Machine" });

  const scopeFilter = getMachineScopeFilter(user);
  const docs = await machineRepo.searchMachines(input.query || "", scopeFilter);

  return docs.map((doc) => {
    const raw = (doc && typeof (doc as { toObject?: () => Record<string, unknown> }).toObject === "function"
      ? (doc as { toObject: () => Record<string, unknown> }).toObject()
      : doc) as Record<string, unknown>;

    return {
      id: String(raw._id),
      machineCode: String(raw.machineCode),
      machineName: String(raw.machineName),
      workshopId: String(raw.workshopId),
      currentStatus: raw.currentStatus ? String(raw.currentStatus) : null,
    };
  });
}

export async function listMachines(
  input: SearchMachineInput,
  user: CurrentAuthUser
): Promise<PaginatedResult<MachineListItem>> {
  await connectDB();

  // Authorization check
  authorize(user, PermissionAction.MACHINE_READ, { type: "Machine" });

  const scopeFilter = getMachineScopeFilter(user);

  const filters = {
    workshopId: input.workshopId,
    teamId: input.teamId,
    status: input.status,
    categoryId: input.categoryId,
  };

  const paginatedDocs = await machineRepo.paginateMachines(
    filters,
    scopeFilter,
    { page: input.page, limit: input.limit }
  );

  const data = paginatedDocs.data.map((doc) =>
    serializeMachineListItem(doc)
  );

  return {
    data,
    pagination: paginatedDocs.pagination,
  };
}
