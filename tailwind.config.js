/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'medai-purple': '#A78BFA',
                'medai-dark': '#030303',
                'secondary': '#A78BFA',
            },
            fontFamily: {
                'display': ['Outfit', 'sans-serif'],
                'body': ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
