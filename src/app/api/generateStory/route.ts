import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { Buffer } from 'buffer'; // Ensure Buffer is available

export const maxDuration = 30;

export async function POST(req: NextRequest) {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const { messages } = await req.json();  // Expecting full conversation in request body

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Conversation messages are missing' }, { status: 400 });
        }

        // Call OpenAI API with the entire conversation history
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
            messages,  // Send entire conversation history to OpenAI
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '600', 10),
            temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '1.0'),
            top_p: parseFloat(process.env.OPENAI_TOP_P || '1.0'),
            frequency_penalty: parseFloat(process.env.OPENAI_FREQUENCY_PENALTY || '0'),
            presence_penalty: parseFloat(process.env.OPENAI_PRESENCE_PENALTY || '0'),
        });

        const story = response?.choices?.[0]?.message?.content;

        return NextResponse.json({ story });

    } catch (error) {
        console.error('Error with OpenAI API:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
