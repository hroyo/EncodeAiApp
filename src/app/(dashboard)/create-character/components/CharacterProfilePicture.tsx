"use client";
import { useState, useTransition } from "react";
import {
    CircularProgress,
    Box,
    Container,
    IconButton,
    ImageList,
    ImageListItem,
    Typography
} from "@mui/material";
import { textToImage } from "../../../actions";
import RefineImageForm from "./RefineImageForm";
import { Fingerprint } from 'lucide-react';
import Image from 'next/image'; // Import Next.js Image
import predefinedClasses, { CharacterClass } from "../../../../components/CharacterProfilePicture/predefinedClasses";  // Import predefinedClasses and CharacterClass
import RefineImageFormDalle from "../../../../components/CharacterProfilePicture/RefineImageFromDalle";
import { Download } from "@mui/icons-material"; // Import Download Icon
import { Wand } from 'lucide-react';
import { VenetianMask } from 'lucide-react';
import LivepeerIcon from '../../../../../public/livepeerIcon.svg'
import { ImagePlay } from 'lucide-react';


const classAvatars: Record<string, string> = {
    'Activist': 'ipfs://QmPBy8ZBCBpawtY14Btscpd6R9Xo1fZPR6GbDy9CcALk8F',
    'Mystic': 'ipfs://QmZgKyAf5D2gkhjG47RNoVrEAuyHwHSnWPTWqwwDGaGUqo',
    'Scholar': 'ipfs://QmfVb8gyGnTdCjwFkjh3tQjoZRoVudheDdxktQUVT4DPJK',
    'Stormchaser': 'ipfs://QmdxdivELDhC5NgFvNXm7XZbQMj3JWFbmrSEPcE1SwGdgu',
    'Survivor': 'ipfs://QmSqC5FeFZagGZ62RbfDb9rs1TTNkMu56FV4LX7AFjdXE1',
    'Nurturer': 'ipfs://QmTH3k58Gqg8WcgLWmBq5FFZn4vxeuqX2X5LGKrMKDb9xY',
};

// const coverCharacters: Record<string, string> = {
//     'Activist': 'https://agency-missions.s3.us-east-2.amazonaws.com/characters/activist.png',
//     'Mystic': 'https://agency-missions.s3.us-east-2.amazonaws.com/characters/mystic.png',
//     'Scholar': 'https://agency-missions.s3.us-east-2.amazonaws.com/characters/scholar.png',
//     'Stormchaser': 'https://agency-missions.s3.us-east-2.amazonaws.com/characters/stormchaser.png',
//     'Survivor': 'https://agency-missions.s3.us-east-2.amazonaws.com/characters/survivor.png',
//     'Nurturer': 'https://agency-missions.s3.us-east-2.amazonaws.com/characters/nurturer.png',
// };

const imageLoader = ({ src }: { src: string }) => {
    return src.startsWith('http') ? src : `https://ipfs.io/ipfs/${src.replace('ipfs://', '')}`;
};

