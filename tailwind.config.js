/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        // Page canvas — deep enough that white cards separate without heavy shadows
        canvas: '#e8edf5',
        brand: {
          50:  '#fffbf0',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.05), 0 2px 6px rgba(15, 23, 42, 0.06)',
        card: '0 1px 2px rgba(15, 23, 42, 0.06), 0 4px 16px rgba(15, 23, 42, 0.08)',
        lift: '0 4px 10px rgba(15, 23, 42, 0.08), 0 14px 36px rgba(15, 23, 42, 0.12)',
        nav:  '0 1px 0 rgba(15, 23, 42, 0.05), 0 6px 16px rgba(15, 23, 42, 0.07)',
      },
    },
  },
  plugins: [],
}
