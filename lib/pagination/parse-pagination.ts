import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT, MIN_LIMIT } from "@/constants/pagination";
import type { PaginationParams, ParsedPaginationOptions } from "@/types/pagination.types";

/**
 * Sanitizes and parses pagination parameters into valid database query options.
 */
export function parsePaginationParams(params?: PaginationParams): ParsedPaginationOptions {
  const page = Math.max(1, Math.floor(Number(params?.page) || DEFAULT_PAGE));
  const rawLimit = Math.floor(Number(params?.limit) || DEFAULT_LIMIT);
  const limit = Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, rawLimit));
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
}
