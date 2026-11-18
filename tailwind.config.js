/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#102D26",
          dark: "#0b201b",
          light: "#174638"
        },
        deepGreen: "#174638",
        emerald: {
          DEFAULT: "#1F8A63",
          hover: "#187050",
          light: "#e2f5ed"
        },
        mint: {
          DEFAULT: "#80C9A4",
          light: "#d1eedf"
        },
        neutralWarm: "#F3F6F1",
        charcoal: {
          DEFAULT: "#202B27",
          light: "#46554F",
          muted: "#71837C"
        },
        cpcb: {
          good: "#1F8A63",
          satisfactory: "#80C9A4",
          moderate: "#E5A823",
          poor: "#E67E22",
          veryPoor: "#C0392B",
          severe: "#7D1F2D"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        card: "1rem"
      }
    }
  },
  plugins: []
};
