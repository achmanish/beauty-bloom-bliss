
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        rose: {
          light: "#f7d5d9",
          DEFAULT: "#f7d5d9",
          dark: "#e5b8bd"
        },
        cream: {
          light: "#fff5f5",
          DEFAULT: "#fff5f5",
          dark: "#f5e5e5"
        },
        burgundy: {
          light: "#6A3D3F",
          DEFAULT: "#4A1D1F",
          dark: "#2A0D0F"
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'lato': ['Lato', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
