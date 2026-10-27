/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', md: '1.5rem', xl: '2rem' },
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        canvas: '#FAF8F5',
        surface: '#FFFFFF',
        cream: '#F0E9E1',
        beige: '#D8C9B9',
        ink: '#181715',
        muted: '#77716A',
        line: '#E8E2DC',
        onyx: '#171717',
        clay: '#A2553F',
      },
      fontFamily: {
        sans: [
          'IRANYekanX',
          'IRANYekan',
          'Vazirmatn Variable',
          'Vazirmatn',
          'Tahoma',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        soft: '2px',
      },
      maxWidth: {
        shell: '1280px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(24, 23, 21, 0.04), 0 12px 35px -20px rgba(24, 23, 21, 0.25)',
        drawer: '0 0 60px rgba(24, 23, 21, 0.18)',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1.6' }],
      },
    },
  },
  plugins: [],
};
