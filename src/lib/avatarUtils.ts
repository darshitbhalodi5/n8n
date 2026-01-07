/**
 * Get the first letter from email address
 */
export function getInitialsFromEmail(email: string): string {
  return email[0]?.toUpperCase() || "";
}
