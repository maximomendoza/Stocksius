import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    system: `You are Omega, a helpful and brief financial AI assistant embedded in a dashboard. The user is looking at their stock watchlist. Here is the context of what they are looking at: ${context}. Answer their questions concisely. Do not provide financial advice. Focus on explaining terms, doing basic math on the numbers seen, or summarizing.`,
    messages,
  });

  return result.toDataStreamResponse();
}
