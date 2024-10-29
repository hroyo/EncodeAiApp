// import { NextRequest, NextResponse } from 'next/server';
// import sharp from 'sharp';

// // Convert logits to binary mask
// function logitsToBinaryMask(logits: number[][][]): number[][] {
//     const threshold = 0;
//     return logits.map((row) =>
//         row.map((pixel) => {
//             if (Array.isArray(pixel) && pixel.length > 0 && typeof pixel[0] === 'number') {
//                 return pixel[0] > threshold ? 1 : 0;
//             } else if (typeof pixel === 'number') {
//                 return pixel > threshold ? 1 : 0;
//             }
//             return 0;  // Default to background if the pixel is undefined or not a number
//         })
//     );
// }

// // Function to generate PNG image from the binary mask using Sharp
// async function generateImageFromMask(binaryMask: number[][]): Promise<string> {
//     if (!binaryMask || binaryMask.length === 0 || binaryMask[0].length === 0) {
//         throw new Error('Invalid binary mask data.');
//     }

//     const height = binaryMask.length;  // Number of rows
//     const width = binaryMask[0].length;  // Number of columns

//     // Log the dimensions to debug
//     console.log(`Generating image with width: ${width}, height: ${height}`);

//     // Create RGB buffer
//     const imageBuffer = Buffer.alloc(width * height * 3);  // RGB buffer (3 bytes per pixel)

//     // Fill buffer with binary mask data
//     for (let y = 0; y < height; y++) {
//         const row = binaryMask[y];
//         for (let x = 0; x < width; x++) {
//             const value = row[x] === 1 ? 255 : 0;  // 255 for white (foreground), 0 for black (background)
//             const index = (y * width + x) * 3;
//             imageBuffer[index] = value;      // Red
//             imageBuffer[index + 1] = value;  // Green
//             imageBuffer[index + 2] = value;  // Blue
//         }
//     }

//     const fileName = `segmented-output-${Date.now()}.png`;
//     const outputPath = `./public/${fileName}`;

//     // Use Sharp to create the image from the buffer and save it
//     await sharp(imageBuffer, { raw: { width, height, channels: 3 } })
//         .toFile(outputPath);

//     return `/${fileName}`;  // Return the relative path to the public folder
// }

// // API Route Handler
// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const { logits } = body;

//         if (!logits) {
//             return NextResponse.json({ success: false, error: 'No logits provided' }, { status: 400 });
//         }

//         const binaryMask = logitsToBinaryMask(JSON.parse(logits));

//         // Log the binary mask dimensions for debugging
//         console.log(`Binary mask dimensions: width = ${binaryMask[0].length}, height = ${binaryMask.length}`);

//         const imagePath = await generateImageFromMask(binaryMask);

//         return NextResponse.json({ success: true, imagePath });
//     } catch (error: any) {
//         console.error("Error generating image:", error.message);
//         return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     }
// }
