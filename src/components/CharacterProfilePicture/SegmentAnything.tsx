// import { useState, useTransition } from "react";
// import {
//     Button,
//     Typography,
//     CircularProgress,
//     Grid,
//     Box,
// } from "@mui/material";
// import { segmentAnything } from "../../app/actions";  // Import the action
// import { useSegmentToImage } from "./useSegmentToImage";  // Import the Sharp hook

// interface SegmentImageFormProps {
//     images: string[];
//     onSegmentComplete: (segmentedMasks: string) => void;
// }

// export default function SegmentImageForm({ images, onSegmentComplete }: SegmentImageFormProps) {
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const [pointCoords, setPointCoords] = useState<number[][]>([]);  // Store clicked points
//     const [pointLabels, setPointLabels] = useState<number[]>([]);  // Store labels (foreground/background)
//     const [box, setBox] = useState<number[] | null>(null);  // Store box coordinates for segmentation
//     const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);  // Track mouse start position
//     const [isDragging, setIsDragging] = useState(false);  // Track if the user is currently dragging
//     const [isPending, startTransition] = useTransition();
//     const [segmentedMask, setSegmentedMask] = useState<string | null>(null);  // Store segmented mask
//     const [error, setError] = useState<string | null>(null);  // Handle API errors
//     const [clickCount, setClickCount] = useState(0);  // Track click count

//     const { imagePath, processSegmentationToImage, error: imageError } = useSegmentToImage();  // Use the Sharp hook

//     // Handle image selection
//     const handleImageSelect = (image: string) => {
//         setSelectedImage(image);
//         setSegmentedMask(null);  // Reset mask when a new image is selected
//         setPointCoords([]);  // Clear points
//         setPointLabels([]);  // Clear labels
//         setBox(null);  // Clear box
//         setStartPos(null);  // Clear drag start position
//         setClickCount(0);  // Reset click count
//     };

//     // Prevent default drag behavior to avoid copying the image to the desktop
//     const preventDragHandler = (event: React.DragEvent<HTMLImageElement>) => {
//         event.preventDefault();
//     };

//     // Handle point clicks on the image (for foreground/background selection)
//     const handleImageClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
//         const { offsetX, offsetY } = event.nativeEvent;

//         // Toggle between foreground and background based on click count
//         const label = clickCount % 2 === 0 ? 1 : 0;  // 1 for foreground, 0 for background

//         if (label === 1) {
//             // Add a foreground point
//             setPointCoords([[offsetX, offsetY], ...pointCoords]);  // Add new point at the start
//             setPointLabels([1, ...pointLabels]);  // Label as foreground
//         } else {
//             // Add a background point
//             setPointCoords([pointCoords[0], [offsetX, offsetY]]);  // Replace background point
//             setPointLabels([pointLabels[0], 0]);  // Label as background
//         }

//         setClickCount(clickCount + 1);  // Increment click count
//     };

//     // Handle box selection via drag events
//     const handleMouseDown = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
//         const { offsetX, offsetY } = event.nativeEvent;
//         setStartPos({ x: offsetX, y: offsetY });
//         setIsDragging(true);
//     };

//     const handleMouseUp = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
//         if (startPos) {
//             const { offsetX, offsetY } = event.nativeEvent;
//             setBox([startPos.x, startPos.y, offsetX, offsetY]);
//             setIsDragging(false);
//         }
//     };

//     // Handle form submission to segment the image
//     const handleSegmentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();

//         if (!selectedImage) {
//             setError("Please select an image.");
//             return;
//         }

//         if (pointCoords.length === 0 || pointLabels.length === 0) {
//             setError("Please select points and corresponding labels.");
//             return;
//         }

//         const form = new FormData();
//         const response = await fetch(selectedImage);
//         const blob = await response.blob();
//         form.append("image", new File([blob], "segmented-image.png"));
//         form.append("modelId", "facebook/sam2-hiera-large");  // Replace with appropriate model ID

//         // Pass point coordinates and labels to the API
//         form.append("pointCoords", JSON.stringify(pointCoords));
//         form.append("pointLabels", JSON.stringify(pointLabels));
//         const fullImageBox = [0, 0, 500, 500];
//         form.append("box", JSON.stringify(fullImageBox));

