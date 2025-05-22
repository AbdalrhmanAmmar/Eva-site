import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
        // 🌞 Light Mode Colors
        background: "#FCF5DE",
        foreground: "#193765",
        primary: {
          DEFAULT: "#FF6F61",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D4A5A5",
          foreground: "#FFFFFF",
        },
        border: "#E5E5E5",

        // 🌙 Dark Mode Colors
        dark: {
          background: "#1A1A1A",
          foreground: "#E0E0E0",
          primary: "#FF6F61",
          secondary: "#D4A5A5",
          border: "#333333",
        },

        // إضافي - لألوان الشارت إن احتجت
        chart: {
          1: "#FF6F61",
          2: "#D4A5A5",
          3: "#193765",
          4: "#E5E5E5",
          5: "#FCF5DE",
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
} satisfies Config;

export default config;
