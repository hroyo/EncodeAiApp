"use client";

import React, { useState } from 'react';
import { textToText } from '../../../actions'; // Import your textToText function
import { TextField, Select, MenuItem, Button, Typography, FormControl, InputLabel } from '@mui/material';

export type GenLLMResponse = {
    /**
     * HTTP response content type for this operation
     */
    contentType: string;
    /**
     * HTTP response status code for this operation
     */
    statusCode: number;
    /**
     * Raw HTTP response; suitable for custom response parsing
     */
    rawResponse: Response;
    /**
     * Successful Response
     */
    //@ts-expect-error
    llmResponse?: components.LLMResponse | undefined;
};

const CharacterStoryLivepeer: React.FC = () => {
    const [prompt, setPrompt] = useState<string>(''); // Required prompt field
    const [modelId, setModelId] = useState<string>('gpt-3.5'); // Model ID with restricted options
    const [systemMsg, setSystemMsg] = useState<string>(''); // Optional system message field
    const [temperature, setTemperature] = useState<number>(0.7); // Default temperature, must be a number
    const [maxTokens, setMaxTokens] = useState<number>(256); // Default max tokens, must be an integer
    const [history, setHistory] = useState<string>('[]'); // Optional history field, must be stringified JSON
    const [stream, setStream] = useState<boolean>(false); // Boolean toggle for streaming response
    const [response, setResponse] = useState<string>(''); // Holds the generated text response
    const [error, setError] = useState<string>(''); // Holds any error messages

    // Submit handler to generate the text based on prompt and modelId
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted");

        // Create a FormData object
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('modelId', modelId);
        formData.append('systemMsg', systemMsg);
        formData.append('temperature', temperature.toString());
        formData.append('maxTokens', maxTokens.toString());
        formData.append('history', history);
        formData.append('stream', stream.toString());

        try {
            // Submit the FormData to textToText
            const result: GenLLMResponse | { success: boolean; error: string } = await textToText(formData);

            // Check if the result is a successful GenLLMResponse
            if ('statusCode' in result && result.statusCode === 200 && result.llmResponse) {
                const responseText = result.llmResponse.response || 'No response generated';
                setResponse(responseText); // Set the generated response
            } else if ('error' in result) {
                setError(result.error); // Handle custom error response
            } else {
                setError(`Failed with status code ${result.statusCode}`);
            }
        } catch (err) {
            console.error('Error generating text:', err);
            setError('An unexpected error occurred.');
        }
    };


    // Return JSX to render the form
    return (
        <form onSubmit={handleSubmit}>
            {/* Prompt Field */}
            <FormControl fullWidth margin="normal">
                <TextField
                    id="prompt"
                    label="Prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    multiline
                    required
                    rows={4}
                    variant="outlined"
                />
            </FormControl>

            {/* Model ID Dropdown */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="modelId-label">Model ID</InputLabel>
                <Select
                    labelId="modelId-label"
                    id="modelId"
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                    variant="outlined"
                    required
                >
                    <MenuItem value="gpt-3.5">GPT-3.5</MenuItem>
                    <MenuItem value="gpt-4">GPT-4</MenuItem>
                </Select>
            </FormControl>

            {/* System Message (Optional) */}
            <FormControl fullWidth margin="normal">
                <TextField
                    id="systemMsg"
                    label="System Message (Optional)"
                    value={systemMsg}
                    onChange={(e) => setSystemMsg(e.target.value)}
                    multiline
                    rows={2}
                    variant="outlined"
                />
            </FormControl>

            {/* Temperature Field */}
            <FormControl fullWidth margin="normal">
                <TextField
                    id="temperature"
                    label="Temperature"
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    inputProps={{ step: 0.1, min: 0, max: 1 }}
                    variant="outlined"
                />
            </FormControl>

            {/* Max Tokens Field */}
            <FormControl fullWidth margin="normal">
                <TextField
                    id="maxTokens"
                    label="Max Tokens"
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    inputProps={{ min: 1, max: 2048 }}
                    variant="outlined"
                />
            </FormControl>

            {/* History Field (Optional, passed as JSON string) */}
            <FormControl fullWidth margin="normal">
                <TextField
                    id="history"
                    label="History (Optional, JSON Format)"
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                    multiline
                    rows={3}
                    variant="outlined"
                />
            </FormControl>

            {/* Stream Response */}
            <FormControl fullWidth margin="normal">
                <label>
                    <input
                        type="checkbox"
                        id="stream"
                        checked={stream}
                        onChange={(e) => setStream(e.target.checked)}
                    />
                    Stream Response
                </label>
            </FormControl>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
            >
                Generate Text
            </Button>

            {/* Display Response */}
            {response && (
                <Typography variant="h6" sx={{ marginTop: 4 }}>
                    Generated Text:
                </Typography>
            )}
            {response && (
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                    {response}
                </Typography>
            )}

            {/* Display Error */}
            {error && (
                <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
                    {error}
                </Typography>
            )}
        </form>
    );
};

export default CharacterStoryLivepeer;
