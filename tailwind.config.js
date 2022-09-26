/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.ejs'],
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
  //...
  plugins: [require("daisyui")],
}