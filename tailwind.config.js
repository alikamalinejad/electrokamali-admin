/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'surface': {
          DEFAULT: '#F8FAF9',
          card: '#FFFFFF',
          muted: '#F1F5F2',
        },
      },
    },
  },
  plugins: [],
}
