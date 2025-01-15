/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arial: ['Arial', 'sans-serif'],
        courier: ['Courier New', 'monospace'],
        quicksand: ['Quicksand Variable', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat Variable', 'sans-serif'], // Ensure this line exists
      },
    },
  },
  plugins: [],
}