/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

  ],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "background-color": "#26292E",
          "color":"#FFFFFF"
        },
      },
    ],
  },

  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}