export default function CharacterProfilePicture() {
    const [selectedClass, setSelectedClass] = useState<CharacterClass>('Activist');
    const [images, setImages] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const formData = predefinedClasses[selectedClass];
    const [segmentedMasks, setSegmentedMasks] = useState<string[]>([]);  // Store segmented masks
    const [isDallePending, setIsDallePending] = useState(false);  // State to track DALL·E submission

    const handleClassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedClass(event.target.value as CharacterClass);
    };
    const handleClassSelect = (characterClass: CharacterClass) => {
        setSelectedClass(characterClass);
    };


    // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     const form = new FormData();

    //     // Generate a dynamic seed
    //     const dynamicSeed = Math.floor(Math.random() * 10000);

    //     // Append predefined form data (without the seed)
    //     Object.entries(formData).forEach(([key, value]) => {
    //         form.append(key, value.toString());
    //     });

    //     // Append the dynamic seed
    //     form.append("seed", dynamicSeed.toString());

    //     const controller = new AbortController();
    //     //     const timeout = setTimeout(() => {
    //     //         controller.abort(); // Abort the fetch if it takes too long
    //     //     }, 30000); // 10-second timeout
    //     // startTransition(async () => {
    //     //     try {
    //     //         const result = await textToImage(form, { signal: controller.signal });
    //     //         if (result.success) {
    //     //             // Append new images to the existing images array
    //     //             setImages((prevImages) => [...prevImages, ...result.images]);
    //     //         }
    //     //     } catch (error) {
    //     //         if (error.name === "AbortError") {
    //     //             console.error('Request timed out');
    //     //         } else {
    //     //             console.error('Error generating image:', error);
    //     //         }
    //     //     } finally {
    //     //         clearTimeout(timeout); // Clear the timeout
    //     //     }
    //     // });
    //     startTransition(async () => {
    //         const result = await textToImage(form);
    //         if (result.success) {
    //             // Append new images to the existing images array
    //             setImages((prevImages) => [...prevImages, ...result.images]);
    //         }
    //     });
    // };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget); // Use FormData constructor directly with the form element

        // Generate a dynamic seed
        const dynamicSeed = Math.floor(Math.random() * 10000);

        // Append the dynamic seed to the FormData
        form.append("seed", dynamicSeed.toString());

        // Assuming formData is defined and contains the predefined values
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value.toString()); // Append predefined form data
        });

        // Convert FormData to a plain object
        const formDataObject = Object.fromEntries(form.entries());

        startTransition(async () => {
            try {
                const response = await fetch('/api/textToImage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataObject), // Convert to JSON
                });

                if (!response.ok) {
                    const errorBody = await response.json();
                    console.error("Error response:", errorBody);
                    throw new Error(errorBody.error || "Something went wrong");
                }

                const result = await response.json();
                if (result.success) {
                    // Append new images to the existing images array
                    setImages((prevImages) => [...prevImages, ...result.images]);
                } else {
                    console.error("Failed to generate images:", result.error);
                }
            } catch (error) {
                console.error("Error generating image:", error);
            }
        });
    };


    const handleDalleSubmit = async () => {
        setIsDallePending(true); // Set pending state for DALL·E button

        try {
            const dalleResponse = await fetch('/api/dalle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: formData.prompt, // Use the prompt from the predefined class
                }),
            });

            // Handle the response as a Blob since it's an image
            if (!dalleResponse.ok) {
                throw new Error('Failed to fetch DALL·E image');
            }

            // Fetch the image as a Blob instead of trying to parse JSON
            const imageBlob = await dalleResponse.blob();

            // Convert the Blob to a URL that can be used in the form
            const imageBlobUrl = URL.createObjectURL(imageBlob);

            // Append the image Blob URL to the images array
            setImages((prevImages) => [...prevImages, imageBlobUrl]);

        } catch (error) {
            console.error('Error generating DALL·E image:', error);
        } finally {
            setIsDallePending(false); // Reset pending state
        }
    };




    const handleRefineComplete = (refinedImages: string[]) => {
        setImages((prevImages) => [...prevImages, ...refinedImages]);  // Append the refined images
    };
    const handleSegmentComplete = (segmentedMask: string) => {
        setSegmentedMasks((prevMasks) => [...prevMasks, segmentedMask]);  // Append the segmented mask
    };

    return (
        <Box>
            <Container className="flex min-h-screen items-center justify-center" maxWidth="md">
                {/* Character class selection using ImageList */}
                <Typography variant="h6" gutterBottom>
                    Choose an Agent Class
                </Typography>



                <form onSubmit={handleSubmit}>

                    <Box>
                        <ImageList cols={3} rowHeight={240} sx={{ paddingTop: "24px" }}>
                            {Object.keys(predefinedClasses).map((characterClass) => (
                                <ImageListItem
                                    value={characterClass}

                                    key={characterClass}
                                    onClick={() => handleClassSelect(characterClass as CharacterClass)}  // Cast to CharacterClass
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center', // Center the image and text horizontally
                                        justifyContent: 'center', // Center the image and text vertically
                                        textAlign: 'center', // Ensure the text is centered as well
                                        cursor: 'pointer',
                                        // transform: selectedClass === characterClass ? 'scale(1.08)' : 'scale(1)', // Scale up when selected
                                        padding: "none",
                                    }}
                                >
                                    <Image
                                        loader={imageLoader}  // Use custom loader for handling IPFS/external URLs
                                        src={classAvatars[characterClass] || ''}
                                        alt={characterClass}
                                        width={150} // Define the width of the image
                                        height={150} // Define the height of the image
                                        style={{
                                            backgroundColor: selectedClass === characterClass ? 'rgba(25, 118, 210, 0.1)' : 'transparent', // Add background color on selection
                                            transform: selectedClass === characterClass ? 'scale(1.1)' : 'scale(1)', // Scale up when selected
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease', // Smooth transitions
                                            border: selectedClass === characterClass ? '1px solid rgba(200, 200, 200, 0.7)' : 'none', // Highlight selected class with a white border
                                            borderRadius: '50%', // Make the image circular
                                            boxShadow: selectedClass === characterClass ? '0px 0px 48px 1px rgba(255, 255, 255, 0.2)' : 'none', // Add white glow when selected
                                            opacity: selectedClass === characterClass ? 1 : 0.5, // Change opacity when selected
                                            color: "#D9D9D9"
                                        }}
                                    />
                                    <Typography variant="subtitle1" align="center"
                                        sx={{
                                            marginTop: "12px",
                                            fontFamily: "'Crimson Pro'",
                                            fontWeight: "800",
                                            '-webkit-font-smoothing': 'none',    // Disable font smoothing on WebKit browsers
                                            '-moz-osx-font-smoothing': 'auto',   // Disable font smoothing on macOS
                                            'font-smooth': 'never',
                                            opacity: selectedClass === characterClass ? 1 : 0.7, // You can change text opacity too

                                        }}
                                    >
                                        The {characterClass}
                                    </Typography>
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center', // Center horizontally
                            alignItems: 'center',     // Center vertically (if necessary)
                            marginTop: '16px',
                            gap: '12px',
                            position: 'relative', // Allow positioning of child elements
                        }}
                    >
                        <IconButton
                            onClick={handleDalleSubmit}
                            disabled={isDallePending}
                            sx={{
                                marginTop: '16px',
                                marginLeft: '16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'secondary.dark',
                                },
                                width: '56px',
                                height: '56px',
                            }}
                        >
                            {isDallePending ? <CircularProgress size={24} /> : <ImagePlay size={24} />}
                        </IconButton>

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
                            {isPending ? <CircularProgress size={24} /> : <ImagePlay size={24} />}
                        </IconButton>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: '16px',
                                position: 'absolute', // Position relative to the parent Box
                                right: '-50px', // Move to the right
                            }}
                        >
                            <Typography variant="body2" component="p" sx={{ marginRight: '8px', opacity: "0.7", }}>
                                Powered by
                            </Typography>
                            <LivepeerIcon />
                            {/* <Image
                                src={livepeerIcon}
                                style={{ width: "80px", height: "40px" }}
                                alt="Powered by Livepeer"
                            /> */}
                        </Box>
                    </Box>

                </form>

                {/* Display and refine generated images */}
                {
                    images.length > 0 && (
                        <Box mt={4}>
                            <RefineImageForm images={images} onRefineComplete={(refinedImages) => setImages((prevImages) => [...prevImages, ...refinedImages])} />
                            {/* <RefineImageFormDalle
                        images={images}
                        onRefineComplete={(refinedImages) => setImages((prevImages) => [...prevImages, ...refinedImages])}
                    /> */}
                        </Box>
                    )
                }


            </Container >
        </Box>
    );
}
