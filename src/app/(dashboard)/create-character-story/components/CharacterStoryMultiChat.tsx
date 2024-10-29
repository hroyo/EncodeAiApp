'use client';

import { useChat } from 'ai/react';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Box, TextField, Typography, IconButton, Switch, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { ArrowUpFromDot, ArrowRight, ArrowLeft, ImagePlus } from 'lucide-react';
import { Close } from '@mui/icons-material';

export default function CharacterStoryMultiChat() {
    const { messages, input, handleInputChange, handleSubmit, setInput } = useChat({
        api: 'api/multi-chat',
    });
    const [isInitial, setIsInitial] = useState(true); // Track the initial state

    const [files, setFiles] = useState<FileList | undefined>(undefined);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isGuided, setIsGuided] = useState(false); // Track Guided or Not Guided mode
    const [step, setStep] = useState(0); // Track current step

    // Centralized form state for all inputs
    const [formData, setFormData] = useState({
        agentClass: '',
        specialty: '',
        question1: '',
        question2: '',
        question3: '',
        question4: '',
        question5: ''
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            setFiles(selectedFiles);
            const filePreviews = Array.from(selectedFiles).map((file) =>
                URL.createObjectURL(file)
            );
            setPreviews(filePreviews);
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
    };

    // Handle form input changes generically
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNext = () => setStep(prevStep => prevStep + 1);
    const handleBack = () => setStep(prevStep => prevStep - 1);

    const handleGuidedFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Format the form data into a single message string
        const formattedMessage = `Agent Class: ${formData.agentClass}
        Specialized in: ${formData.specialty}
        Agent is in: ${formData.question1}
        Agent objective is: ${formData.question2}
        Agent has an encounter with: ${formData.question3}
        and has told: ${formData.question4}
        Agent distinctive feature is: ${formData.question5}`;

        // Set the formatted message as the input
        setInput(formattedMessage);

        // Submit the input as a regular message
        // handleSubmit(event);

        // Reset form data
        setFormData({
            agentClass: '',
            specialty: '',
            question1: '',
            question2: '',
            question3: '',
            question4: '',
            question5: ''
        });

        // Switch back to Non-Guided Mode
        setIsGuided(false);
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
            <Typography sx={{ fontSize: '24px' }}>
                Can we help you write your Agent origin story?
            </Typography>

            {/* Toggle between Guided Mode and Not Guided Mode */}
            <Box
                sx={{
                    mt: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography sx={{ color: '#6F6F6F', textAlign: 'center' }}>
                    Story Assistant Mode
                </Typography>
                <Switch
                    checked={isGuided}
                    onChange={(event) => {
                        setIsGuided(event.target.checked); // Toggle Guided Mode
                        setStep(0); // Reset to step 0 when toggled
                    }} color="primary"
                />
            </Box>

            {isGuided ? (
                <form onSubmit={handleGuidedFormSubmit} style={{ width: '100%' }}>
                    {/* Step 1: Select Agent Class */}
                    {step === 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography sx={{ mb: 1, color: '#6F6F6F' }}>Agent Class</Typography>
                            <RadioGroup
                                row
                                name="agentClass"
                                value={formData.agentClass}
                                onChange={handleFormChange}
                            >
                                <FormControlLabel
                                    value="Activist"
                                    control={<Radio size="medium" sx={{ color: '#B0B0B0' }} />}
                                    label={<Typography sx={{ fontSize: '14px', color: '#B0B0B0' }}>Activist</Typography>}
                                />
                                <FormControlLabel
                                    value="Scholar"
                                    control={<Radio size="medium" sx={{ color: '#B0B0B0' }} />}
                                    label={<Typography sx={{ fontSize: '14px', color: '#B0B0B0' }}>Scholar</Typography>}
                                />
                                <FormControlLabel
                                    value="Nurturer"
                                    control={<Radio size="medium" sx={{ color: '#B0B0B0' }} />}
                                    label={<Typography sx={{ fontSize: '14px', color: '#B0B0B0' }}>Nurturer</Typography>}
                                />
                                <FormControlLabel
                                    value="Mystic"
                                    control={<Radio size="medium" sx={{ color: '#B0B0B0' }} />}
                                    label={<Typography sx={{ fontSize: '14px', color: '#B0B0B0' }}>Mystic</Typography>}
                                />
                                <FormControlLabel
                                    value="Stormchaser"
                                    control={<Radio size="medium" sx={{ color: '#B0B0B0' }} />}
                                    label={<Typography sx={{ fontSize: '14px', color: '#B0B0B0' }}>Stormchaser</Typography>}
                                />
                                <FormControlLabel
                                    value="Survivor"
                                    control={<Radio size="medium" sx={{ color: '#B0B0B0' }} />}
                                    label={<Typography sx={{ fontSize: '14px', color: '#B0B0B0' }}>Survivor</Typography>}
                                />
                            </RadioGroup>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 8, mt: 2 }}>
                                <IconButton onClick={handleNext}
                                    sx={{
                                        color: '#FFF',
                                        backgroundColor: '#333',
                                        '&:hover': { backgroundColor: '#555' },
                                    }}
                                ><ArrowRight /></IconButton>
                            </Box>
                        </Box>
                    )}

                    {/* Step 2: Select Specialty */}
                    {step === 1 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography sx={{ mb: 1, color: '#6F6F6F' }}>Agent Specialty</Typography>
                            <RadioGroup
                                row
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleFormChange}
                            >
                                <FormControlLabel
                                    value="Beasts"
                                    control={<Radio size="medium" sx={{ color: '#B0B0B0' }} />}
                                    label={<Typography sx={{ fontSize: '14px', color: '#B0B0B0' }}>Beasts</Typography>}
                                />
                                <FormControlLabel
                                    value="Hominids"
                                    control={<Radio size="medium" sx={{ color: '#B0B0B0' }} />}
                                    label={<Typography sx={{ fontSize: '14px', color: '#B0B0B0' }}>Hominids</Typography>}
                                />
                                <FormControlLabel
                                    value="Aquatics"
                                    control={<Radio size="medium" sx={{ color: '#B0B0B0' }} />}
                                    label={<Typography sx={{ fontSize: '14px', color: '#B0B0B0' }}>Aquatics</Typography>}
                                />
                                <FormControlLabel
                                    value="Herpetiles"
                                    control={<Radio size="medium" sx={{ color: '#B0B0B0' }} />}
                                    label={<Typography sx={{ fontSize: '14px', color: '#B0B0B0' }}>Herpetiles</Typography>}
                                />
                                <FormControlLabel
                                    value="Avians"
                                    control={<Radio size="medium" sx={{ color: '#B0B0B0' }} />}
                                    label={<Typography sx={{ fontSize: '14px', color: '#B0B0B0' }}>Avians</Typography>}
                                />
                                <FormControlLabel
                                    value="Insectoids"
                                    control={<Radio size="medium" sx={{ color: '#B0B0B0' }} />}
                                    label={<Typography sx={{ fontSize: '14px', color: '#B0B0B0' }}>Insectoids</Typography>}
                                />
                                <FormControlLabel
                                    value="Draconids"
                                    control={<Radio size="medium" sx={{ color: '#B0B0B0' }} />}
                                    label={<Typography sx={{ fontSize: '14px', color: '#B0B0B0' }}>Draconids</Typography>}
                                />
                            </RadioGroup>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 8, mt: 2 }}>
                                <IconButton onClick={handleBack}
                                    sx={{
                                        color: '#FFF',
                                        backgroundColor: '#333',
                                        '&:hover': { backgroundColor: '#555' },
                                    }}
                                ><ArrowLeft /></IconButton>
                                <IconButton onClick={handleNext}
                                    sx={{
                                        color: '#FFF',
                                        backgroundColor: '#333',
                                        '&:hover': { backgroundColor: '#555' },
                                    }}
                                ><ArrowRight /></IconButton>
                            </Box>
                        </Box>
                    )}

                    {/* Step 3: Answer Questions */}
                    {step === 2 && (
                        <Box sx={{ mt: 3 }}>
                            <TextField
                                name="question1"
                                value={formData.question1}
                                onChange={handleFormChange}
                                placeholder="Where is your Agent now?"
                                fullWidth
                                required
                                sx={{
                                    backgroundColor: '#1E1E1E',
                                    '& input::placeholder': { color: '#B0B0B0', fontSize: '14px' },
                                    borderRadius: '40px',
                                    '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } },
                                }}
                            />
                            <TextField
                                name="question2"
                                value={formData.question2}
                                onChange={handleFormChange}
                                placeholder="What is your Agent after? a creature? an artifact? a goal?"
                                fullWidth
                                required
                                sx=
                                {{
                                    mt: 1,
                                    backgroundColor: '#1E1E1E',
                                    '& input::placeholder': { color: '#B0B0B0', fontSize: '14px' },
                                    borderRadius: '40px',
                                    '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } },
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 8, mt: 2 }}>
                                <IconButton onClick={handleBack}
                                    sx={{
                                        color: '#FFF',
                                        backgroundColor: '#333',
                                        '&:hover': { backgroundColor: '#555' },
                                    }}
                                ><ArrowLeft /></IconButton>
                                <IconButton onClick={handleNext}
                                    sx={{
                                        color: '#FFF',
                                        backgroundColor: '#333',
                                        '&:hover': { backgroundColor: '#555' },
                                    }}
                                ><ArrowRight /></IconButton>
                            </Box>
                        </Box>
                    )}

                    {/* Step 4: More Questions */}
                    {step === 3 && (
                        <Box sx={{ mt: 3 }}>
                            <TextField
                                name="question3"
                                value={formData.question3}
                                onChange={handleFormChange}
                                placeholder="Did your agent have an encounter with an unknown creature?"
                                fullWidth
                                required
                                sx={{
                                    backgroundColor: '#1E1E1E',
                                    '& input::placeholder': { color: '#B0B0B0', fontSize: '14px' },
                                    borderRadius: '40px',
                                    '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } },
                                }}
                            />
                            <TextField
                                name="question4"
                                value={formData.question4}
                                onChange={handleFormChange}
                                placeholder="Who did your agent tell?"
                                fullWidth
                                required
                                sx={{
                                    mt: 1,
                                    backgroundColor: '#1E1E1E',
                                    '& input::placeholder': { color: '#B0B0B0', fontSize: '14px' },
                                    borderRadius: '40px',
                                    '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } },
                                }}
                            />
                            <TextField
                                name="question5"
                                value={formData.question5}
                                onChange={handleFormChange}
                                placeholder="Any distinctive feature? A scar? A nervous gesture?"
                                fullWidth
                                required
                                sx={{
                                    mt: 1,
                                    backgroundColor: '#1E1E1E',
                                    '& input::placeholder': { color: '#B0B0B0', fontSize: '14px' },
                                    borderRadius: '40px',
                                    '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } },
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 8, mt: 2 }}>
                                <IconButton onClick={handleBack}
                                    sx={{
                                        color: '#FFF',
                                        backgroundColor: '#333',
                                        '&:hover': { backgroundColor: '#555' },
                                    }}
                                ><ArrowLeft /></IconButton>
                                <IconButton type="submit"
                                    sx={{
                                        color: '#FFF',
                                        backgroundColor: '#333',
                                        '&:hover': { backgroundColor: '#555' },
                                    }}
                                ><ArrowUpFromDot /></IconButton>
                            </Box>
                        </Box>
                    )}
                </form>
            ) : (
                // Regular chat mode
                <>
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            pb: 12,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        {messages.map((m) => (
                            <Box
                                key={m.id}
                                sx={{
                                    display: 'flex',
                                    p: 2,
                                    mb: 2,
                                    backgroundColor: m.role === 'user' ? '#0A0A0A' : '#222222',
                                    color: '#FFFFFF',
                                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                    borderRadius: '18px',
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.8',
                                        letterSpacing: '0.5px',
                                        fontWeight: 400,
                                        color: m.role === 'user' ? '#D9D9D9' : '#bbbbbb',
                                        maxWidth: '600px',
                                    }}
                                >
                                    {m.content}
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, ml: 2 }}>
                                    {m?.experimental_attachments
                                        ?.filter((attachment) =>
                                            attachment?.contentType?.startsWith('image/')
                                        )
                                        .map((attachment, index) => (
                                            <Image
                                                key={`${m.id}-${index}`}
                                                src={attachment.url}
                                                width={100}
                                                height={100}
                                                alt={attachment.name ?? `attachment-${index}`}
                                            />
                                        ))}
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    <form
                        onSubmit={(event) => {
                            handleSubmit(event, {
                                experimental_attachments: files,
                            });
                            setFiles(undefined);
                            setPreviews([]); // Clear previews after submission
                            setIsInitial(false);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        }}
                        style={{ width: '100%' }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                width: '100%',
                                bottom: isInitial ? '50%' : 30,
                                left: '50%',
                                padding: 2,
                                borderRadius: '48px',
                            }}
                        >
                            <IconButton
                                component="label"
                                sx={{ color: '#FFF', backgroundColor: '#333', '&:hover': { backgroundColor: '#555' } }}
                            >
                                <ImagePlus />
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                    multiple
                                    ref={fileInputRef}
                                />
                            </IconButton>
                            {/* Image Previews */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {previews.map((preview, index) => (
                                    <Box key={index} sx={{ position: 'relative' }}>
                                        <Image
                                            src={preview}
                                            width={100}
                                            height={100}
                                            alt={`preview-${index}`}
                                            style={{ borderRadius: '8px' }}
                                        />
                                        <IconButton
                                            onClick={() => handleRemoveImage(index)}
                                            sx={{
                                                position: 'absolute',
                                                top: -5,
                                                right: -5,
                                                backgroundColor: 'rgba(51, 51, 51, 0.6)', // 80% opacity for background
                                                color: '#FFF',
                                                '&:hover': { backgroundColor: 'rgba(85, 85, 85, 0.6)' }, // 80% opacity on hover
                                                p: 0.5,
                                            }}
                                            size="small"
                                        >
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                            <TextField
                                variant="outlined"
                                value={input}
                                placeholder="Message the Agency"
                                onChange={handleInputChange}
                                multiline
                                maxRows={5}
                                sx={{
                                    backgroundColor: '#1E1E1E',
                                    '& input::placeholder': { color: '#B0B0B0' },
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
                    </form>
                </>
            )}
        </Box>
    );
}