//         // if (box) {
//         //     // Pass the box coordinates if a box was selected
//         //     form.append("box", JSON.stringify(box));
//         // }
//         // Log the contents of the form data
//         console.log("Form data being sent to the API:");
//         form.forEach((value, key) => {
//             console.log(`${key}:`, value);
//         });
//         startTransition(async () => {
//             const result = await segmentAnything(form);

//             if (result.success && result.mask) {
//                 setError(null);
//                 setSegmentedMask(result.mask);
//                 onSegmentComplete(result.mask);

//                 // Process segmentation to create an image
//                 processSegmentationToImage(result);
//             } else {
//                 setError(result.error || "Segmentation failed.");
//                 console.error("Segmentation failed:", result.error);
//             }
//         });
//     };

//     return (
//         <Box>
//             <Typography variant="h6" gutterBottom>
//                 Select an Image for Segmentation
//             </Typography>

//             <Grid container spacing={2}>
//                 {images.map((src, index) => (
//                     <Grid item xs={6} key={index} onClick={() => handleImageSelect(src)}>
//                         <img
//                             src={src}
//                             alt={`Generated Image ${index + 1}`}
//                             style={{
//                                 width: "100%",
//                                 borderRadius: "8px",
//                                 cursor: "pointer",
//                                 border: selectedImage === src ? "2px solid blue" : "none",
//                             }}
//                             onDragStart={preventDragHandler}  // Prevent drag-and-drop behavior
//                         />
//                     </Grid>
//                 ))}
//             </Grid>

//             {selectedImage && (
//                 <>
//                     <Typography variant="h6" mt={4} gutterBottom>
//                         Click on the Image to Select Points (Alternates between Foreground and Background) or Drag to Select a Box
//                     </Typography>
//                     <Box sx={{ position: 'relative', width: '100%', height: 'auto' }}>
//                         <img
//                             src={selectedImage}
//                             alt="Selected for Segmentation"
//                             style={{ width: "100%", cursor: isDragging ? "crosshair" : "pointer" }}
//                             onClick={handleImageClick}
//                             onMouseDown={handleMouseDown}
//                             onMouseUp={handleMouseUp}
//                             onDragStart={preventDragHandler}  // Prevent drag-and-drop behavior
//                         />
//                         {box && (
//                             <div
//                                 style={{
//                                     position: 'absolute',
//                                     border: '2px dashed red',
//                                     top: `${Math.min(box[1], box[3])}px`,
//                                     left: `${Math.min(box[0], box[2])}px`,
//                                     width: `${Math.abs(box[2] - box[0])}px`,
//                                     height: `${Math.abs(box[3] - box[1])}px`,
//                                 }}
//                             ></div>
//                         )}
//                     </Box>

//                     {error && (
//                         <Typography color="error" mt={2}>
//                             {error}
//                         </Typography>
//                     )}

//                     <Box mt={2}>
//                         <Typography variant="h6">Selected Points:</Typography>
//                         <ul>
//                             {pointCoords.map((coord, index) => (
//                                 <li key={index}>
//                                     Point: ({coord[0]}, {coord[1]}) - {pointLabels[index] === 1 ? "Foreground" : "Background"}
//                                 </li>
//                             ))}
//                         </ul>
//                     </Box>

//                     <Button
//                         type="submit"
//                         variant="contained"
//                         color="secondary"
//                         fullWidth
//                         disabled={isPending}
//                         sx={{ marginTop: 2 }}
//                         onClick={handleSegmentSubmit}
//                     >
//                         {isPending ? <CircularProgress size={24} /> : "Segment Image"}
//                     </Button>

//                     {imagePath && (
//                         <Box mt={4}>
//                             <Typography variant="h6" gutterBottom>
//                                 Generated Image
//                             </Typography>
//                             <img src={imagePath} alt="Generated Segmentation" style={{ width: '100%' }} />
//                         </Box>
//                     )}

//                     {imageError && (
//                         <Typography color="error" mt={2}>
//                             {imageError}
//                         </Typography>
//                     )}
//                 </>
//             )}
//         </Box>
//     );
// }
