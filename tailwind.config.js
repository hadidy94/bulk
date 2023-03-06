/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            'bm-red': '#d72435',
            'bm-red-600': '#ab1d2a',
            'white': '#ffffff',
            'light-grey': '#f5f5f5',
            'gray': '#F8F4F4',
            'gray-600': '#ced4da',
            'bm-black': '#333333',
            'secondary': '#6c757d',
            'dark-gray': '#B1ACAC',
            'status-gray': '#D9D9D9',
        },
        extend: {},
        container: {
            center: true,
        }
    },
    plugins: [
        require("@tailwindcss/forms"), // eslint-disable-line
      ],
      corePlugins: {
        preflight: true 
      },
}