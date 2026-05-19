/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        terminal: [
          "Fira Code",
          "JetBrains Mono",
          "Cascadia Code",
          "Courier New",
          "monospace"
        ]
      },
      colors: {
        kali: {
          black: "#050505",
          panel: "#0A0A0A",
          blue: "#2aa7ff",
          green: "#00ff88",
          muted: "#8aa0a8",
          text: "#d5fff1"
        }
      }
    }
  },
  plugins: []
};
