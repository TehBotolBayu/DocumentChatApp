import { pinecone } from '@/config/supabase';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { NextResponse } from 'next/server';
import { embeddings } from '@/lib/llm/model';

function unicodeToAscii(str) {
  // Step 1: remove accents/diacritics
  let ascii = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Step 2: replace non-ASCII characters
  ascii = ascii.replace(/[^\x00-\x7F]/g, "?");

  return ascii;
}

export async function POST(request) {
  try {
    const { title, content, namespace } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Get Pinecone index
    const index = pinecone.index('convi');

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await textSplitter.splitText(content);

    // Generate embeddings for each chunk
    const embeddingPromises = chunks.map(chunk => embeddings.embedQuery(chunk));
    const embeddingsList = await Promise.all(embeddingPromises);

    // Store embeddings in Pinecone with metadata
    let cleanedtitle = unicodeToAscii(title)
    console.log('cleanedtitle:', cleanedtitle);
    const vectors = chunks.map((chunk, i) => ({
      id: `${cleanedtitle.replace(/ /g, '-')}-${i}-${Date.now()}`,
      values: embeddingsList[i],
      metadata: {
        title: cleanedtitle,
        content: chunk,
        chunkIndex: i,
        totalChunks: chunks.length,
        timestamp: new Date().toISOString()
      }
    }));

    // Upsert vectors into Pinecone with namespace (if provided)
    console.log('namespace:', namespace);
    const namespaceIndex = index.namespace(namespace);
    await namespaceIndex.upsert(vectors);

    console.log(
      `Successfully stored document "${title}" with ${chunks.length} chunks in Pinecone (namespace: ${namespace || 'default'})`
    );

    return NextResponse.json({
      success: true,
      message: 'Document processed and stored in Pinecone successfully',
      chunks: chunks.length,
      vectors: vectors.length,
      namespace: namespace || 'default',
      note: 'Document is now available for medical knowledge retrieval in chat responses.'
    });

  } catch (error) {
    console.error('Document upload error:', error);

    return NextResponse.json(
      { 
        error: 'Failed to process and store document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
