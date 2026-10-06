/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        'soft-bg': '#FAFAF8',
        border: '#E6E4DF',
        'text-main': '#14171F',
        'text-muted': '#5B6270',
        accent: {
          DEFAULT: '#C9622F',
          hover: '#B35528',
        },
        'dark-panel': '#0F1522',
        success: '#2F7D5B',
        danger: '#B4412F',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'button': '6px',
        'input': '6px',
        'card': '8px',
      },
    },
  },
  plugins: [],
}
