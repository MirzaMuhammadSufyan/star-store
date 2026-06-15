/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          medium: "rgba(255, 255, 255, 0.2)",
          dark: "rgba(0, 0, 0, 0.3)",
          border: "rgba(255, 255, 255, 0.125)",
        },
        premium: {
          primary: "#f97316", // Orange is primary now
          purple: "#6366f1",
          pink: "#a855f7",
          orange: "#f97316",
          dark: "#030014",
          surface: {
            light: "#fffbf7", // Warm cream for orange theme
            dark: "#0a0a0c"
          },
          border: {
            light: "rgba(249, 115, 22, 0.1)",
            dark: "rgba(255, 255, 255, 0.08)"
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'orange-glow': 'radial-gradient(circle at center, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
      },
      backdropBlur: {
        xs: '2px',
        xl: '20px',
        '2xl': '40px',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
