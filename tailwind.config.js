/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        kannada: ['Noto Sans Kannada', 'sans-serif'],
      },
      colors: {
        blue: {
          900: '#1a365d',
        },
        amber: {
          600: '#c19a5b',
        },
      },
    },
  },
  plugins: [],
};