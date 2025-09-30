/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cinema-dark': '#121212',
        'cinema-gold': '#FFD700',
        'cinema-text': '#E0E0E0',
      },
    },
  },
  plugins: [],
}