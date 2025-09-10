// src/app/api/vector-query/route.js
import { NextResponse } from "next/server";
import { pinecone } from "@/config/supabase";
import { embeddings } from "@/lib/llm/model";

export async function POST(req) {
  console.log("queryEmbedding");
  try {
    const { query, namespace, topK = 5 } = await req.json();

    console.log("query: ", query);
    console.log("namespace: ", namespace);
    console.log("topK: ", topK);

    let relevantContext = "";
    try {
      const index = pinecone.index("convi");

      // Create query embedding
      const queryEmbedding = await embeddings.embedQuery(query);

      console.log("namespace: ", namespace);

      // Query Pinecone for similar documents
      const namespaceIndex = index.namespace(namespace);
      const queryResponse = await namespaceIndex.query({
        vector: queryEmbedding,
        topK: 3,
        includeValues: true,
        includeMetadata: true,
      });

      console.log("queryResponse: ",  JSON.stringify(queryResponse));

      // Extract relevant context from retrieved documents
      if (queryResponse.matches && queryResponse.matches.length > 0) {
        
        const contextParts = queryResponse.matches.map((match) => match.metadata.content);

        relevantContext = contextParts.join("\n\n");
        console.log("relevantContext: ", relevantContext);
        console.log(
          `Retrieved ${contextParts.length} relevant medical documents from Pinecone`
        );
      }
    } catch (pineconeError) {
      console.warn(
        "Pinecone query failed, proceeding without context:",
        pineconeError
      );
    }

    // if (!query) {
    //   return NextResponse.json({ error: "Query text is required" }, { status: 400 });
    // }

    // // Get Pine  cone index
    // const index = pinecone.index("convi");

    // // Generate embedding for query
    // const queryEmbedding = await embeddings.embedQuery(query);

    // // Perform similarity search in Pinecone
    // const results = await index
    // .namespace(namespace || "") // default namespace if not provided
    // .query({
    //   vector: queryEmbedding,
    //   topK,
    //   includeMetadata: true,
    // });
    // console.log("queryEmbedding");
    // console.log(results);

    return NextResponse.json({
      success: true,
      matches: relevantContext,
    });
  } catch (error) {
    console.error("Vector query error:", error);
    return NextResponse.json(
      {
        error: "Failed to query documents",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
