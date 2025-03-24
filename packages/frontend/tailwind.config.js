/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base colors
        app: 'var(--bg-app)',
        'surface-light': 'var(--bg-surface-light)',
        'surface-dark': 'var(--bg-surface-dark)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        border: 'var(--border-color)',

        // Accent colors
        'primary-light': 'var(--primary-light)',
        'primary-dark': 'var(--primary-dark)',
        'secondary-light': 'var(--secondary-light)',
        'secondary-dark': 'var(--secondary-dark)',

        // Semantic colors
        'success-light': 'var(--success-light)',
        'success-dark': 'var(--success-dark)',
        'error-light': 'var(--error-light)',
        'error-dark': 'var(--error-dark)',
        'warning-light': 'var(--warning-light)',
        'warning-dark': 'var(--warning-dark)',
        'info-light': 'var(--info-light)',
        'info-dark': 'var(--info-dark)',
      },
    },
  },
  plugins: [],
};
