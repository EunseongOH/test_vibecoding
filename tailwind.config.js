/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefdf7',
          100: '#d7f7eb',
          200: '#b2edd3',
          300: '#7dddb6',
          400: '#46c595',
          500: '#2cba85', // SWIFIN Main Mint/Green
          600: '#20966a',
          700: '#1a7755',
          800: '#175e44',
          900: '#144d39',
        },
        regret: {
          light: '#fff2f2',
          DEFAULT: '#ff6b6b',
          dark: '#e05353',
        },
        satisfied: {
          light: '#e8f8f5',
          DEFAULT: '#3cc2a5',
          dark: '#2fa38a',
        },
        pastel: {
          yellow: '#fffde6',
          blue: '#e8f4fd',
          pink: '#ffeef0',
          purple: '#f3e8fd',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
    },
  },
  plugins: [],
}
