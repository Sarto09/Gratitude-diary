/**
 * Tailwind CSS configuration file
 *
 * This file customises the default Tailwind colour palette
 * to provide a warm and welcoming theme for the gratitude diary.
 *
 * For more information see the Tailwind docs:
 * https://tailwindcss.com/docs/configuration
 */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Override some base colours to create a warm palette
        primary: {
          light: '#fef3c7', // warm yellow
          DEFAULT: '#fcd34d', // gold
          dark: '#d97706' // amber
        },
        secondary: {
          light: '#fde2e4', // blush
          DEFAULT: '#fca5a5', // soft red
          dark: '#ef4444' // red
        },
        accent: {
          light: '#e8eaf6', // lavender
          DEFAULT: '#c5cae9', // pastel purple
          dark: '#8e99f3' // periwinkle
        }
      }
    }
  },
  plugins: [],
};