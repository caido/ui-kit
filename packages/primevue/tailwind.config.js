import tailwindcssPrimeui from 'tailwindcss-primeui';
import tailwindcssCaido from '@caido/tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{vue,js,ts}",
    "./src/stories/**/*.{vue,js,ts}",
  ],
  darkMode: ['selector','[class*=htw-dark]'],
  plugins: [
    tailwindcssPrimeui,
    tailwindcssCaido
  ],
}

