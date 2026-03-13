/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Egyptian Gold Palette
        gold: {
          50: '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFD040',
          500: '#D4AF37', // Main Egyptian Gold
          600: '#B8942F',
          700: '#9A7B26',
          800: '#7C631E',
          900: '#5E4A16',
        },
        // Egyptian Blue (Lapis Lazuli)
        lapis: {
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#1E5AAF', // Main Egyptian Blue
          600: '#184A8F',
          700: '#123A6F',
          800: '#0C2A4F',
          900: '#061A2F',
        },
        // Papyrus/Sand colors
        papyrus: {
          50: '#FDFBF7',
          100: '#FAF6ED',
          200: '#F5ECDB',
          300: '#EFE2C9',
          400: '#E9D8B7',
          500: '#D4C4A1', // Main Papyrus
          600: '#BFB08D',
          700: '#A99B79',
          800: '#8A7D62',
          900: '#6B5F4A',
        },
        // Nile Water
        nile: {
          50: '#E6F7F7',
          100: '#CCF0F0',
          200: '#99E0E0',
          300: '#66D1D1',
          400: '#33C1C1',
          500: '#2AA3A3', // Main Nile
          600: '#228585',
          700: '#1A6666',
          800: '#114848',
          900: '#092929',
        },
        // Egyptian Red (Terracotta)
        terracotta: {
          50: '#FFF0ED',
          100: '#FFE0DB',
          200: '#FFC2B8',
          300: '#FFA394',
          400: '#FF8571',
          500: '#C45C4D', // Main Terracotta
          600: '#A34D40',
          700: '#823E33',
          800: '#612E26',
          900: '#401F19',
        },
        // Dark backgrounds (like tomb walls)
        tomb: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#434343',
          600: '#333333',
          700: '#262626',
          800: '#1A1A1A',
          900: '#0D0D0D',
        },
      },
      fontFamily: {
        'egyptian': ['Cinzel', 'serif'],
        'body': ['Noto Sans', 'sans-serif'],
      },
      backgroundImage: {
        'hieroglyph-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'pyramid-gradient': 'linear-gradient(135deg, #1A1A1A 0%, #262626 50%, #1A1A1A 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
        'nile-gradient': 'linear-gradient(180deg, #1E5AAF 0%, #2AA3A3 100%)',
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(212, 175, 55, 0.39)',
        'gold-lg': '0 10px 40px 0 rgba(212, 175, 55, 0.5)',
        'tomb': '0 4px 20px 0 rgba(0, 0, 0, 0.5)',
        'inner-gold': 'inset 0 2px 4px 0 rgba(212, 175, 55, 0.25)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'typing': 'typing 1.4s infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'typing': {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 1 },
        },
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
