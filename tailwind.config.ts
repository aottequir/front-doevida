import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        doevida: {
          pink: "#FFE7F6",
          pinkLight: "#FFF4FB",
          pinkDark: "#F7CFEA",
          red: "#CF0000",
          redHover: "#B30000",
          redDark: "#8F0000",
          card: "#FFFFFF",
          accent: "#FF4D4D",
        },
      },
      fontFamily: {
        serif: ["var(--font-roboto-serif)", "serif"],
        sans: ["var(--font-roboto-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'soft-red': '0 8px 30px rgba(207, 0, 0, 0.12)',
        'soft-pink': '0 8px 30px rgba(255, 231, 246, 0.6)',
        'elevated': '0 12px 40px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'heartbeat': 'heartbeat 1.8s ease-in-out infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.08)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
