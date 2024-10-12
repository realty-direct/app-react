/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/routes/**/*.{html,js,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
