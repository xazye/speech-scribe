/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
      "primary": {'50': '#eafff7',
        '100': '#cbffe9',
        '200': '#9dfdd9',
        '300': '#5df8c6',
        '400': '#16dea5',
        '500': '#00d09a',
        '600': '#00aa7f',
        '700': '#008869',
        '800': '#006b54',
        '900': '#005847',
        '950': '#003229',},
        "background": "#111213",
        "secondary": "#EF8354",
      },
      fontFamily: {
        sans: ['Barlow'],
      },
      fontSize:{
        "title":"3rem",
        "body":"1rem",
        "small":"0.7rem",
      },
      boxShadow: {
        'button': 'rgb(0, 0, 0) 0px 10px 13px -7px, 1px 1px 20px 3px rgba(239,131,84,0.27)',
      }
    },
  },
  plugins: [],
}