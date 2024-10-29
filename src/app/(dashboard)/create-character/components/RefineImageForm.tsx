import { useState, useTransition } from "react";
import { Button, TextField, Typography, CircularProgress, Box, IconButton, ImageList, ImageListItem, Slider, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { imageToImage } from "../../../actions";  // Ensure this is imported correctly
import DownloadIcon from '@mui/icons-material/Download';
import Grid from '@mui/material/Grid2';
import { Wand } from 'lucide-react';
import { livepeerModels } from '../../../../components/CharacterProfilePicture/livepeerModel';  // Import the models list
import LivepeerIcon from '../../../../../public/livepeerIcon.svg'

interface RefineImageFormProps {
    images: string[];
    onRefineComplete: (refinedImages: string[]) => void;
}

export default function RefineImageForm({ images, onRefineComplete }: RefineImageFormProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [newPrompt, setNewPrompt] = useState("");  // New prompt for refining
    const [refinedImages, setRefinedImages] = useState<string[]>([]);  // Store refined images
    const [isPending, startTransition] = useTransition();



    // Model variables with dropdown or sliders
    const [modelId, setModelId] = useState(livepeerModels[0]?.id);  // Default to first model
    const [strength, setStrength] = useState(0.1);
    const [guidanceScale, setGuidanceScale] = useState(7.5);
    const [imageGuidanceScale, setImageGuidanceScale] = useState(1.5);

    const [seed, setSeed] = useState(2332);
    const [numInferenceSteps, setNumInferenceSteps] = useState(50);




    // Handles the image selection
    const handleImageSelect = (image: string) => {
        setSelectedImage(image);
    };

    // const handleRefineSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();

    //     if (!selectedImage) return;  // Ensure an image is selected

    //     // Fetch the selected image as a Blob
    //     const response = await fetch(selectedImage);
    //     const blob = await response.blob();  // Convert the image URL or path to a Blob
    //     console.log("image selected", selectedImage)
    //     const form = new FormData();
    //     // Convert the Blob to a File and append it to FormData
    //     form.append("image", new File([blob], "refined-image.png"));  // Append the Blob as a File
    //     form.append("prompt", newPrompt || "Refining the existing image...");
    //     // form.append("modelId", "timbrooks/instruct-pix2pix");
    //     // form.append("strength", "0.1");  // Example value, adjust as needed
    //     // form.append("guidanceScale", "7.5");
    //     // form.append("imageGuidanceScale", "1.5");
    //     form.append("negativePrompt", "NFWS");  // Default value if not provided
    //     form.append("safetyCheck", "true");
    //     // form.append("seed", "2332");  // Example seed value, you can also generate it dynamically
    //     // form.append("numInferenceSteps", "50");
    //     // form.append("numImagesPerPrompt", "1");


    //     form.append("modelId", modelId || "timbrooks/instruct-pix2pix");  // Fallback to a default model ID if modelId is undefined
    //     form.append("strength", strength.toString());
    //     form.append("guidanceScale", guidanceScale.toString());
    //     form.append("imageGuidanceScale", imageGuidanceScale.toString());

    //     form.append("seed", seed.toString());
    //     form.append("numInferenceSteps", numInferenceSteps.toString());
    //     form.append("numImagesPerPrompt", "1");






    //     startTransition(async () => {
    //         const result = await imageToImage(form);  // Call the action to refine the image
    //         if (result.success) {
    //             setRefinedImages((prevImages) => [...prevImages, ...result.images]);  // Append the refined images
    //             onRefineComplete(result.images);  // Call the parent callback if needed
    //         } else {
    //             console.error("Image refinement failed:", result.error);
    //         }
    //     });
    // };



    const handleRefineSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedImage) return;  // Ensure an image is selected

        // Fetch the selected image as a Blob
        const response = await fetch(selectedImage);
        if (!response.ok) {
            console.error("Failed to fetch the image:", response.statusText);
            return;
        }
        const blob = await response.blob();  // Convert the image URL or path to a Blob
        console.log("Image selected:", selectedImage);
        console.log("Selected image URL:", selectedImage);

        const form = new FormData();
        // Convert the Blob to a File and append it to FormData
        form.append("image", new File([blob], "refined-image.png"));  // Append the Blob as a File
        form.append("prompt", newPrompt || "Refining the existing image...");

        // Append other necessary parameters
        form.append("modelId", modelId || "timbrooks/instruct-pix2pix");  // Fallback to a default model ID
        form.append("strength", strength.toString());
        form.append("guidanceScale", guidanceScale.toString());
        form.append("imageGuidanceScale", imageGuidanceScale.toString());
        form.append("negativePrompt", "NFWS");  // Default value if not provided
        form.append("safetyCheck", "true");
        form.append("seed", seed.toString());
        form.append("numInferenceSteps", numInferenceSteps.toString());
        form.append("numImagesPerPrompt", "1");

        // Prepare to send the form data to the imageToImage API route
        try {
            const apiResponse = await fetch('/api/imageToImage', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: form, // Send the FormData directly
            });

            // Check if the response is ok
            if (!apiResponse.ok) {
                const errorBody = await apiResponse.json();
                console.error("Error response from imageToImage API:", errorBody);
                throw new Error(errorBody.error || "Something went wrong");
            }

            const result = await apiResponse.json();
            if (result.success) {
                setRefinedImages((prevImages) => [...prevImages, ...result.images]);  // Append the refined images
                onRefineComplete(result.images);  // Call the parent callback if needed
            } else {
                console.error("Image refinement failed:", result.error);
            }
        } catch (error) {
            console.error("Error during image refinement:", error);
        }
    };




    // Handles the download of the image
    const handleDownload = async (image: string) => {
        try {
            const response = await fetch(image);  // Fetch the image from the source URL
            const blob = await response.blob();  // Convert the response to a Blob

            const url = window.URL.createObjectURL(blob);  // Create a local URL for the Blob
            const link = document.createElement('a');  // Create an anchor element
            link.href = url;
            link.download = 'image.png';  // Set the download filename
            document.body.appendChild(link);  // Append the link to the DOM
            link.click();  // Simulate a click on the link to trigger the download
            document.body.removeChild(link);  // Remove the link from the DOM
            window.URL.revokeObjectURL(url);  // Clean up and release the Blob URL
        } catch (error) {
            console.error('Error downloading the image:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Select your favorite image to refine it
            </Typography>


            {/* Display the images in a centered two-column grid */}
            <ImageList sx={{ width: '100%', margin: '0 auto' }} cols={2} gap={16}>
                {images.map((src, index) => (
                    <ImageListItem key={index} onClick={() => handleImageSelect(src)}>
                        <Box position="relative">
                            <img
                                src={src}
                                alt={`Generated Image ${index + 1}`}
                                style={{
                                    width: "100%",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    border: selectedImage === src ? "2px solid white" : "none",
                                }}
                            />
                            <IconButton
                                onClick={() => handleDownload(src)}
                                sx={{ position: "absolute", top: 8, right: 8, backgroundColor: "rgba(255, 255, 255, 0.1)", }}
                            >
                                <DownloadIcon />
                            </IconButton>
                        </Box>
                    </ImageListItem>
                ))}
            </ImageList>


            {selectedImage && (
                <form onSubmit={handleRefineSubmit}>
                    <Typography variant="h6" mt={4} gutterBottom>
                        Tweak Your Selection
                    </Typography>

                    <TextField
                        label="New Prompt"
                        value={newPrompt}
                        onChange={(e) => setNewPrompt(e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        margin="normal"
                        variant="outlined"
                        placeholder="A more cinematic lighting..."
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Model</InputLabel>
                        <Select
                            value={modelId}
                            onChange={(e) => setModelId(e.target.value)}
                        >
                            {livepeerModels.map((model) => (
                                <MenuItem key={model.id} value={model.id}>
                                    {model.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Strength Slider */}
                    <Typography gutterBottom>Strength ({strength})</Typography>
                    <Slider
                        value={strength}
                        onChange={(e, newValue) => setStrength(newValue as number)}
                        min={0}
                        max={1}
                        step={0.01}
                    />

                    {/* Guidance Scale Slider */}
                    <Typography gutterBottom>Guidance Scale ({guidanceScale})</Typography>
                    <Slider
                        value={guidanceScale}
                        onChange={(e, newValue) => setGuidanceScale(newValue as number)}
                        min={1}
                        max={20}
                        step={0.1}
                    />

                    {/* Image Guidance Scale Slider */}
                    <Typography gutterBottom>Image Guidance Scale ({imageGuidanceScale})</Typography>
                    <Slider
                        value={imageGuidanceScale}
                        onChange={(e, newValue) => setImageGuidanceScale(newValue as number)}
                        min={0}
                        max={2}
                        step={0.1}
                    />




                    {/* Seed TextField */}
                    <TextField
                        label="Seed"
                        value={seed}
                        onChange={(e) => setSeed(parseInt(e.target.value))}
                        fullWidth
                        margin="normal"
                        type="number"
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column', // Stack items vertically
                            alignItems: 'center',    // Center horizontally
                            gap: '12px',
                        }}
                    >
                        <IconButton
                            type="submit"
                            disabled={isPending}
                            sx={{
                                marginTop: '16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                },
                                width: '56px',
                                height: '56px',
                            }}
                        >
                            {isPending ? <CircularProgress size={24} /> : <Wand size={24} />}
                        </IconButton>
                        <Typography variant="body2" component="p" sx={{ marginRight: '8px', opacity: "0.7", }}>
                            Powered by
                        </Typography>
                        <LivepeerIcon />
                    </Box>
                </form>
            )}


        </Box>
    );
}
