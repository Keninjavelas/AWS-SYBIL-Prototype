/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- DEFINE THE MISSING COLORS HERE ---
        sybil: {
          bg: '#020617',    // Very dark slate (almost black)
          text: '#94a3b8',  // Muted slate text
          accent: '#06b6d4' // Cyan
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'], // Optional: makes it look more "hacker"
      }
    },
  },
  plugins: [],
}