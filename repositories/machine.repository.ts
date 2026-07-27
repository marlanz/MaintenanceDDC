import mongoose from "mongoose";
import Machine from "@/models/machine.model";
import { buildPaginatedResult, parsePaginationParams } from "@/lib/pagination";
import type { MachineDocument } from "@/types/machine.types";
import type { PaginatedResult, PaginationParams } from "@/types/pagination.types";
import type { ScopeFilter } from "@/types/permission.types";
import type { CreateMachineInput, UpdateMachineInput } from "@/schemas/machine.schema";

/**
 * Filter parameters accepted by list/paginate queries.
 */
export interface MachineFilterParams {
  workshopId?: string;
  teamId?: string;
  status?: string;
  categoryId?: string;
}

/**
 * Machine Repository — raw database access only.
 * No business logic. No authorization.
 */

export async function createMachine(
  data: CreateMachineInput
): Promise<MachineDocument> {
  const doc = await Machine.create({
    machineCode: data.machineCode,
    machineName: data.machineName,
    serialNumber: data.serialNumber || null,
    categoryId: data.categoryId
      ? new mongoose.Types.ObjectId(data.categoryId)
      : null,
    workshopId: new mongoose.Types.ObjectId(data.workshopId),
    teamId: new mongoose.Types.ObjectId(data.teamId),
    manufacturer: data.manufacturer || null,
    model: data.model || null,
    installDate: data.installDate ? new Date(data.installDate) : null,
    maintenanceCycle: data.maintenanceCycle,
    currentStatus: data.currentStatus || null,
    note: data.note || null,
  });

  return doc as unknown as MachineDocument;
}

export async function updateMachine(
  id: string,
  data: UpdateMachineInput
): Promise<MachineDocument | null> {
  const updatePayload: Record<string, unknown> = {};

  if (data.machineCode !== undefined) updatePayload.machineCode = data.machineCode;
  if (data.machineName !== undefined) updatePayload.machineName = data.machineName;
  if (data.serialNumber !== undefined) updatePayload.serialNumber = data.serialNumber || null;
  if (data.manufacturer !== undefined) updatePayload.manufacturer = data.manufacturer || null;
  if (data.model !== undefined) updatePayload.model = data.model || null;
  if (data.installDate !== undefined)
    updatePayload.installDate = data.installDate ? new Date(data.installDate) : null;
  if (data.maintenanceCycle !== undefined)
    updatePayload.maintenanceCycle = data.maintenanceCycle;
  if (data.currentStatus !== undefined) updatePayload.currentStatus = data.currentStatus || null;
  if (data.note !== undefined) updatePayload.note = data.note || null;
  if (data.workshopId !== undefined)
    updatePayload.workshopId = new mongoose.Types.ObjectId(data.workshopId);
  if (data.teamId !== undefined)
    updatePayload.teamId = new mongoose.Types.ObjectId(data.teamId);
  if (data.categoryId !== undefined)
    updatePayload.categoryId = data.categoryId
      ? new mongoose.Types.ObjectId(data.categoryId)
      : null;

  const doc = await Machine.findByIdAndUpdate(
    new mongoose.Types.ObjectId(id),
    { $set: updatePayload },
    { new: true, runValidators: true }
  );

  return doc as unknown as MachineDocument | null;
}

export async function deleteMachine(id: string): Promise<boolean> {
  const result = await Machine.findByIdAndDelete(
    new mongoose.Types.ObjectId(id)
  );
  return result !== null;
}

export async function findById(id: string): Promise<MachineDocument | null> {
  const doc = await Machine.findById(new mongoose.Types.ObjectId(id));
  return doc as unknown as MachineDocument | null;
}

export async function findByMachineCode(
  code: string
): Promise<MachineDocument | null> {
  const doc = await Machine.findOne({ machineCode: code.toUpperCase() });
  return doc as unknown as MachineDocument | null;
}

/**
 * Full-text partial match on machineCode or machineName.
 */
export async function searchMachines(
  query: string,
  scopeFilter: ScopeFilter
): Promise<MachineDocument[]> {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  const docs = await Machine.find({
    ...scopeFilter,
    $or: [{ machineCode: regex }, { machineName: regex }],
  })
    .sort({ machineCode: 1 })
    .limit(20)
    .lean();

  return docs as unknown as MachineDocument[];
}

/**
 * List machines with optional filters and scope.
 */
export async function listMachines(
  filters: MachineFilterParams,
  scopeFilter: ScopeFilter
): Promise<MachineDocument[]> {
  const query = buildFilterQuery(filters, scopeFilter);

  const docs = await Machine.find(query)
    .sort({ machineName: 1 })
    .lean();

  return docs as unknown as MachineDocument[];
}

/**
 * Paginated machine list — reuses Sprint 2 pagination utilities.
 */
export async function paginateMachines(
  filters: MachineFilterParams,
  scopeFilter: ScopeFilter,
  paginationParams?: PaginationParams
): Promise<PaginatedResult<MachineDocument>> {
  const options = parsePaginationParams(paginationParams);
  const query = buildFilterQuery(filters, scopeFilter);

  const [docs, total] = await Promise.all([
    Machine.find(query)
      .sort({ machineName: 1 })
      .skip(options.skip)
      .limit(options.limit)
      .lean(),
    Machine.countDocuments(query),
  ]);

  return buildPaginatedResult(
    docs as unknown as MachineDocument[],
    total,
    options
  );
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function buildFilterQuery(
  filters: MachineFilterParams,
  scopeFilter: ScopeFilter
): Record<string, unknown> {
  const query: Record<string, unknown> = { ...scopeFilter };

  if (filters.workshopId) {
    query.workshopId = new mongoose.Types.ObjectId(filters.workshopId);
  }
  if (filters.teamId) {
    query.teamId = new mongoose.Types.ObjectId(filters.teamId);
  }
  if (filters.status) {
    query.currentStatus = filters.status;
  }
  if (filters.categoryId) {
    query.categoryId = new mongoose.Types.ObjectId(filters.categoryId);
  }

  return query;
}
