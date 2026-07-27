import type { PaginatedResult } from "./pagination.types";

/**
 * Standardized successful API response contract.
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Standardized error API response contract.
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | unknown[];
  };
}

/**
 * Standardized paginated API response.
 */
export type PaginatedApiResponse<T> = ApiResponse<PaginatedResult<T>>;
