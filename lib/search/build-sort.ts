import type { SortOrder } from "@/types/common.types";

export type MongooseSortOptions = Record<string, 1 | -1>;

/**
 * Builds a Mongoose sort specification object.
 */
export function buildSortQuery(
  sortBy?: string,
  sortOrder: SortOrder = "desc",
  defaultSortBy = "createdAt"
): MongooseSortOptions {
  const field = sortBy && sortBy.trim() ? sortBy.trim() : defaultSortBy;
  const orderValue = sortOrder === "asc" ? 1 : -1;

  return {
    [field]: orderValue,
  };
}
