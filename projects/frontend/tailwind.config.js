/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-urbanist)'], 
      },
      colors: {
        'brand-background': '#FFF7F4',
        'brand-primary': '#FDE8E0',
        'brand-secondary': '#FFC8B3',
        'brand-orange': '#F39C12',
        'brand-button': '#F5B7B1',
      }
    },
  },
  plugins: [],
}