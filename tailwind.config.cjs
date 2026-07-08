module.exports = {
  content: ["./index.html", "./src/**/*.{js,svelte}", "./public/pages/**/*.html"],
  theme: {
    extend: {}
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        oscp: {
          primary: "#dc2626",
          secondary: "#151515",
          accent: "#ef4444",
          neutral: "#0f0f10",
          "neutral-content": "#f5f5f5",
          "base-100": "#1f2023",
          "base-200": "#17181b",
          "base-300": "#2d2f34",
          "base-content": "#e7e7e7",
          info: "#ef4444",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#dc2626"
        }
      }
    ],
    darkTheme: "oscp"
  }
};
