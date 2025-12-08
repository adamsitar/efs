/**
 * Generate a unique ID with type prefix
 * Format: ${type}-${shortUuid}
 * Example: panel-x5y7z2, strip-a3b8c1, group-k9m4n6
 */
export function generateId(type: string): string {
  // Generate 8-character random ID (base36 alphanumeric)
  const randomPart = Math.random().toString(36).substring(2, 10)
  return `${type}-${randomPart}`
}
