/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        kannada: ['Noto Sans Kannada', 'sans-serif'],
      },
      colors: {
        blue: {
          900: '#1a365d', // Deep blue
        },
        amber: {
          600: '#c19a5b', // Gold accent
        },
      },
      backgroundColor: {
        dark: '#121212',
        'dark-card': '#1e1e1e',
      },
      textColor: {
        dark: '#e5e5e5',
      },
    },
  },
  plugins: [],
};