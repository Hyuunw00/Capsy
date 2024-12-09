/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // CSS class에 따라 다크모드 토글
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#674EFF',
          dark: '#7CF335' 
        },
        secondary: {
          DEFAULT: '#7CF335',
          dark: '#674EFF'
        },
        white: '#FFFFFF',
        gray: {
          100: '#F7F7F5',
          200: '#D9D9D9'
        },
        bg: {
          100: 'rgba(0, 0, 0, 0.04)',
          200: 'rgba(0, 0, 0, 0.08)'
        }
      },
      boxShadow: {
        '300': '0 4px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 4px -1px rgba(0, 0, 0, 0.2)'
      }
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};