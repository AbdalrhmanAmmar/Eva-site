import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#1E1E1E",
        foreground: "#FFFFFF",
        border: "#898989",
        input: "#898989",
        ring: "#F2DF56",
        primary: {
          DEFAULT: "#F2DF56",
          foreground: "#1E1E1E",
        },
        secondary: {
          DEFAULT: "#898989",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF0000",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#898989",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F2DF56",
          foreground: "#1E1E1E",
        },
        popover: {
          DEFAULT: "#1E1E1E",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#1E1E1E",
          foreground: "#FFFFFF",
        },
        chart: {
          1: "#F2DF56",
          2: "#898989",
          3: "#1E1E1E",
          4: "#FFFFFF",
          5: "#F2DF56",
        }
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config