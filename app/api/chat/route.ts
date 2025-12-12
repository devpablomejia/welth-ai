import { google } from '@ai-sdk/google';
import { convertToCoreMessages, streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response(
            'Missing env var GOOGLE_GENERATIVE_AI_API_KEY. Add it to .env.local.',
            { status: 500 },
        );
    }

    const body = await req.json().catch(() => ({} as unknown));
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const modelName = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

    const result = streamText({
        model: google(modelName),
        messages: convertToCoreMessages(messages),
    });

    return result.toUIMessageStreamResponse();
}
