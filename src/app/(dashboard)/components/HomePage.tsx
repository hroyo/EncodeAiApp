"use client";

import { Box, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";
// import ActionsPageContainer from '../../../components/ActionsPageContainer';

export default function HomePage() {
    const theme = useTheme(); // Access the current theme

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={4}
            paddingY={8}
            paddingX={4}
        >
            {/* <ActionsPageContainer /> */}


        </Box>
    );
}
