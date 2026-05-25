/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        glass: {
          bg: "#0a0e1a",
          border: "rgba(255,255,255,0.06)",
        },
      },
    },
  },
  plugins: [],
};
