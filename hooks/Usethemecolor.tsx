import { useTheme } from "@/context/ThemeContext";

// ─── Token Maps ───────────────────────────────────────────────────────────────
// Mirrors the CSS variables in global.css for both :root (light) and .dark

const lightTokens = {
  background: "#ffffff",
  foreground: "#0a0a0a",
  card: "#ffffff",
  cardForeground: "#0a0a0a",
  popover: "#ffffff",
  popoverForeground: "#0a0a0a",
  primary: "#1a1a1a",
  primaryForeground: "#fafafa",
  secondary: "#f5f5f5",
  secondaryForeground: "#1a1a1a",
  muted: "#f5f5f5",
  mutedForeground: "#737373",
  accent: "#f5f5f5",
  accentForeground: "#1a1a1a",
  destructive: "#e53e3e",
  border: "#e5e5e5",
  input: "#e5e5e5",
  ring: "#a3a3a3",
} as const;

const darkTokens = {
  background: "#0a0a0a",
  foreground: "#fafafa",
  card: "#1a1a1a",
  cardForeground: "#fafafa",
  popover: "#1a1a1a",
  popoverForeground: "#fafafa",
  primary: "#e5e5e5",
  primaryForeground: "#1a1a1a",
  secondary: "#2a2a2a",
  secondaryForeground: "#fafafa",
  muted: "#2a2a2a",
  mutedForeground: "#a3a3a3",
  accent: "#2a2a2a",
  accentForeground: "#fafafa",
  destructive: "#f87171",
  border: "rgba(255,255,255,0.1)",
  input: "rgba(255,255,255,0.15)",
  ring: "#737373",
} as const;

export type ColorToken = keyof typeof lightTokens;

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the resolved hex/rgba value for a design-system token.
 *
 * @example
 * const bg = useThemeColor("background");   // "#0a0a0a" in dark mode
 * const fg = useThemeColor("foreground");   // "#fafafa" in dark mode
 */
export function useThemeColor(token: ColorToken): string {
  const { isDark } = useTheme();
  return isDark ? darkTokens[token] : lightTokens[token];
}

/**
 * Returns the full token map for the active theme.
 * Useful when you need several tokens at once.
 */
export function useTokens() {
  const { isDark } = useTheme();
  return isDark ? darkTokens : lightTokens;
}

export { lightTokens, darkTokens };