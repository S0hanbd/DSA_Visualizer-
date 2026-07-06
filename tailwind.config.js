/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neo: "10px 10px 24px rgba(148, 163, 184, .34), -10px -10px 24px rgba(255, 255, 255, .9)",
        "neo-inset": "inset 7px 7px 16px rgba(148, 163, 184, .25), inset -7px -7px 16px rgba(255, 255, 255, .85)",
        "dark-neo": "12px 12px 26px rgba(2, 6, 23, .72), -10px -10px 24px rgba(51, 65, 85, .28)",
        "dark-inset": "inset 8px 8px 18px rgba(2, 6, 23, .62), inset -8px -8px 18px rgba(71, 85, 105, .18)",
      },
    },
  },
  plugins: [],
};
