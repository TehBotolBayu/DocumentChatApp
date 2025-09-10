import { NextResponse } from "next/server";
import { getAIResponse } from "@/services/ai.service";

export async function POST(req) {
  try {
    const { serialized, message, retrievedDocs } = await req.json();

    console.log("serialized");
    console.log(serialized);
    console.log("message");
    console.log(message);
    console.log("retrievedDocs");
    console.log(retrievedDocs);

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    let context = retrievedDocs;

    const prompt = `
    Response to the user's message.
    User message: ${message}
    ${context ? `\nRelevant knowledge from user documents:\n${context}` : ""}
    `;

    const response = await getAIResponse(serialized || [], prompt);

    return NextResponse.json({ success: true, message: response.message });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response", details: error.message },
      { status: 500 }
    );
  }
}
