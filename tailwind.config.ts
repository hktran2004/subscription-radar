import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0e1213",
        paper: "#f5f7fa",
        chase: {
          blue: "#1b5ea1",
          "blue-solid": "#265cb2",
          red: "#9c2016",
          green: "#2a6257",
          chip: "#edf2f8",
          gray: "#444849",
          navy: "#153f82",
          "navy-light": "#1a4590",
        },
      },
    },
  },
  plugins: [],
};

export default config;
