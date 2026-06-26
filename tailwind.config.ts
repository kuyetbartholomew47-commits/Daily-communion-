import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1F3A",
          deep: "#060F1F",
          light: "#13294F",
        },
        royal: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
          dark: "#1D4ED8",
        },
        gold: {
          DEFAULT: "#F4C542",
          light: "#FBDE82",
          dark: "#C9A02E",
        },
        ink: {
          DEFAULT: "#FFFFFF",
          soft: "#B9C2D4",
          muted: "#8A93A8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "communion-gradient":
          "radial-gradient(120% 120% at 10% 0%, #13294F 0%, #0B1F3A 45%, #060F1F 100%)",
        "gold-sheen": "linear-gradient(135deg, #FBDE82 0%, #F4C542 45%, #C9A02E 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.35)",
        glow: "0 0 24px rgba(244,197,66,0.35)",
      },
      borderRadius: {
        xl2: "1.5rem",
        xl3: "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
