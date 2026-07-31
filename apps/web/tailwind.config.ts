import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
        },
        ink: {
          DEFAULT: "#111827",
          secondary: "#6B7280",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F9FAFB",
        },
        accent: {
          green: "#16A34A",
          orange: "#F97316",
        },
        border: "#E5E7EB",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "48px",
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      maxWidth: {
        content: "1280px",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease-out",
      },
      boxShadow: {
        elevated: "0 4px 16px -4px rgba(17, 24, 39, 0.12), 0 2px 6px -2px rgba(17, 24, 39, 0.08)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(-2px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "pop-in": "pop-in 0.15s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
