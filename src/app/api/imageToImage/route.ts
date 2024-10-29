import { NextResponse } from 'next/server'; // Import NextResponse
import { Livepeer } from '@livepeer/ai';
import { revalidatePath } from 'next/cache';
import path from 'node:path'; // Ensure to import path
import { writeFileSync } from 'node:fs';
import { openAsBlob } from 'node:fs'; // Ensure to import openAsBlob

// Initialize Livepeer AI
const livepeerAI = new Livepeer({
    httpBearer: process.env.LIVEPEER_API_KEY, // Ensure you have your API key set in environment variables
});

export const maxDuration = 30; // Optional for your configuration, but not needed in function

// Define the type for the parameters
interface ImageToImageParams {
    image: File;
    prompt: string;
    modelId: string;
    strength: number;
    guidanceScale: number;
    imageGuidanceScale: number;
    negativePrompt: string;
    safetyCheck: boolean;
    seed: number;
    numInferenceSteps: number;
    numImagesPerPrompt: number;
}

// Function to generate images from an existing image
async function imageToImage({
    image,
    prompt,
    modelId,
    strength,
    guidanceScale,
    imageGuidanceScale,
    negativePrompt,
    safetyCheck,
    seed,
    numInferenceSteps,
    numImagesPerPrompt,
}: ImageToImageParams) {
    // Check if the image is provided
    if (!image) {
        throw new Error("No image file provided"); // Handle missing image
    }

    const buffer = await image.arrayBuffer();
    const publicDir = path.join(process.cwd(), "public");
    const imagePath = path.join(publicDir, image.name);

    writeFileSync(imagePath, Buffer.from(buffer));

    // Call the Livepeer API to generate images
    const result = await livepeerAI.generate.imageToImage({
        image: await openAsBlob(imagePath), // Convert image to blob
        modelId,
        prompt,
        strength,
        guidanceScale,
        imageGuidanceScale,
        negativePrompt,
        safetyCheck,
        seed,
        numInferenceSteps,
        numImagesPerPrompt,
    });

    revalidatePath("/");

    // Check the result and return
    if (result.imageResponse?.images) {
        const images = result.imageResponse.images.map((img) => img.url);
        return {
            success: true,
            images,
        };
    } else {
        return {
            success: false,
            images: [],
            error: "Failed to generate images",
        };
    }
}

// Named export for POST method
export async function POST(req: Request) {
    try {
        const formData = await req.formData(); // Get FormData directly
        console.log("Received FormData:", formData);

        // Extract values from FormData
        const image = formData.get("image") as File; // Get the image file
        const prompt = formData.get("prompt") as string;
        const modelId = formData.get("modelId") as string;
        const strength = parseFloat(formData.get("strength") as string);
        const guidanceScale = parseFloat(formData.get("guidanceScale") as string);
        const imageGuidanceScale = parseFloat(formData.get("imageGuidanceScale") as string);
        const negativePrompt = formData.get("negativePrompt") as string;
        const safetyCheck = formData.get("safetyCheck") === "true";
        const seed = parseInt(formData.get("seed") as string);
        const numInferenceSteps = parseInt(formData.get("numInferenceSteps") as string);
        const numImagesPerPrompt = parseInt(formData.get("numImagesPerPrompt") as string);

        // Validate that the image is provided
        if (!image) {
            return NextResponse.json({ success: false, error: "Image is required" }, { status: 400 });
        }

        // Call the imageToImage function with the extracted values
        const result = await imageToImage({
            image,
            prompt,
            modelId,
            strength,
            guidanceScale,
            imageGuidanceScale,
            negativePrompt,
            safetyCheck,
            seed,
            numInferenceSteps,
            numImagesPerPrompt,
        });

        // Return the result
        return NextResponse.json(result); // Send JSON response
    } catch (error) {
        console.error("Error in imageToImage API:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
