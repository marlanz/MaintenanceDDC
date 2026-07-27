interface SearchClause {
  $or?: Array<Record<string, { $regex: string; $options: "i" }>>;
}

/**
 * Escapes regex special characters to prevent regex injection attacks.
 */
function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/**
 * Builds a case-insensitive regex search query for Mongoose ($or condition across multiple fields).
 */
export function buildSearchQuery(
  fields: string[],
  keyword?: string
): SearchClause {
  if (!keyword || !keyword.trim() || fields.length === 0) {
    return {};
  }

  const safeKeyword = escapeRegex(keyword.trim());
  const regexPattern = { $regex: safeKeyword, $options: "i" as const };

  return {
    $or: fields.map((field) => ({ [field]: regexPattern })),
  };
}
