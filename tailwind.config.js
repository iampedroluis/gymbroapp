/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ios: {
          blue: "#007AFF",
          lightBlue: "#5AC8FA",
          green: "#34C759",
          orange: "#FF9500",
          red: "#FF3B30",
          gray: {
            50: "#F2F2F7",
            100: "#E5E5EA",
            200: "#D1D1D6",
            300: "#C7C7CC",
            400: "#AEAEB2",
            500: "#8E8E93",
            600: "#636366",
            700: "#48484A",
            800: "#3A3A3C",
            900: "#1C1C1E",
          },
        },
      },
      fontFamily: {
        ios: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        ios: "10px",
        "ios-lg": "16px",
      },
      boxShadow: {
        ios: "0 2px 10px 0 rgba(0, 0, 0, 0.08)",
        "ios-lg": "0 8px 30px 0 rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
