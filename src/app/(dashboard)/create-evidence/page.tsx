import TextToImagePage from './components/CreateEvidence';
import { Box } from '@mui/material';

const TextPage: React.FC = () => {
    return (
        <Box
            sx={{
                // display: 'flex', 
                // justifyContent: 'center', 
                // alignItems: 'center', 
                // minHeight: '100vh', 
                // bgcolor: 'background.default', 
                // p: 2 
            }}
        >
            <TextToImagePage />
        </Box>
    );
}

export default TextPage;
