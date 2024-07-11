import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow:{
        'outer':'10px 10px 50px rgba(204, 197, 185, 0.5)',
        'inner':'inset 10px 10px 50px rgba(204, 197, 185, 0.5)',
      }
    },
  },
  plugins: [
  ],
  darkMode:'class'
}

