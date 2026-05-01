/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'monospace']
      },
      boxShadow: {
        lab: '0 18px 60px rgba(2, 6, 23, 0.14)'
      }
    }
  },
  plugins: []
};
