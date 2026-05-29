import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        "surface-3": "rgb(var(--surface-3) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        "border-strong": "rgb(var(--border-strong) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-2": "rgb(var(--accent-2) / <alpha-value>)",
        "on-accent": "rgb(var(--on-accent) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        easy: "rgb(var(--easy) / <alpha-value>)",
        medium: "rgb(var(--medium) / <alpha-value>)",
        hard: "rgb(var(--hard) / <alpha-value>)",
        insane: "rgb(var(--insane) / <alpha-value>)",
      },
      fontFamily: {
        // "display" houden we als alias op de UI-sans (geen serif meer)
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "5px",
        md: "6px",
        lg: "8px",
        xl: "10px",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(0 0 0 / 0.35)",
        panel: "0 8px 24px -8px rgb(0 0 0 / 0.55)",
        warm: "0 8px 24px -8px rgb(0 0 0 / 0.55)",
        hairline: "inset 0 0 0 1px rgb(var(--border-strong))",
        glow: "0 0 0 1px rgb(var(--accent) / 0.45)",
      },
      keyframes: {
        "xp-pop": {
          "0%": { transform: "translateY(8px) scale(0.9)", opacity: "0" },
          "20%": { transform: "translateY(0) scale(1.05)", opacity: "1" },
          "80%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-10px) scale(1)", opacity: "0" },
        },
        steam: {
          "0%": { transform: "translateY(0) scaleX(1)", opacity: "0" },
          "30%": { opacity: "0.6" },
          "100%": { transform: "translateY(-10px) scaleX(1.4)", opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(3px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
      },
      animation: {
        "xp-pop": "xp-pop 1.6s ease-out forwards",
        steam: "steam 1.8s ease-in-out infinite",
        "fade-in": "fade-in 0.2s ease-out",
        blink: "blink 1.1s steps(1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
