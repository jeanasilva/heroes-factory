import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 24px 80px rgba(99, 102, 241, 0.22)'
      },
      backgroundImage: {
        'hero-grid': 'linear-gradient(to right, rgba(148, 163, 184, .12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, .12) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
} satisfies Config;

export default config;
