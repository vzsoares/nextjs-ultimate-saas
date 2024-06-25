/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',

        // Or if using `src` directory:
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    100: 'var(--primary-color-100)',
                    200: 'var(--primary-color-200)',
                    300: 'var(--primary-color-300)',
                    400: 'var(--primary-color-400)',
                    500: 'var(--primary-color-500)',
                },
            },
        },
    },
    plugins: [],
};
