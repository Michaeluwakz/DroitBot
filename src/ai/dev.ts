
import { config } from 'dotenv';
config(); // Load .env file variables

import '@/ai/flows/call-shield.ts';
import '@/ai/flows/real-time-scam-protection.ts';
import '@/ai/flows/customs-bureaucracy-help.ts';
import '@/ai/flows/tunisian-legal-assistant.ts';
import '@/ai/flows/legal-rights-summaries.ts';
import '@/ai/flows/misinformation-debunker.ts';
import '@/ai/flows/image-pdf-fraud-check.ts';
import '@/ai/flows/emergency-advisor-flow.ts';
import '@/ai/flows/text-to-speech-flow.ts';

// Potentially initialize Qdrant collections on dev server start
import { ensureCollectionExists } from '@/services/qdrant-service';

async function initializeQdrant() {
  const legalDocsCollectionName = process.env.LEGAL_DOCS_COLLECTION_NAME;
  if (legalDocsCollectionName && process.env.QDRANT_URL) {
    try {
      console.log(`Ensuring Qdrant collection "${legalDocsCollectionName}" exists...`);
      await ensureCollectionExists(legalDocsCollectionName);
      console.log(`Qdrant collection "${legalDocsCollectionName}" is ready.`);
      // You could add a seeding function call here if you have one
      // e.g. await seedLegalDocuments();
    } catch (error) {
      console.error('Failed to initialize Qdrant collection:', error);
    }
  } else {
    console.warn('QDRANT_URL or LEGAL_DOCS_COLLECTION_NAME not set. Skipping Qdrant initialization.');
  }
}

if (process.env.NODE_ENV === 'development') {
  initializeQdrant();
}
