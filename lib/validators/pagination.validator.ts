import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT, MIN_LIMIT } from "@/constants/pagination";

export const paginationQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, "Page must be at least 1")
    .default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(MIN_LIMIT, `Limit must be at least ${MIN_LIMIT}`)
    .max(MAX_LIMIT, `Limit cannot exceed ${MAX_LIMIT}`)
    .default(DEFAULT_LIMIT),
});

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;
