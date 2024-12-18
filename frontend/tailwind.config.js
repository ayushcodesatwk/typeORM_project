/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      screens: {
        "screen-max-4": { max: "400px" },
        "screen-max-6": { max: "600px" },
        "screen-max-7": { max: "700px" },
        "screen-max-9": { max: "900px" },
        "screen-max-12": { max: "1200px" },
      },
    },
  },
  plugins: [
    // Custom plugin to hide scrollbar
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* Hide scrollbar for Webkit browsers (Chrome, Safari, etc.) */
          "-webkit-overflow-scrolling": "touch",
          "scrollbar-width": "none" /* Hide scrollbar for Firefox */,
          "-ms-overflow-style":
            "none" /* Hide scrollbar for Internet Explorer and Edge */,
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display:
            "none" /* Hide scrollbar for Chrome, Safari, and other Webkit browsers */,
        },
      });
    },
  ],
};
