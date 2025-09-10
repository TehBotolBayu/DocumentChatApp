import { NextResponse } from "next/server";
import { ChatbotKnowledgeService } from "../../../services/supabase";

// GET /api/knowledge - Get knowledge entries with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get("chatbot_id");
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = parseInt(searchParams.get("page_size")) || 10;
    const search = searchParams.get("search");

    if (!chatbotId) {
      return NextResponse.json(
        { error: "chatbot_id is required" },
        { status: 400 }
      );
    }

    let data;

    if (search) {
      data = await ChatbotKnowledgeService.searchKnowledge(chatbotId, search);
    } else {
      data = await ChatbotKnowledgeService.getKnowledgeWithPagination(
        chatbotId,
        page,
        pageSize
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching knowledge:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/knowledge - Create a new knowledge entry
export async function POST(request) {
  try {
    const body = await request.json();
    const { chatbot_id, content, title } = body;

    // Validate required fields
    if (!chatbot_id || !content) {
      return NextResponse.json(
        { error: "chatbot_id and content are required" },
        { status: 400 }
      );
    }

    const knowledge = await ChatbotKnowledgeService.createKnowledge({
      chatbot_id,
      content,
      title,
    });

    return NextResponse.json({ data: knowledge }, { status: 201 });
  } catch (error) {
    console.error("Error creating knowledge:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
