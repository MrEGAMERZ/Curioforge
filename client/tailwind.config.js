/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple HIG Light Theme — matches Stitch design
        curio: {
          bg: '#FFFFFF',
          'bg-alt': '#F5F5F7',
          'bg-card': '#FFFFFF',
          'bg-input': '#F5F5F7',
          border: '#D2D2D7',
          'border-focus': '#007AFF',
          text: '#1D1D1F',
          'text-secondary': '#6E6E73',
          'text-muted': '#98989D',
          blue: '#007AFF',
          'blue-hover': '#0066D6',
          'blue-light': '#E8F2FF',
          green: '#34C759',
          'green-light': '#E8F9EE',
          orange: '#FF9F0A',
          'orange-light': '#FFF4E0',
          red: '#FF3B30',
          purple: '#AF52DE',
          'purple-light': '#F4EAFF',
          yellow: '#FFD60A',
          'yellow-light': '#FFFAE0',
        },
        // Legacy dark theme aliases kept for any remaining dark components
        bg: { deep: '#080C16', base: '#0D1322' },
        surface: { DEFAULT: '#131B2E', raised: '#1A2440', charcoal: '#161922' },
        line: { subtle: '#232D4A', strong: '#34416A' },
        ink: { primary: '#EAEEF9', secondary: '#AAB4D0', muted: '#8490B0' },
        primary: { 400: '#6EA0FF', 500: '#007AFF', 600: '#0066D6' },
        accent: { 400: '#A78BFA', 500: '#8B5CF6' },
        success: '#34C759',
        warning: '#FF9F0A',
        danger: '#FF3B30',
        info: '#007AFF',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', '"SF Mono"', '"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
        elevated: '0 8px 32px rgba(0,0,0,0.12)',
        input: '0 1px 2px rgba(0,0,0,0.04)',
        'blue-glow': '0 0 0 3px rgba(0,122,255,0.2)',
        'mic-active': '0 0 0 6px rgba(0,122,255,0.15), 0 0 20px rgba(0,122,255,0.3)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      animation: {
        'voice-ring': 'voice-ring 1.5s ease-in-out infinite',
        'fade-up': 'fade-up 0.3s ease-out',
        'slide-in': 'slide-in 0.25s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        'voice-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.12)', opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
