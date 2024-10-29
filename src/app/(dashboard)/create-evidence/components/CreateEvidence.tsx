'use client';

import { useState, useTransition } from "react";
import { Box, TextField, Typography, Switch, IconButton, Button } from '@mui/material';
import { ArrowUpFromDot, ArrowRight, ArrowRightToLine, Play } from 'lucide-react';
import LivepeerIcon from '../../../../../public/livepeerIcon.svg'

export default function GuidedTextToImage() {
    const [isGuided, setIsGuided] = useState(false);
    const [isAdvanced, setIsAdvanced] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    // Form state
    const [formData, setFormData] = useState({
        prompt: "",
        modelId: "black-forest-labs/FLUX.1-schnell",
        width: 512,
        height: 512,
        guidanceScale: 7.5,
        negativePrompt: "",
        safetyCheck: true,
        numInferenceSteps: 50,
        numImagesPerPrompt: 1,
    });

    // Guided questions state
    const [guidanceAnswers, setGuidanceAnswers] = useState({
        evidenceType: '',
        setting: '',
        medium: ''
    });

    const [step, setStep] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGuidanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGuidanceAnswers((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGuidedNext = () => {
        if (step < 2) {
            setStep(step + 1);
        } else {
            // Generate the prompt from answers
            const generatedPrompt = `Generate an image of ${guidanceAnswers.evidenceType} found in ${guidanceAnswers.setting}. It should evoke the feel of ${guidanceAnswers.medium}.`;
            setFormData((prev) => ({
                ...prev,
                prompt: generatedPrompt.trim(),
            }));
            // Reset guidance state
            setGuidanceAnswers({
                evidenceType: '',
                setting: '',
                medium: ''
            });
            setStep(0); // Reset step for future use
            setIsGuided(false); // Turn off guided mode
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Generate a dynamic seed
        const dynamicSeed = Math.floor(Math.random() * 10000);

        // Create a payload for the request
        const payload = {
            ...formData,
            seed: dynamicSeed.toString(),
        };

        startTransition(async () => {
            try {
                const response = await fetch('/api/textToImage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorBody = await response.json();
                    console.error("Error response:", errorBody);
                    throw new Error(errorBody.error || "Something went wrong");
                }

                const result = await response.json();
                if (result.success) {
                    setGeneratedImages((prev) => [...prev, ...result.images]);
                } else {
                    console.error("Failed to generate images:", result.error);
                }
            } catch (error) {
                console.error("Error generating image:", error);
            }
        });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '800px',
                py: 6,
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
            }}
        >
            <Typography sx={{ fontSize: '24px' }}>Can we help you produce an evidence for your story?</Typography>
            {/* <Typography sx={{ color: '#6F6F6F' }}>Tips: You can even upload your Agent picture</Typography> */}

            <Box
                sx={{
                    mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', // Center the content vertically (optional)
                }}>
                <Typography sx={{ color: '#6F6F6F', textAlign: 'center' }}> {/* Center text */}
                    Assistant Mode
                </Typography>
                <Switch
                    color="primary"
                    checked={isGuided} onChange={(e) => setIsGuided(e.target.checked)} />
            </Box>

            {isGuided ? (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', // Center the content horizontally
                        gap: 2,
                        width: '100%',
                        padding: 2,
                        borderRadius: '48px',
                    }}
                >
                    {step === 0 && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column', // Stack title and input section vertically
                                alignItems: 'center', // Center the title and input horizontally
                                gap: 1, // Adjust gap between title and input section
                                // maxWidth: '600px',
                                width: '100%',
                                // padding: 2,
                                borderRadius: '48px',
                            }}
                        >
                            <Typography variant="h6" align="center">What have you found?</Typography>
                            <Typography align="center" sx={{ color: '#6F6F6F' }}>Ex: a footprint? a sample of blood? an item or an object?  </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    // maxWidth: '600px',
                                    width: '100%',
                                    // position: 'fixed',
                                    // bottom: isInitial ? '50%' : 30, // Center the chat initially, then move it to the bottom
                                    left: '50%',
                                    // transform: 'translateX(-40%)',
                                    padding: 2,
                                    borderRadius: '48px',
                                }}
                            >
                                <TextField
                                    name="evidenceType"
                                    value={guidanceAnswers.evidenceType}
                                    onChange={handleGuidanceChange}
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#1E1E1E',
                                        '& input::placeholder': { color: '#B0B0B0', fontSize: '14px' },
                                        borderRadius: '40px',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { border: 'none' },
                                        },
                                    }}
                                />
                                <IconButton
                                    onClick={handleGuidedNext}
                                    sx={{
                                        color: '#FFF',
                                        backgroundColor: '#333',
                                        '&:hover': { backgroundColor: '#555' },
                                    }}
                                >
                                    <ArrowRight />
                                </IconButton>
                            </Box>
                        </Box>

                    )}
                    {step === 1 && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column', // Stack title and input section vertically
                                alignItems: 'center', // Center the title and input horizontally
                                gap: 1, // Adjust gap between title and input section
                                // maxWidth: '600px',
                                width: '100%',
                                // padding: 2,
                                borderRadius: '48px',
                            }}
                        >
                            <Typography variant="h6">When and where did you find it?</Typography>
                            <Typography align="center" sx={{ color: '#6F6F6F' }}>Ex: was it dark? on a damaged wooden floor? or in heavy snow?  </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    // maxWidth: '600px',
                                    width: '100%',
                                    // position: 'fixed',
                                    // bottom: isInitial ? '50%' : 30, // Center the chat initially, then move it to the bottom
                                    left: '50%',
                                    // transform: 'translateX(-40%)',
                                    padding: 2,
                                    borderRadius: '48px',
                                }}
                            >
                                <TextField
                                    name="setting"
                                    value={guidanceAnswers.setting}
                                    onChange={handleGuidanceChange}
                                    variant="outlined"
                                    fullWidth
                                    sx={{

                                        backgroundColor: '#1E1E1E',
                                        '& input::placeholder': { color: '#B0B0B0', fontSize: '14px' },
                                        width: '100%',
                                        borderRadius: '40px',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { border: 'none' },
                                        },
                                    }}
                                />
                                <IconButton
                                    onClick={handleGuidedNext}
                                    sx={{
                                        color: '#FFF',
                                        backgroundColor: '#333',
                                        '&:hover': { backgroundColor: '#555' },
                                    }}
                                >
                                    <ArrowRight />
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                    {step === 2 && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column', // Stack title and input section vertically
                                alignItems: 'center', // Center the title and input horizontally
                                gap: 1, // Adjust gap between title and input section
                                // maxWidth: '600px',
                                width: '100%',
                                // padding: 2,
                                borderRadius: '48px',
                            }}
                        >
                            <Typography variant="h6">What is your device?</Typography>
                            <Typography align="center" sx={{ color: '#6F6F6F' }}>Ex: is this photograph with a subtle celluloid film texture? or a sketch?</Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    // maxWidth: '600px',
                                    width: '100%',
                                    // position: 'fixed',
                                    // bottom: isInitial ? '50%' : 30, // Center the chat initially, then move it to the bottom
                                    left: '50%',
                                    // transform: 'translateX(-40%)',
                                    padding: 2,
                                    borderRadius: '48px',
                                }}
                            >
                                <TextField
                                    name="medium"
                                    value={guidanceAnswers.medium}
                                    onChange={handleGuidanceChange}
                                    variant="outlined"
                                    fullWidth
                                    sx={{

                                        backgroundColor: '#1E1E1E',
                                        '& input::placeholder': { color: '#B0B0B0', fontSize: '14px' },
                                        width: '100%',
                                        borderRadius: '40px',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { border: 'none' },
                                        },
                                    }}
                                />
                                <IconButton
                                    onClick={handleGuidedNext}
                                    sx={{
                                        color: '#FFF',
                                        backgroundColor: '#333',
                                        '&:hover': { backgroundColor: '#555' },
                                    }}
                                >
                                    <ArrowRightToLine />
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                </Box>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    style={{ width: '100%' }}

                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center', // Center the content horizontally
                            gap: 2,
                            width: '100%',
                            padding: 2,
                            borderRadius: '48px',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                // maxWidth: '600px',
                                width: '100%',
                                justifyContent: 'center',

                                // position: 'fixed',
                                // bottom: isInitial ? '50%' : 30, // Center the chat initially, then move it to the bottom
                                // left: '50%',
                                // transform: 'translateX(-40%)',
                                padding: 2,
                                borderRadius: '48px',
                            }}
                        >
                            <TextField
                                // label="Prompt"
                                variant="outlined"
                                fullWidth
                                name="prompt"
                                value={formData.prompt}
                                onChange={handleChange}
                                required
                                multiline // Enable multiline mode
                                rows={1} // Set the initial number of visible lines
                                maxRows={4} // Set the maximum number of lines to expand
                                sx={{

                                    backgroundColor: '#1E1E1E',
                                    '& input::placeholder': { color: '#B0B0B0', fontSize: '14px' },
                                    width: '100%',
                                    borderRadius: '40px',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { border: 'none' },
                                    },
                                }}
                            />
                            <IconButton
                                type="submit"
                                sx={{
                                    color: '#FFF',
                                    backgroundColor: '#333',
                                    '&:hover': { backgroundColor: '#555' },
                                }}
                            >
                                <ArrowUpFromDot />
                            </IconButton>
                        </Box>

                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '16px',
                        }}
                    >
                        <Typography variant="body2" component="p" sx={{ marginRight: '8px', opacity: "0.7", }}>
                            Powered by
                        </Typography>
                        <LivepeerIcon />
                    </Box>
                    <Box
                        sx={{
                            mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', // Center the content vertically (optional)
                        }}>
                        <Typography sx={{ color: '#6F6F6F', textAlign: 'center' }}>Advanced Settings</Typography>

                        <Switch checked={isAdvanced} onChange={(e) => setIsAdvanced(e.target.checked)} />
                    </Box>

                    {isAdvanced && (
                        <>
                            {['modelId', 'width', 'height', 'guidanceScale', 'negativePrompt', 'numInferenceSteps', 'numImagesPerPrompt'].map((field) => (
                                <TextField
                                    key={field}
                                    label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                    variant="outlined"
                                    fullWidth
                                    name={field}
                                    type={['width', 'height', 'guidanceScale', 'numInferenceSteps', 'numImagesPerPrompt'].includes(field) ? 'number' : 'text'}
                                    value={formData[field as keyof typeof formData]}
                                    onChange={handleChange}
                                    sx={{
                                        backgroundColor: '#1E1E1E',
                                        '& input::placeholder': { color: '#B0B0B0', fontSize: '14px' },
                                        width: '40%',
                                        borderRadius: '40px',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { border: 'none' },
                                        },
                                        mb: 2, // Add margin-bottom for spacing between fields

                                    }}
                                />
                            ))}
                        </>
                    )}


                </form>
            )}

            {/* Render generated images */}
            <Box sx={{ mt: 4 }}>
                {generatedImages.length > 0 &&

                    <Typography sx={{ color: '#6F6F6F', textAlign: 'center' }}>Generated Images:</Typography>}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                    {generatedImages.map((imageSrc, index) => (
                        <Box key={index} sx={{ width: '100px', height: '100px' }}>
                            <img
                                src={imageSrc}
                                alt={`Generated image ${index}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
