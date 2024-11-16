/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        creepster: ['Creepster', 'cursive'], // Add the Creepster font
        Roboto: ['Roboto']
      },},
    },
  plugins: [],
}