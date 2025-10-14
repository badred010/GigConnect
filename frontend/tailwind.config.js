import forms from "@tailwindcss/forms"; // Import using ES Module syntax
import typography from "@tailwindcss/typography"; // Import using ES Module syntax

/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        purple: {
          // Your elegant purple theme
          50: "#f5f3ff", // Very light purple
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa", // A good mid-tone purple
          500: "#8b5cf6", // Primary purple, often used for buttons, links
          600: "#7c3aed", // Slightly darker primary
          700: "#6d28d9", // Darker purple for accents or hover states
          800: "#5b21b6",
          900: "#4c1d95", // Very dark purple
          950: "#2e1065", // Even darker, almost black-purple
        },
        indigo: {
          // For gradients or secondary accents
          // You can use Tailwind's default indigo or customize it
          // Example:
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        yellow: {
          // For call-to-actions or highlights
          300: "#fde047",
          400: "#facc15", // Primary yellow
          500: "#eab308",
        },
        // You can add more custom colors here
      },
      animation: {
        pulse: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [
    forms, // Use the imported variable
    typography, // Use the imported variable
  ],
};
