import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'; // Import Box
import HomePage from './components/HomePage';
// import ActionsPageContainer from './components/ActionsPageContainer';

export default function Page() {
    return (
        <Box
            display="flex"
            flexDirection="column"
        // gap={4}
        // paddingY={8}
        // paddingX={4}
        >
            {/* <ActionsPageContainer /> */}

            <HomePage />
        </Box>
    );
}
