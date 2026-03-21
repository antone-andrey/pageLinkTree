/**
 * Input validation and sanitization helpers.
 * Built-in validation — no external packages required.
 */

/**
 * Trims whitespace, strips HTML tags, and limits length to 1000 characters.
 */
export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/<[^>]*>/g, "")
    .slice(0, 1000);
}

/**
 * Basic email format validation.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates URL format — must start with http:// or https://.
 */
export function isValidUrl(url: string): boolean {
  const urlRegex = /^https?:\/\/.+/;
  return urlRegex.test(url.trim());
}

/**
 * Validates username: 3-30 characters, alphanumeric and underscores only.
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
}

/**
 * Strips javascript: protocol and trims whitespace from URLs.
 */
export function sanitizeUrl(url: string): string {
  let sanitized = url.trim();
  // Repeatedly strip javascript: to prevent bypass via "javascript:javascript:..."
  while (sanitized.toLowerCase().replace(/\s/g, "").startsWith("javascript:")) {
    sanitized = sanitized.replace(/^\s*javascript\s*:/i, "").trim();
  }
  return sanitized;
}
