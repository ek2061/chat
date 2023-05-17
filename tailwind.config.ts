/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: "#3e3c61",
        navbar: "#2f2d52",
        chatbar: "#5d5b8d",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
