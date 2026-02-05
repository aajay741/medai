/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'comedy-red': '#FF3366',
                'comedy-purple': '#9333EA',
                'comedy-gold': '#FFB800',
                'stage-dark': '#0A0A0A',
            },
            fontFamily: {
                'display': ['Outfit', 'sans-serif'],
                'body': ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
