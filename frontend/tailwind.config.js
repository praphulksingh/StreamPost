/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // A dark, modern theme fitting for a video platform
        brand: {
          dark: "#0F0F0F",
          light: "#F1F1F1",
          accent: "#AE7AFF", // A unique purple accent color instead of standard red
          secondary: "#272727",
          text: "#FFFFFF",
          muted: "#AAAAAA"
        }
      }
    },
  },
  plugins: [],
}