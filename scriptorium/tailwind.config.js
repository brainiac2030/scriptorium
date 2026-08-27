/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#FDF5F6',
          100: '#F5E6E8',
          200: '#E8CDD2',
          300: '#D4A5AD',
          400: '#BF7D88',
          500: '#A95A66',
          600: '#943D4A',
          700: '#722F37',
          800: '#5F272E',
          900: '#4B1F24',
        },
        cream: {
          50: '#FEFDFB',
          100: '#F9F5F0',
          200: '#F0E8DC',
          300: '#E8DCC8',
          400: '#D4C8B0',
        },
        gold: {
          400: '#D4B87E',
          500: '#C9A961',
          600: '#B89850',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}