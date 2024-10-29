import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Buffer } from 'buffer'; // Ensure Buffer is available

// Initialize the OpenAI client
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in your environment variables
// });
export const maxDuration = 30;

export async function POST(req: NextRequest) {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in your environment variables
        });
        // Parse the incoming JSON request to get the prompt
        const { prompt } = await req.json();

        // Ensure a prompt is provided
        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Call the OpenAI API to generate an image using DALL·E 3
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt,
            n: 1, // Number of images to generate
            size: '1024x1024', // You can adjust size as needed (1024x1024, 1024x1792, etc.)
            response_format: "url",   // Default to URL

        });

        // Get the image URL from the response
        const imageUrl = response.data[0]?.url;
        // Return the image URL as JSON response
        // return NextResponse.json({ imageUrl });
        if (!imageUrl) {
            return NextResponse.json({ error: 'No image URL found' }, { status: 500 });
        }
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();

        // Set the appropriate headers and return the image buffer
        return new NextResponse(Buffer.from(imageBuffer), {
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': 'inline',
            },
        });

    } catch (error) {
        console.error('Error generating image:', error);
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
    }
}
