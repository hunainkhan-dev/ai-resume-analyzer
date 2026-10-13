/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B1020',
        panel: '#121A33',
        line: '#24314F',
        ink: '#E8EDF9',
        muted: '#8C97B4',
        brand: { DEFAULT: '#6366F1', light: '#818CF8' },
        good: '#34D399',
        warn: '#FBBF24',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeup: { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'none' } },
        blink: { '0%,100%': { opacity: '.2' }, '50%': { opacity: '1' } },
      },
      animation: {
        fadeup: 'fadeup .6s cubic-bezier(.2,.8,.2,1) both',
        blink: 'blink 1.2s infinite',
      },
    },
  },
  plugins: [],
};
