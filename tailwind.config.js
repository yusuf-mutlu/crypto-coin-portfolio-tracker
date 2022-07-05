const defaultTheme = require('tailwindcss/defaultTheme');

const withOpacity =
    (variable) =>
    ({ opacityValue }) =>
        opacityValue === undefined
        ? `rgb(var(${variable}))`
        : `rgb(var(${variable}) / ${opacityValue})`;

const getColorShades = (shades, name = 'primary') =>
    shades.reduce(
        (a, v) => ({ ...a, [v]: withOpacity(`--tw-clr-${name}-${v}`) }),
        {}
    );

module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.js',
    ],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
                primary: ['Roboto', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Customize it on globals.css :root
                primary: getColorShades([50, 100, 200, 300, 400, 500, 600, 700]),
                dark: '#222222',
            },
        },
    },

    plugins: [require('@tailwindcss/forms')],
};
