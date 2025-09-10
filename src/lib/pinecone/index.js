import { embeddings } from "../llm/model";
import { pinecone } from "@/config";

export const queryPineCone = async (indexName, message) => {
  let relevantContext = "";
  try {
    const index = pinecone.index(indexName);
    // Create query embedding
    const queryEmbedding = await embeddings.embedQuery(message);
    // Query Pinecone for similar documents
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 3,
      includeMetadata: true,
    });
    // Extract relevant context from retrieved documents
    if (queryResponse.matches && queryResponse.matches.length > 0) {
      const contextParts = queryResponse.matches
        .filter((match) => match.score && match.score > 0.7) // Only use relevant matches
        .map((match) => match.metadata?.content || "")
        .filter((content) => typeof content === "string" && content.length > 0);

      relevantContext = contextParts.join("\n\n");
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
  return relevantContext;
};
