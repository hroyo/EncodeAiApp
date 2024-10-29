// import TextToImagePage from './components/img-to-img';
import { Box } from '@mui/material';
// import CharacterStoryLivepeer from './components/CharacterStoryLivepeer';  // Import your component
// import CharacterStory from './components/CharacterStoryOpenAi';  // Import your component
import CharacterStory from './components/CharacterStoryVercel';  // Import your component
// import RagStory from './components/RAGStory';  // Import your component

import CharacterStoryMultiChat from './components/CharacterStoryMultiChat';  // Import your component

const AgentStory: React.FC = () => {
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
            {/* <CharacterStoryLivepeer /> */}
            {/* <CharacterStory /> */}
            <CharacterStoryMultiChat />

            {/* <TextToImagePage /> */}
        </Box>
    );
}

export default AgentStory;
