// import TextToImagePage from './components/img-to-img';
import { Box } from '@mui/material';
import CharacterProfilePicture from './components/CharacterProfilePicture';  // Import your component

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
            <CharacterProfilePicture />  {/* Add your component here */}

            {/* <TextToImagePage /> */}
        </Box>
    );
}

export default TextPage;
