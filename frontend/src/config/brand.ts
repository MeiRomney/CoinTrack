/**
 * CleverApply Brand Colors Configuration
 *
 * Based on CleverApply brand guidelines, this file defines the color palette
 * for the application. Update these values when the brand guide is available.
 *
 * TODO: Update with actual CleverApply brand colors from the brand guide
 */

export const brandColors = {
  // Primary Brand Colors - Update with actual CleverApply colors
  primary: {
    50: "#eff6ff", // Very light blue
    100: "#dbeafe", // Light blue
    200: "#bfdbfe", // Light blue
    300: "#93c5fd", // Medium light blue
    400: "#60a5fa", // Medium blue
    500: "#3b82f6", // Primary brand blue (placeholder)
    600: "#2563eb", // Darker blue
    700: "#1d4ed8", // Dark blue
    800: "#1e40af", // Very dark blue
    900: "#1e3a8a", // Very dark blue
    950: "#172554", // Almost black blue
  },

  // Secondary Brand Colors - Update with actual CleverApply colors
  secondary: {
    50: "#f8fafc", // Very light gray
    100: "#f1f5f9", // Light gray
    200: "#e2e8f0", // Light gray
    300: "#cbd5e1", // Medium light gray
    400: "#94a3b8", // Medium gray
    500: "#64748b", // Secondary brand gray (placeholder)
    600: "#475569", // Darker gray
    700: "#334155", // Dark gray
    800: "#1e293b", // Very dark gray
    900: "#0f172a", // Very dark gray
    950: "#020617", // Almost black
  },

  // Accent colors for various UI states
  accent: {
    success: "#10b981", // Green for success states
    warning: "#f59e0b", // Amber for warning states
    error: "#ef4444", // Red for error states
    info: "#3b82f6", // Blue for info states
  },

  // Neutral colors (existing zinc scale)
  neutral: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b",
  },
};

// CSS Custom Properties for dynamic theming
export const cssVariables = {
  light: {
    "--color-primary": "59 130 246", // brandColors.primary[500] as RGB
    "--color-primary-foreground": "255 255 255",
    "--color-secondary": "100 116 139", // brandColors.secondary[500] as RGB
    "--color-secondary-foreground": "255 255 255",
    "--color-background": "255 255 255",
    "--color-foreground": "24 24 27", // brandColors.neutral[900] as RGB
    "--color-muted": "244 244 245", // brandColors.neutral[100] as RGB
    "--color-muted-foreground": "113 113 122", // brandColors.neutral[500] as RGB
    "--color-border": "228 228 231", // brandColors.neutral[200] as RGB
    "--color-accent": "59 130 246",
    "--color-accent-foreground": "255 255 255",
  },
  dark: {
    "--color-primary": "96 165 250", // brandColors.primary[400] as RGB
    "--color-primary-foreground": "23 37 84", // brandColors.primary[950] as RGB
    "--color-secondary": "148 163 184", // brandColors.secondary[400] as RGB
    "--color-secondary-foreground": "2 6 23", // brandColors.secondary[950] as RGB
    "--color-background": "9 9 11", // brandColors.neutral[950] as RGB
    "--color-foreground": "250 250 250", // brandColors.neutral[50] as RGB
    "--color-muted": "39 39 42", // brandColors.neutral[800] as RGB
    "--color-muted-foreground": "161 161 170", // brandColors.neutral[400] as RGB
    "--color-border": "63 63 70", // brandColors.neutral[700] as RGB
    "--color-accent": "96 165 250",
    "--color-accent-foreground": "255 255 255",
  },
};

// Theme configuration for Tailwind
export const themeConfig = {
  colors: {
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    neutral: brandColors.neutral,
    success: brandColors.accent.success,
    warning: brandColors.accent.warning,
    error: brandColors.accent.error,
    info: brandColors.accent.info,
  },
};

/**
 * Apply CSS custom properties to the document root
 */
export function applyThemeVariables(theme: "light" | "dark") {
  const root = document.documentElement;
  const variables = cssVariables[theme];

  Object.entries(variables).forEach(([property, value]: [string, string]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Brand guidelines reference:
 *
 * When updating with actual CleverApply brand colors:
 * 1. Replace the placeholder colors in brandColors object
 * 2. Update the primary/secondary color scales
 * 3. Ensure sufficient contrast ratios for accessibility
 * 4. Test both light and dark theme variations
 * 5. Update Tailwind config to use these colors
 *
 * Color accessibility checklist:
 * - Primary/background contrast ratio ≥ 4.5:1 for normal text
 * - Primary/background contrast ratio ≥ 3:1 for large text
 * - Interactive elements have sufficient contrast
 * - Focus indicators are clearly visible
 */
