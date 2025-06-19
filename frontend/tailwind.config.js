/** @type {import('tailwindcss').Config} */
export default {
   content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
   ],
   theme: {
      extend: {
         colors: {
            primary: {
               DEFAULT: '#FF5722',
               light: '#FF7F50',
               dark: '#E64A19',
            },
            secondary: {
               DEFAULT: '#4CAF50',
               light: '#8BC34A',
               dark: '#388E3C',
            },
            accent: {
               DEFAULT: '#FFC107',
               light: '#FFECB3',
               dark: '#FFA000',
            },
         },
         fontFamily: {
            sans: ['Poppins', 'sans-serif'],
            heading: ['Montserrat', 'sans-serif'],
         },
      },
   },
   plugins: [],
} 