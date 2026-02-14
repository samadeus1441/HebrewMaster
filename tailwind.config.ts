import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Jerusalem Premium Palette
        'hm-blue': '#001B4D',        // Biblical Blue - primary
        'hm-blue-light': '#002b7a',  // Hover state
        'hm-stone': '#CFBA8C',       // Jerusalem Stone - accent
        'hm-parchment': '#FBF3D4',   // Parchment - reading bg
        'hm-gold': '#9BAB16',        // Ancient Gold - achievements
        'hm-bg': '#FAFAF8',          // Main background
        'hm-bg-warm': '#F5F0E8',     // Warm background
        'hm-text': '#1a1a1a',        // Primary text
        'hm-text-muted': '#6b7280',  // Muted text
        'hm-border': '#e5e2db',      // Borders
        'hm-success': '#059669',     // Success green
        'hm-error': '#dc2626',       // Error red
        'hm-warning': '#d97706',     // Warning amber
      },
      fontFamily: {
        'serif': ['"Fraunces"', 'Georgia', 'serif'],
        'hebrew': ['"Noto Sans Hebrew"', '"Noto Serif Hebrew"', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-logical'),
  ],
}

export default config
