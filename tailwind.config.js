/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./_includes/**/*.{html,js}",
    "./_layouts/**/*.{html,js}",
    "./_posts/**/*.{md,html}",
    "./*.{html,md,js}",
    "./assets/**/*.{js,html}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#000000',
        'brand-white': '#ffffff',
        'brand-gray': '#f5f5f5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      spacing: {
        'gr-quarter': '0.382rem', // ~6px
        'gr-half': '0.618rem',    // ~10px
        'gr-1': '1rem',           // 16px (Base)
        'gr-2': '1.618rem',       // ~26px
        'gr-3': '2.618rem',       // ~42px
        'gr-4': '4.236rem',       // ~68px
        'gr-5': '6.854rem',       // ~110px
      },
      fontSize: {
        'gr-base': '1rem',              // 16px
        'gr-lg': ['1.618rem', '1.618'], // ~26px
        'gr-xl': ['2.618rem', '1.3'],   // ~42px
        'gr-2xl': ['4.236rem', '1.2'],  // ~68px
        'gr-3xl': ['6.854rem', '1.1'],  // ~110px
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
