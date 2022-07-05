require('./bootstrap');

import React from 'react';
import { render } from 'react-dom';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#FFFFFF',
        },
        secondary: {
            main: '#FFFFFF',
        },
        divider: '#eff2f5',
    },
    components: {
        // Name of the component
        MuiButton: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    border: '1px solid #000000DE',
                    color: '#000000DE',
                    '&:hover' : {
                        border: '1px solid #000000DE',
                    }
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                // Name of the slot
                root: {
                    color: '#000000DE !important'
                },

            },
        },
    },
});

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => require(`./Pages/${name}`),
    setup({ el, App, props }) {
        return render(
            <ThemeProvider theme={theme}>
                <App {...props} />
            </ThemeProvider>,
            el
        );
    },
});

InertiaProgress.init({ color: '#4B5563' });
