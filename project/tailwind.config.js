/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'pulse-yellow': {
          '0%': { backgroundColor: '#f6f7ba' }, // light yellow
          '50%': { backgroundColor: '#fbfc8b' }, // darker yellow
          '100%': { backgroundColor: '#f6f7ba' },
        },
      },
      animation: {
        'pulse-yellow': 'pulse-yellow 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
