import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { forest: "#21843a", ink: "#13212d", cream: "#f8f6f0" } } },
  plugins: []
} satisfies Config;
