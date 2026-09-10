/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        themeRose: '#DB5375',
        themeMint: '#B3FFB3',
        emerald: {
          50: '#fff1f4',
          100: '#ffe2e8',
          200: '#B3FFB3',
          300: '#ffb0c2',
          400: '#f07391',
          500: '#DB5375',
          600: '#c53e61',
          700: '#a72f4e',
          800: '#89233c',
          900: '#6d182e',
        },
        brand: {
          rose: '#DB5375',
          mint: '#B3FFB3',
          50: '#fff1f4',
          100: '#ffe2e8',
          200: '#B3FFB3',
          500: '#DB5375',
          600: '#c53e61',
          700: '#a72f4e',
          900: '#6d182e'
        }
      },
      backgroundImage: {
        'theme-gradient': 'linear-gradient(135deg, #DB5375 0%, #B3FFB3 100%)',
        'theme-gradient-r': 'linear-gradient(90deg, #DB5375 0%, #B3FFB3 100%)',
        'theme-gradient-soft': 'linear-gradient(135deg, rgba(219, 83, 117, 0.08) 0%, rgba(179, 255, 179, 0.15) 100%)',
        'theme-gradient-pill': 'linear-gradient(135deg, rgba(219, 83, 117, 0.18) 0%, rgba(179, 255, 179, 0.40) 100%)',
      }
    },
  },
  plugins: [],
}
