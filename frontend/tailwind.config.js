/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: '#082F49',
        cyanBrand: '#0E7490',
        greenBrand: '#22C55E',
        ice: '#BAE6FD',
        frost: '#F0FDFF',
        brand: {
          dark: '#082F49',
          primary: '#0E7490',
          accent: '#22C55E',
          light: '#BAE6FD',
          surface: '#F0FDFF'
        }
      },
      backgroundImage: {
        'theme-bg': 'linear-gradient(135deg, #c6badf 0%, #f3e9d2 100%)',
      }
    },
  },
  plugins: [],
}
