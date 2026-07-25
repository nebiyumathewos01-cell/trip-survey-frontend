/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Sora', 'system-ui', 'sans-serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      colors: {
        // Gold is now the primary brand color
        brand: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Keep a secondary accent (deep green for contrast)
        accent: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
      },
      boxShadow: {
        'glow-brand': '0 0 40px -8px rgba(245,158,11,0.50)',
        'glow-gold':  '0 0 30px -6px rgba(251,191,36,0.45)',
        'card':       '0 4px 24px -4px rgba(0,0,0,0.10)',
        'card-hover': '0 20px 60px -12px rgba(0,0,0,0.22)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg,#451a03 0%,#78350f 50%,#0a2e1a 100%)',
      },
      animation: {
        'fade-up':   'fadeUp 0.65s ease-out both',
        'fade-in':   'fadeIn 0.5s ease-out both',
        float:       'float 4s ease-in-out infinite',
        shimmer:     'shimmer 1.6s linear infinite',
      },
      keyframes: {
        fadeUp:  { '0%': { opacity:'0', transform:'translateY(28px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        fadeIn:  { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
        float:   { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-12px)' } },
        shimmer: { '0%': { backgroundPosition:'-200% 0' }, '100%': { backgroundPosition:'200% 0' } },
      },
    },
  },
  plugins: [],
}
