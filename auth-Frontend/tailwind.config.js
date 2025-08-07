/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.3s ease-out',
      },
      colors: {
        Beige: "#F3E2D4",
        LightBeige: "#F5F5DC",
        DarkBeige: "#D2B48C",
        Navy : "#415E72",
        Purple: "#6A5ACD",
        LightPurple: "#E6E6FA",
        DarkPurple: "#483D8B",
        offwhite: "#F8F8FF",
        LightGray: "#D3D3D3",
        DarkGray: "#A9A9A9",
        Grey : "#F3E9DC",
        Teal : "#FFEDF3",
        Mint : "#D1D8BE",
        Gray: "#F5F5F5",
        Footer : "#555879",
        Navbar : "#E5E0D8",
    },
  },
},
  plugins: [
    
  ],
}

