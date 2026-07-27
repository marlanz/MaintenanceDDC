export type SortOrder = "asc" | "desc";

export interface SortOptions {
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface SearchQueryParams extends SortOptions {
  keyword?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}
