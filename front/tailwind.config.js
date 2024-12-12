/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#674EFF", // 보라색
          dark: "#7CF335",
        },
        secondary: {
          DEFAULT: "#7CF335", // 네온색
          dark: "#674EFF",
        },
        white: "#FFFFFF",
        gray: {
          100: "#F7F7F5",
          200: "#D9D9D9", // default gray색
          300: "#9B9A97",
          400: "#5F5E5B",
          500: "#37352F", // input message
          600: "#1D1B16",
          700: "#0F0F0F",
        },
        bg: {
          100: "rgba(0, 0, 0, 0.04)",
          200: "rgba(0, 0, 0, 0.08)",
          400: "rgba(0, 0, 0, 0.2)",
          500: "rgba(0, 0, 0, 0.4)",
        },
        black: "#000000",
      },
      boxShadow: {
        300: "0 4px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 4px -1px rgba(0, 0, 0, 0.2)",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Helvetica",
          '"Apple Color Emoji"',
          "Arial",
          "sans-serif",
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Sans KR"',
          '"Apple SD Gothic Neo"',
          '"맑은 고딕"',
          '"Malgun Gothic"',
        ],
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(180deg, rgba(91, 91, 91, 0.00) 0%, rgba(77, 77, 77, 0.10) 35.5%, rgba(57, 57, 57, 0.25) 68.5%, rgba(0, 0, 0, 0.40) 100%)",
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
