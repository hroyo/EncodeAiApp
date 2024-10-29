import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Buffer } from 'buffer'; // Ensure Buffer is available

export const maxDuration = 30;


export async function POST(req: NextRequest) {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const { image, prompt } = await req.json();

        if (!image || !prompt) {
            return NextResponse.json({ error: 'Image and prompt are required' }, { status: 400 });
        }

        // Call the OpenAI API for inpainting (image editing)
        const response = await openai.images.edit({
            model: 'dall-e-2',  // DALL·E 2 is used for editing
            image: image, // The selected image
            prompt: prompt, // The new prompt for refinement
            n: 1,
            size: '1024x1024',
        });

        const editedImageUrl = response.data[0]?.url;

        return NextResponse.json({ imageUrl: editedImageUrl });
    } catch (error) {
        console.error('Error editing image with DALL·E:', error);
        return NextResponse.json({ error: 'Failed to refine image' }, { status: 500 });
    }
}
