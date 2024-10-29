"use client";
import React, { useState } from 'react';
import {
  CircularProgress,
  Box,
  Typography,
  IconButton,
  TextField,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { Edit } from 'lucide-react';
import Image from 'next/image'; // Import Next.js Image

const imageLoader = ({ src }: { src: string }) => {
  return src.startsWith('http') ? src : `https://ipfs.io/ipfs/${src.replace('ipfs://', '')}`;
};

interface RefineImageFormDalleProps {
  images: string[];
  onRefineComplete: (refinedImages: string[]) => void;
}

export default function RefineImageFormDalle({ images, onRefineComplete }: RefineImageFormDalleProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isPending, setIsPending] = useState(false);

  const handleRefineSubmit = async (image: string) => {
    setIsPending(true);

    try {
      // Call the DALL·E API to edit the image
      const response = await fetch('/api/dalle-edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image,
          prompt,
        }),
      });

      const result = await response.json();
      if (result.imageUrl) {
        onRefineComplete([result.imageUrl]);
      }
    } catch (error) {
      console.error('Error refining image with DALL·E:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Refine Your Image</Typography>

      {/* Display the list of generated images */}
      <ImageList cols={3} rowHeight={220}>
        {images.map((image) => (
          <ImageListItem
            key={image}
            onClick={() => setSelectedImage(image)}
            sx={{
              cursor: 'pointer',
              border: selectedImage === image ? '2px solid #000' : 'none',
            }}
          >

            <Image
              loader={imageLoader}
              src={image}
              alt="Generated Image"
              width={150}
              height={150}
              unoptimized={true} // Disable Next.js image optimization

              style={{ borderRadius: '8px' }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      {selectedImage && (
        <Box mt={4}>
          <Typography variant="subtitle1">Selected Image:</Typography>
          <Image
            loader={imageLoader}
            src={selectedImage}
            alt="Selected for Refinement"
            width={300}
            height={300}
            style={{ borderRadius: '8px' }}
          />

          {/* Input field for providing a prompt to refine the selected image */}
          <TextField
            label="Refine Prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            multiline
            sx={{ mt: 2 }}
          />

          {/* Button to refine the selected image using DALL·E */}
          <IconButton
            onClick={() => handleRefineSubmit(selectedImage)}
            disabled={isPending}
            sx={{
              marginTop: '16px',
              backgroundColor: 'secondary.main',
              '&:hover': {
                backgroundColor: 'secondary.dark',
              },
              width: '56px',
              height: '56px',
            }}
          >
            {isPending ? <CircularProgress size={24} /> : <Edit size={24} />}
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
