/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          medium: "rgba(255, 255, 255, 0.2)",
          dark: "rgba(0, 0, 0, 0.3)",
          border: "rgba(255, 255, 255, 0.125)",
        },
        premium: {
          purple: "#6366f1",
          pink: "#a855f7",
          dark: "#030014"
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      backdropBlur: {
        xs: '2px',
        xl: '20px',
        '2xl': '40px',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
