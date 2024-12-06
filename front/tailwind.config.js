/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],

  //  모바일에선 hover 스타일 막기
  future: {
    hoverOnlyWhenSupported: true,
  },
};
