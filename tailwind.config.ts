/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cinema-dark': 'var(--cinema-dark)',
        'cinema-surface': 'var(--cinema-surface)',
        'cinema-surface-hover': 'var(--cinema-surface-hover)',
        'cinema-accent': 'var(--cinema-accent)',
        'cinema-accent-dim': 'var(--cinema-accent-dim)',
        'cinema-text': 'var(--cinema-text)',
        'cinema-text-dim': 'var(--cinema-text-dim)',
        'cinema-border': 'var(--cinema-border)',
        'cinema-red': 'var(--cinema-red)',
        'cinema-red-dim': 'var(--cinema-red-dim)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        'curtain-rise': {
          '0%': { opacity: '0', transform: 'translateY(100%) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'film-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'projector-focus': {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.02)', filter: 'brightness(1.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'curtain-rise': 'curtain-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'film-fade': 'film-fade-in 0.6s ease-in-out forwards',
        'projector-focus': 'projector-focus 3s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
}
