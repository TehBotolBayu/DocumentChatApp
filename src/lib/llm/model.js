import { ChatMistralAI, MistralAIEmbeddings } from "@langchain/mistralai";

export const llm = new ChatMistralAI({
  // model: "mistral-large-latest",
  model: "mistral-small-latest",
  temperature: 0,
});

export const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
});
