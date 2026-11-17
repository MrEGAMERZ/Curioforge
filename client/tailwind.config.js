/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: { deep: '#080C16', base: '#0D1322' },
        surface: { DEFAULT: '#131B2E', raised: '#1A2440', charcoal: '#161922' },
        line: { subtle: '#232D4A', strong: '#34416A' },
        ink: { primary: '#EAEEF9', secondary: '#AAB4D0', muted: '#8490B0' },
        primary: { 400: '#6EA0FF', 500: '#4F8CFF', 600: '#3B6FE0' },
        accent: { 400: '#A78BFA', 500: '#8B5CF6' },
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F87171',
        info: '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px rgba(0,0,0,0.35)',
        elevated: '0 16px 48px rgba(0,0,0,0.5)',
        glow: '0 0 24px rgba(79,140,255,0.25)',
      },
    },
  },
  plugins: [],
}
