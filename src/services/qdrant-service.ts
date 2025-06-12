
'use server';
/**
 * @fileOverview Service for interacting with Qdrant vector database.
 *
 * - ensureCollectionExists - Ensures a Qdrant collection exists with the specified configuration.
 * - addDocument - Adds a document (text + metadata) to a Qdrant collection after generating its embedding.
 * - searchDocuments - Performs a semantic search in a Qdrant collection based on a query text.
 */

import { QdrantClient } from '@qdrant/js-client-rest';
import { ai } from '@/ai/genkit';
import { v4 as uuidv4 } from 'uuid';

const qdrantUrl = process.env.QDRANT_URL;
const qdrantApiKey = process.env.QDRANT_API_KEY;
const embeddingModelName = process.env.EMBEDDING_MODEL_FOR_QDRANT || 'googleai/embedding-004';
const embeddingDimensions = parseInt(process.env.EMBEDDING_DIMENSIONS || '768', 10);

if (!qdrantUrl) {
  console.warn('QDRANT_URL is not set. Qdrant service will not be fully functional.');
}

const client = qdrantUrl ? new QdrantClient({ 
  url: qdrantUrl,
  apiKey: qdrantApiKey || undefined, // Pass undefined if API key is empty
}) : null;

/**
 * Generates a vector embedding for the given text using the configured Genkit AI model.
 * @param text The text to embed.
 * @returns A promise that resolves to an array of numbers representing the embedding.
 */
async function generateEmbedding(text: string): Promise<number[]> {
  if (!client) throw new Error('Qdrant client not initialized. Check QDRANT_URL.');
  try {
    const { embedding } = await ai.embedGenerate({
      embedder: embeddingModelName,
      content: text,
    });
    if (!embedding) {
      throw new Error('Failed to generate embedding: No embedding returned.');
    }
    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Ensures that a collection exists in Qdrant with the specified name and vector configuration.
 * If the collection does not exist, it will be created.
 * @param collectionName The name of the collection.
 */
export async function ensureCollectionExists(collectionName: string): Promise<void> {
  if (!client) throw new Error('Qdrant client not initialized.');
  try {
    const collectionsResponse = await client.getCollections();
    const collectionExists = collectionsResponse.collections.some(
      (c) => c.name === collectionName
    );

    if (!collectionExists) {
      await client.createCollection(collectionName, {
        vectors: {
          size: embeddingDimensions,
          distance: 'Cosine', // Cosine is a common choice for text embeddings
        },
      });
      console.log(`Collection "${collectionName}" created successfully.`);
    } else {
      // console.log(`Collection "${collectionName}" already exists.`);
    }
  } catch (error) {
    console.error(`Error ensuring collection "${collectionName}" exists:`, error);
    throw new Error(`Failed to ensure collection: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export interface DocumentPayload {
  text: string;
  source?: string;
  [key: string]: any; // Allow other metadata
}

/**
 * Adds a document to the specified Qdrant collection.
 * Generates an embedding for the document's text and upserts it.
 * @param collectionName The name of the collection.
 * @param document An object containing the document id (optional, will be generated if not provided), text, and optional metadata.
 */
export async function addDocument(
  collectionName: string,
  document: { id?: string; text: string; metadata?: Record<string, any> }
): Promise<void> {
  if (!client) throw new Error('Qdrant client not initialized.');
  if (!document.text || document.text.trim() === '') {
    throw new Error('Document text cannot be empty.');
  }
  await ensureCollectionExists(collectionName);

  const vector = await generateEmbedding(document.text);
  const pointId = document.id || uuidv4();

  const payload: DocumentPayload = {
    text: document.text,
    ...(document.metadata || {}),
  };
  
  try {
    await client.upsert(collectionName, {
      points: [
        {
          id: pointId,
          vector: vector,
          payload: payload,
        },
      ],
    });
    // console.log(`Document "${pointId}" added to collection "${collectionName}".`);
  } catch (error) {
    console.error('Error adding document to Qdrant:', error);
    throw new Error(`Failed to add document: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Searches for documents in the specified Qdrant collection that are semantically similar to the query text.
 * @param collectionName The name of the collection.
 * @param queryText The text to search for.
 * @param limit The maximum number of results to return. Defaults to 3.
 * @returns A promise that resolves to an array of search results (document payloads with score).
 */
export async function searchDocuments(
  collectionName: string,
  queryText: string,
  limit = 3
): Promise<(DocumentPayload & { score: number; id: string | number })[]> {
  if (!client) throw new Error('Qdrant client not initialized.');
  if (!queryText || queryText.trim() === '') {
    return []; // Return empty if query is empty
  }
  await ensureCollectionExists(collectionName);

  const queryVector = await generateEmbedding(queryText);

  try {
    const searchResult = await client.search(collectionName, {
      vector: queryVector,
      limit: limit,
      with_payload: true, // To retrieve the document text and metadata
    });

    return searchResult.map((hit) => ({
      id: hit.id,
      score: hit.score,
      ...(hit.payload as DocumentPayload),
    }));
  } catch (error) {
    console.error('Error searching documents in Qdrant:', error);
    // In case of error (e.g., collection not ready after creation attempt, network issue), return empty or throw
    // For a smoother UX, returning empty might be preferable if it's not a critical failure.
    return [];
    // throw new Error(`Failed to search documents: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Example usage (typically called from an admin panel or a seeding script, not directly here)
// async function seedInitialData() {
//   const collectionName = process.env.LEGAL_DOCS_COLLECTION_NAME!;
//   try {
//     await addDocument(collectionName, {
//       id: 'article-2004-63-sample',
//       text: 'Organic Act No. 2004-63: This law establishes the legal framework for personal data protection in Tunisia.',
//       metadata: { source: 'Organic Act No. 2004-63' }
//     });
//     await addDocument(collectionName, {
//       id: 'constitution-2014-art24-sample',
//       text: 'Tunisian Constitution (2014): Article 24 of the Constitution protects privacy, including personal data.',
//       metadata: { source: 'Tunisian Constitution 2014, Article 24' }
//     });
//     console.log('Initial data seeding initiated (example).');
//   } catch (error) {
//     console.error('Error seeding initial data:', error);
//   }
// }
// if (process.env.NODE_ENV === 'development') { // Basic guard
//   // seedInitialData(); 
// }
