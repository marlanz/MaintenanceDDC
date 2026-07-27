import type { PaginatedResult, ParsedPaginationOptions } from "@/types/pagination.types";

/**
 * Builds a standardized PaginatedResult<T> container given dataset, total item count, and pagination options.
 */
export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  options: ParsedPaginationOptions
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / options.limit) || 1;
  const hasNextPage = options.page < totalPages;
  const hasPrevPage = options.page > 1;

  return {
    data,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  };
}
