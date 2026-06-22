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
        // Royal indigo brand accent. Kept the key name "orange" so every
        // existing orange-* class across the app picks this up without
        // touching every component.
        orange: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        glass: {
          light: "rgba(255, 255, 255, 0.6)",
          medium: "rgba(255, 255, 255, 0.8)",
          dark: "rgba(0, 0, 0, 0.3)",
          border: "rgba(0, 0, 0, 0.06)",
        },
        premium: {
          primary: "#4f46e5",
          purple: "#4f46e5",
          pink: "#4f46e5",
          orange: "#4f46e5",
          dark: "#0c0c0d",
          surface: {
            light: "#fafaf9",
            dark: "#0c0c0d"
          },
          border: {
            light: "rgba(0, 0, 0, 0.06)",
            dark: "rgba(255, 255, 255, 0.07)"
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'orange-glow': 'radial-gradient(circle at center, rgba(79, 70, 229, 0.10) 0%, transparent 70%)',
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
