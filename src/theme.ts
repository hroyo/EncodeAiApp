'use client';
import { Montserrat, Poppins, Crimson_Pro } from 'next/font/google';  // Import Crimson Pro
import { createTheme } from '@mui/material/styles';


const montserrat = Montserrat({
    subsets: ['latin'],
});
const poppins = Poppins({
    weight: ['400', '700'], // Specify the required weights
    subsets: ['latin'],
});
const crimsonPro = Crimson_Pro({
    weight: ['400', '600', '700', '800'],
    subsets: ['latin'],
});
const theme = createTheme({
    palette: {
        mode: 'dark', // Set the default mode as 'dark'
        primary: {
            main: 'rgb(144, 202, 249)', // Converted from #90caf9
        },
        secondary: {
            main: 'rgb(103, 58, 183)', // Converted from #673ab7
        },
        background: {
            default: '#131313', // Converted from #121212
            paper: '#0A0A0A', // Already in RGB
        },
        text: {
            primary: 'rgb(255, 255, 255)', // Converted from #ffffff
            secondary: 'rgb(176, 190, 197)', // Converted from #b0bec5
        },
    },
    typography: {
        fontFamily: poppins.style.fontFamily,
        h6: {
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '1px',
        },
        h5: {
            fontSize: '16px',
            fontWeight: 500,
            textTransform: 'capitalize',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1200,
            xl: 1536,
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgb(31 31 31) !important',  // Add custom border
                    // borderBottomWidth: '0.6px', // Add custom border

                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: '57px !important',  // Add custom border

                },
            },
        },
        MuiDrawer: {
            styleOverrides: {

                paper: ({ theme }) =>
                    theme.unstable_sx({
                        borderRight: '1px solid rgb(24, 27, 32)', // Keep the border style

                    }),
            },
        },

        MuiDivider: {
            styleOverrides: {
                root: {
                    // borderRight: '1.2px solid rgb(24 24 24) !important', // Add custom border

                    borderBottom: '1px solid rgb(24 27 32) !important',  // Add custom border

                },
            },
        },
        MuiListItemText: {
            styleOverrides: {

                primary: {
                    fontWeight: 400, // Change font weight for primary text
                    fontSize: '0.8rem', // Change font size for primary text
                },
                secondary: {
                    fontWeight: 400, // Change font weight for secondary text
                    fontSize: '0.8rem', // Adjust secondary font size if needed
                },
            },
        },

        MuiAlert: {
            styleOverrides: {
                root: ({ ownerState }) => ({
                    ...(ownerState.severity === 'info' && {
                        backgroundColor: 'rgb(96, 165, 250)', // Converted from #60a5fa
                    }),
                }),
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#131313', // Custom dark grey hover color
                    },
                },
            },
        },
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#131313', // Custom hover background color for ButtonBase
                    },
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#131313', // Custom hover background color for ListItemButton
                    },
                },
            },
        },

    },
});

export default theme;
