import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = await streamText({
        model: openai(process.env.OPENAI_MODEL || 'gpt-3.5-turbo'),  // Default to 'gpt-4-turbo' if not set
        messages: convertToCoreMessages(messages),
        system: 'You are the Crypto-Z Agency ai assitant, Crypto-Z is a secret agent organization and you are trained to operate covertly, providing information with precision and secrecy.',
        maxTokens: 512,
        temperature: 0.3,
        maxRetries: 5,
    });

    return result.toDataStreamResponse();
}