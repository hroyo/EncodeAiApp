import { NextResponse } from 'next/server'; // Import NextResponse
import { Livepeer } from '@livepeer/ai';
import { revalidatePath } from 'next/cache';

// Initialize Livepeer AI
const livepeerAI = new Livepeer({
    httpBearer: process.env.LIVEPEER_API_KEY, // Ensure you have your API key set in environment variables
});
export const maxDuration = 30;

// Define the type for the parameters
interface TextToImageParams {
    prompt: string;
    modelId: string;
    width: number;
    height: number;
    guidanceScale: number;
    negativePrompt: string;
    safetyCheck: boolean;
    seed: number;
    numInferenceSteps: number;
    numImagesPerPrompt: number;
}

// Function to generate images from text
async function textToImage({
    prompt,
    modelId,
    width,
    height,
    guidanceScale,
    negativePrompt,
    safetyCheck,
    seed,
    numInferenceSteps,
    numImagesPerPrompt,
}: TextToImageParams) {
    const result = await livepeerAI.generate.textToImage({
        modelId,
        prompt,
        width,
        height,
        guidanceScale,
        negativePrompt,
        safetyCheck,
        seed,
        numInferenceSteps,
        numImagesPerPrompt,
    });

    revalidatePath("/");

    if (result.imageResponse?.images) {
        const images = result.imageResponse.images.map((image: { url: string }) => image.url);
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
        const body = await req.json();
        const {
            prompt,
            modelId,
            width,
            height,
            guidanceScale,
            negativePrompt,
            safetyCheck,
            seed,
            numInferenceSteps,
            numImagesPerPrompt,
        } = body;

        // Call the textToImage function
        const result = await textToImage({
            prompt,
            modelId,
            width: Number(width), // Ensure width is a number
            height: Number(height), // Ensure height is a number
            guidanceScale: Number(guidanceScale), // Ensure this is a number
            negativePrompt,
            safetyCheck: safetyCheck === "true", // Ensure this is a boolean
            seed: parseInt(seed, 10), // Ensure seed is an integer
            numInferenceSteps: parseInt(numInferenceSteps, 10), // Ensure this is an integer
            numImagesPerPrompt: parseInt(numImagesPerPrompt, 10), // Ensure this is an integer
        });

        // Return the result
        return NextResponse.json(result); // Send JSON response
    } catch (error) {
        console.error("Error in textToImage API:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
