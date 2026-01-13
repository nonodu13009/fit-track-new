/**
 * Palette de couleurs Deep Dark
 */
export const COLORS = {
  // Backgrounds
  DEEP_BLACK: "#050505",
  SURFACE: "#0F1115",
  ELEVATED: "#1A1D23",

  // Accents
  CYAN: "#22d3ee",
  PURPLE: "#a855f7",
  LIME: "#a3e635",

  // Semantic
  WHITE: "#ffffff",
  GRAY_400: "#9ca3af",
  GRAY_600: "#4b5563",
  GRAY_800: "#1f2937",
} as const;

/**
 * Classes Tailwind pour les glows
 */
export const GLOW_CLASSES = {
  PURPLE: "shadow-glow-purple",
  CYAN: "shadow-glow-cyan",
  LIME: "shadow-glow-lime",
} as const;

/**
 * Classes Tailwind pour le glassmorphism
 */
export const GLASS_CLASSES =
  "bg-elevated/60 backdrop-blur-md border border-white/10" as const;
