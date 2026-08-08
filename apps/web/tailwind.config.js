/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        altix: {
          green: '#00C853',
          'green-light': '#00E676',
          'green-dark': '#008F5A',
          offline: '#FF3B30',
          warning: '#FFC107',
          bg: '#0F172A',
          card: '#111827',
          border: 'rgba(255, 255, 255, 0.08)',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 200, 83, 0.25)',
        'glow-offline': '0 0 20px rgba(255, 59, 48, 0.25)',
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        '.glass-card': {
          '@apply bg-altix-bg/70 backdrop-blur-xl border border-white/10 rounded-xl shadow-glow': {},
        },
      });
    },
  ],
};
