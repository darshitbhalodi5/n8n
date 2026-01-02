/**
 * Utility functions for generating avatar colors and initials from email addresses
 */

/**
 * Generate a consistent color from an email address
 * Uses a simple hash function to create a deterministic color
 */
export function getColorFromEmail(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate HSL color with good saturation and lightness for dark theme
  const hue = Math.abs(hash) % 360;
  const saturation = 50 + (Math.abs(hash) % 30); // 50-80% saturation
  const lightness = 45 + (Math.abs(hash) % 20); // 45-65% lightness
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Get initials from email address
 * Takes the first letter before @ and first letter after @
 */
export function getInitialsFromEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) {
    // Fallback: use first two characters
    return email.slice(0, 2).toUpperCase();
  }
  
  const [localPart, domain] = parts;
  const firstInitial = localPart[0]?.toUpperCase() || "";
  const secondInitial = domain[0]?.toUpperCase() || "";
  
  return `${firstInitial}${secondInitial}`;
}

