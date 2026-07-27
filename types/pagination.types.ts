/**
 * Input parameters for pagination.
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Parsed pagination options for database query execution.
 */
export interface ParsedPaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Standardized paginated result container.
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
