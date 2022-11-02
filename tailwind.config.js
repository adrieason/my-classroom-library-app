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

module.exports = {
  //...
  daisyui: {
    themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"],
  },
}
