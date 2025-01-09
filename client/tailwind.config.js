/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      animation: {
        'wave-float': 'wave-float 8s ease-in-out infinite alternate',
      },
      keyframes: {
        'wave-float': {
          '0%': { transform: 'translateX(-50%) rotate(25deg) scale(1)' },
          '100%': { transform: 'translateX(-50%) rotate(35deg) scale(1.1)' },
        },
      },
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}

