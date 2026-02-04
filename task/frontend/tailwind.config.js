/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0f172a",      // Slate 950 - Main background
        darkCard: "#1e293b",    // Slate 800 - Task cards
        accentBlue: "#3b82f6",  // Blue 500 - Buttons/Actions
        border: "#334155",      // Slate 700 - Formatting borders
      },
    },
  },
  plugins: [],
}