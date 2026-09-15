import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#bcd3ff",
          300: "#8eb5ff",
          400: "#598bff",
          500: "#3563eb",
          600: "#2447c7",
          700: "#1f3aa0",
          800: "#1f3583",
          900: "#1e326b",
        },
        // Bennett University brand accents
        bennett: {
          red: "#c8102e",
          maroon: "#8f1a2e",
          blue: "#0093d0",
          navy: "#12284c",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
