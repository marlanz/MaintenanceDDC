import { z } from "zod";
import { paginationQuerySchema } from "./pagination.validator";

export const searchSortSchema = z.object({
  keyword: z.string().trim().optional(),
  sortBy: z.string().trim().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const searchQuerySchema = paginationQuerySchema.merge(searchSortSchema);

export type SearchSortInput = z.infer<typeof searchSortSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
