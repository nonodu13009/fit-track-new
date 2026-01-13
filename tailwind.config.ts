import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Dark Palette
        "deep-black": "#050505",
        surface: "#0F1115",
        elevated: "#1A1D23",

        // Accents Vibrants
        "accent-cyan": "#22d3ee",
        "accent-purple": "#a855f7",
        "accent-lime": "#a3e635",

        // Semantic colors
        background: "#050505",
        foreground: "#ffffff",
      },
      boxShadow: {
        // Glows
        "glow-purple": "0 0 20px -5px rgba(168, 85, 247, 0.4)",
        "glow-cyan": "0 0 15px -3px rgba(34, 211, 238, 0.3)",
        "glow-lime": "0 0 15px -3px rgba(163, 230, 53, 0.3)",
      },
      backgroundImage: {
        // Gradients
        "gradient-purple-indigo":
          "linear-gradient(to right, var(--tw-gradient-stops))",
        "gradient-text": "linear-gradient(to right, var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
} satisfies Config;
