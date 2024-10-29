'use client';

import { Box, TextField, Typography, Paper, Button } from '@mui/material';
import { useChat } from 'ai/react';

export default function CharacterStory() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: 'api/chat'
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '400px',
                py: 6,
                mx: 'auto',
                minHeight: '100vh'
            }}
        >
            <Box sx={{ flexGrow: 1 }}>
                {messages.map((m) => (
                    <Paper
                        key={m.id}
                        sx={{
                            p: 2,
                            mb: 2,
                            backgroundColor: m.role === 'user' ? '#f0f0f0' : '#e0f7fa',
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ whiteSpace: 'pre-wrap' }}
                        >
                            {m.role === 'user' ? 'User: ' : 'AI: '}
                            {m.content}
                        </Typography>
                    </Paper>
                ))}
            </Box>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={input}
                    placeholder="Say something..."
                    onChange={handleInputChange}
                    sx={{ position: 'fixed', bottom: 16, width: '100%', maxWidth: '400px', mb: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ display: 'none' }}
                >
                    Submit
                </Button>
            </form>
        </Box>
    );
}
