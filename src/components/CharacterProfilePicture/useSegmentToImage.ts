// import { useState } from 'react';

// export const useSegmentToImage = () => {
//     const [imagePath, setImagePath] = useState<string | null>(null);
//     const [error, setError] = useState<string | null>(null);

//     const processSegmentationToImage = async (segmentationResult: any) => {
//         if (!segmentationResult.success || !segmentationResult.logits) {
//             setError('Segmentation failed or no logits found');
//             return;
//         }

//         try {
//             const response = await fetch('/api/segment-to-image', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     logits: segmentationResult.logits,  // Send the logits to the server
//                 }),
//             });

//             const result = await response.json();

//             if (result.success) {
//                 setImagePath(result.imagePath);  // Set the image path returned by the server
//                 setError(null);
//             } else {
//                 setError(result.error || 'Error processing segmentation');
//             }
//         } catch (err) {
//             setError('Failed to process segmentation');
//         }
//     };

//     return { imagePath, error, processSegmentationToImage };
// };
