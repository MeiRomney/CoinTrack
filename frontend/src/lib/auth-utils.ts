/**
 * Get the full URL for an auth endpoint
 * In development: uses relative path (proxy handles it)
 * In production: prepends VITE_API_BASE_URL
 */
export function getAuthUrl(path: string): string {
  // In development, use relative paths (Vite proxy handles routing)
  if (import.meta.env.DEV) {
    return path;
  }

  // In production, use the configured API base URL
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  return `${apiBaseUrl}${path}`;
}

/**
 * Get the full URL for an API endpoint
 * Alias for getAuthUrl for consistency
 */
export function getApiUrl(path: string): string {
  return getAuthUrl(path);
}
