import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Times New Roman", "Times", "serif"],
        serif: ["Times New Roman", "Times", "serif"],
        times: ["Times New Roman", "Times", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
