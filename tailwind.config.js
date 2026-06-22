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
        // Muted clay accent — desaturated from the old neon orange, used sparingly
        orange: {
          50: '#fbf8f5',
          100: '#f3ebe2',
          200: '#e6d3bf',
          300: '#d2b08c',
          400: '#bd8c61',
          500: '#a96f43',
          600: '#925a35',
          700: '#75472a',
          800: '#5c3922',
          900: '#4a2e1c',
          950: '#2c1c11',
        },
        glass: {
          light: "rgba(255, 255, 255, 0.6)",
          medium: "rgba(255, 255, 255, 0.8)",
          dark: "rgba(0, 0, 0, 0.3)",
          border: "rgba(0, 0, 0, 0.06)",
        },
        premium: {
          primary: "#a96f43",
          purple: "#6b7280",
          pink: "#a96f43",
          orange: "#a96f43",
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
        'orange-glow': 'radial-gradient(circle at center, rgba(169, 111, 67, 0.08) 0%, transparent 70%)',
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
