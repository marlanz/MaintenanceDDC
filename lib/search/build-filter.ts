/**
 * Cleans query parameters by stripping undefined, null, or empty string filters.
 * Returns a clean MongoDB query filter object.
 */
export function buildFilterQuery<T extends Record<string, unknown>>(
  filters?: T
): Record<string, unknown> {
  if (!filters) return {};

  const cleanFilter: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      cleanFilter[key] = value;
    }
  }

  return cleanFilter;
}
