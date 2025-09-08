import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SERVER_SETTINGS } from '@/settings';

const groq = new Groq({
  apiKey: SERVER_SETTINGS.groqApiKey,
});

const ZMessageSchema = z.object({
  message: z.string(),
});
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedMessage = ZMessageSchema.safeParse(body);
    if (!parsedMessage.success)
      return NextResponse.json(
        { message: 'Message content is required' },
        { status: 400 }
      );
    const { message } = parsedMessage.data;
    const chat = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama-3.3-70b-versatile',
    });
    const response =
      chat.choices[0].message.content || 'Sorry, No response from llama';
    ZMessageSchema.parse({ message: response });
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat api', error);
    return NextResponse.json(
      { message: 'Error happened while processing your request' },
      { status: 500 }
    );
  }
}
