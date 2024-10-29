'use client';

import { useChat } from 'ai/react';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Box, TextField, Typography, Button, InputAdornment, IconButton, Switch, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { ArrowUpFromDot, ArrowRight, ArrowLeft, ImagePlus, Play, } from 'lucide-react';

export default function CharacterStoryMultiChat() {
    const { messages, input, handleInputChange, handleSubmit, setInput } = useChat({
        api: 'api/multi-chat',
    });

    const [files, setFiles] = useState<FileList | undefined>(undefined);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isInitial, setIsInitial] = useState(true); // Track the initial state
    const [isGuided, setIsGuided] = useState(false); // Track Guided or Not Guided mode
    const [specialty, setSpecialty] = useState(""); // State to track selected specialty
    const [agentClass, setAgentClass] = useState(""); // State to track selected specialty
    const [step, setStep] = useState(0); // Track current step

    // Track form inputs across steps
    const [question1, setQuestion1] = useState("");
    const [question2, setQuestion2] = useState("");
    const [question3, setQuestion3] = useState("");
    const [question4, setQuestion4] = useState("");
    const [question5, setQuestion5] = useState("");

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
    const handleSpecialtyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSpecialty(event.target.value); // Update the selected specialty
    };
    const handleAgentClassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAgentClass(event.target.value); // Update the agentClass state correctly
    };
    const handleNext = () => {
        setStep(prevStep => prevStep + 1);
    };

    const handleBack = () => {
        setStep(prevStep => prevStep - 1);
    };

    const handleGuidedFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formElements = form.elements as typeof form.elements & {
            question1: { value: string };
            question2: { value: string };
            question3: { value: string };
            question4: { value: string };
            question5: { value: string };
        };
        // Get the form data from the guided questionnaire
        const formData = {
            class: agentClass.trim(),  // Trim any extra whitespace for the class
            specialty: specialty.trim(),  // Trim specialty value
            question1: formElements.question1?.value.trim() || "",  // Trim input value
            question2: formElements.question2?.value.trim() || "",
            question3: formElements.question3?.value.trim() || "",
            question4: formElements.question4?.value.trim() || "",
            question5: formElements.question5?.value.trim() || "",
        };

        // Format the form data into a single message string
        const formattedMessage = `
        Agent Class: ${formData.class}
        Specialized in: ${formData.specialty}
        Agent is in: ${formData.question1}
        Agent objective is: ${formData.question2}
        Agent has an encounter with: ${formData.question3}
        and has told: ${formData.question4}
        Agent distincitve feature is: ${formData.question5}
        `;

        // Set the formatted message as the input
        setInput(formattedMessage); // This updates the input field

        // Submit the input as a regular message
        handleSubmit(event); // Now submit it as if the user typed it

        // Reset all form values
        setSpecialty("");
        setAgentClass("");
        setQuestion1("");
        setQuestion2("");
        setQuestion3("");
        setQuestion4("");
        setQuestion5("");

        // form.reset();
        // event.target.reset();
        // setSpecialty(""); // Reset specialty
        // setAgentClass(""); // Reset specialty

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
            <Typography sx={{ color: '#6F6F6F' }}>
                Tips: You can even upload your Agent picture
            </Typography>

            {/* Toggle between Guided Mode and Not Guided Mode */}
            <Box
                sx={{
                    mt: 2,
                    display: 'flex',
                    flexDirection: 'column', // Set direction to column
                    alignItems: 'center',    // Center the content horizontally
                    justifyContent: 'center', // Center the content vertically (optional)
                }}
            >
                <Typography sx={{ color: '#6F6F6F', textAlign: 'center' }}> {/* Center text */}
                    Story Assistant Mode
                </Typography>
                <Switch
                    checked={isGuided}
                    onChange={(event) => setIsGuided(event.target.checked)}
                    color="primary"
                />
            </Box>

            {isGuided ? (
                <form onSubmit={handleGuidedFormSubmit} style={{ width: '100%' }}>
                    {step === 0 && (
                        <Box sx={{ mt: 3, gap: '24px' }}>
                            <Typography sx={{ mb: 1, color: '#6F6F6F' }}>
                                Agent Class
                            </Typography>
                            <RadioGroup
                                row
                                value={agentClass}
                                onChange={handleAgentClassChange}>
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

                                <IconButton onClick={handleNext}>
                                    <ArrowRight />
                                </IconButton>
                            </Box>
                        </Box>
                    )}

                    {step === 1 && (
                        <Box sx={{ mt: 3, gap: '24px' }}>
                            <Typography sx={{ mb: 1, color: '#6F6F6F' }}>
                                Agent Specialty
                            </Typography>
                            <RadioGroup row value={specialty} onChange={handleSpecialtyChange}>
                                <FormControlLabel
                                    value="Beasts"
                                    control={<Radio size="small" sx={{ color: '#B0B0B0' }} />}
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
                                <IconButton onClick={handleBack}><ArrowLeft /></IconButton>
                                <IconButton onClick={handleNext}><ArrowRight /></IconButton>
                            </Box>
                        </Box>
                    )}

                    {step === 2 && (
                        <Box sx={{ mt: 3 }}>
                            <TextField
                                name="question1"
                                value={question1}
                                onChange={(e) => setQuestion1(e.target.value)}
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
                                value={question2}
                                onChange={(e) => setQuestion2(e.target.value)}
                                placeholder="What is your Agent after? a creature? an artifact? a goal?"
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
                                <IconButton onClick={handleBack}><ArrowLeft /></IconButton>
                                <IconButton onClick={handleNext}><ArrowRight /></IconButton>
                            </Box>
                        </Box>
                    )}

                    {step === 3 && (
                        <Box sx={{ mt: 3 }}>
                            <TextField
                                name="question3"
                                value={question3}
                                onChange={(e) => setQuestion3(e.target.value)}
                                placeholder="Did your agent have an encounter with an unknown creature in the past?"
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
                                value={question4}
                                onChange={(e) => setQuestion4(e.target.value)}
                                placeholder="Who did you tell?"
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
                                placeholder="Any distinctive feature? A scar? A nervous gesture?"
                                fullWidth
                                required
                                sx={{
                                    mt: 1,
                                    mb: 1,
                                    backgroundColor: '#1E1E1E',
                                    '& input::placeholder': { color: '#B0B0B0', fontSize: '14px' },
                                    borderRadius: '40px',
                                    '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } },
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 8, mt: 2 }}>
                                <IconButton onClick={handleBack}>
                                    <ArrowLeft />
                                </IconButton>
                                <IconButton type="submit"><ArrowUpFromDot /></IconButton>
                            </Box>
                        </Box>
                    )}
                </form>

            ) : (
                // Render regular chat mode
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
                            setIsInitial(false); // Change the state after the first interaction
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
                                maxWidth: '600px',
                                width: '100%',
                                position: 'fixed',
                                bottom: isInitial ? '50%' : 30, // Center the chat initially, then move it to the bottom
                                left: '50%',
                                transform: 'translateX(-40%)',
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
                                slotProps={{
                                    input: {
                                        startAdornment: previews.length > 0 && (
                                            <InputAdornment position="start">
                                                {previews.map((src, index) => (
                                                    <Box key={index} sx={{ position: 'relative' }}>
                                                        <Image
                                                            src={src}
                                                            width={50}
                                                            height={50}
                                                            alt={`preview-${index}`}
                                                            style={{
                                                                borderRadius: '8px',
                                                                marginRight: '8px',
                                                                marginLeft: '4px',
                                                            }}
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: '-8px',
                                                                right: '-8px',
                                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                                color: '#FFF',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                                },
                                                            }}
                                                            onClick={() => handleRemoveImage(index)}
                                                        >
                                                            <CancelIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                            </InputAdornment>
                                        ),
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
            )
            }
        </Box >
    );
}
