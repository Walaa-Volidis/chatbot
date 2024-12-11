import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message)
      return NextResponse.json(
        { message: "Message content is required" },
        { status: 400 }
      );

    const chat = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Explain the importance of fast language models",
        },
      ],
      model: "llama3-8b-8192",
    });
    const response =
      chat.choices[0].message.content || "Sorry, No response from llama";
    console.log("hey response", response);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat api", error);
    return NextResponse.json(
      { message: "Error happened while processing your request" },
      { status: 500 }
    );
  }
}
