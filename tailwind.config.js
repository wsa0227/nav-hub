/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2196F3',
        secondary: '#9C27B0',
        dark: {
          bg: '#121212',
          text: '#E0E0E0'
        }
      }
    },
  },
  plugins: [],
} 