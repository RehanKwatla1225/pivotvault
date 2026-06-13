/** @type {import('tailwindcss').Config} */

// Helper to build a color that reads space-separated RGB channels from a CSS var,
// while still supporting Tailwind's opacity suffixes (e.g. bg-surface/60).
const withVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: withVar('--color-bg'),
        surface: withVar('--color-surface'),
        'surface-2': withVar('--color-surface-2'),
        border: withVar('--color-border'),
        accent: withVar('--color-accent'),
        'accent-2': withVar('--color-accent-2'),
        success: withVar('--color-success'),
        warning: withVar('--color-warning'),
        danger: withVar('--color-danger'),
        'text-primary': withVar('--color-text-primary'),
        'text-secondary': withVar('--color-text-secondary'),
        'text-muted': withVar('--color-text-muted'),
        red: withVar('--color-danger'),
        green: withVar('--color-success'),
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        hero: '24px',
        button: '8px',
        badge: '4px',
        modal: '16px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
