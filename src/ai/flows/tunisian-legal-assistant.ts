
'use server';

/**
 * @fileOverview An AI agent that answers questions about Tunisian law, considering conversation history,
 * specific knowledge on data protection, and relevant context retrieved from a vector database.
 *
 * - tunisianLegalAssistant - A function that handles the legal assistant process.
 * - TunisianLegalAssistantInput - The input type for the tunisianLegalAssistant function.
 * - TunisianLegalAssistantOutput - The return type for the tunisianLegalAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchDocuments, DocumentPayload } from '@/services/qdrant-service';

// Schema for chat history messages as received by the flow
const FlowHistoryMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({text: z.string()})),
});

const TunisianLegalAssistantInputSchema = z.object({
  query: z.string().describe('The current legal question from the user. Can be in Tunisian Arabic, French, or English.'),
  chatHistory: z.array(FlowHistoryMessageSchema).optional().describe('The history of the conversation so far, for context. The "model" role represents the AI assistant.'),
});
export type TunisianLegalAssistantInput = z.infer<typeof TunisianLegalAssistantInputSchema>;

const TunisianLegalAssistantOutputSchema = z.object({
  explanation: z.string().describe("The explanation of the legal steps and procedures in simple terms, provided in the language of the user's current query, considering conversation history and specific Tunisian legal knowledge, and retrieved context."),
  retrievedContextSources: z.array(z.object({
    text: z.string(),
    source: z.string().optional(),
    score: z.number().optional(),
  })).optional().describe("Sources of information retrieved from the knowledge base that were used to formulate the answer.")
});
export type TunisianLegalAssistantOutput = z.infer<typeof TunisianLegalAssistantOutputSchema>;

export async function tunisianLegalAssistant(input: TunisianLegalAssistantInput): Promise<TunisianLegalAssistantOutput> {
  return tunisianLegalAssistantFlow(input);
}

const dataProtectionKnowledge = `
Key Information on Tunisian Data Protection and Sovereignty:

Legal Framework:
* Organic Act No. 2004-63: This law establishes the legal framework for personal data protection in Tunisia, including data processing notifications, data subject rights, and data transfers.
* Tunisian Constitution (2014): Article 24 of the Constitution protects privacy, including personal data, further strengthening data protection rights.
* INPDP (Instance nationale de protection des données personnelles): The INPDP is the regulatory body responsible for enforcing the data protection laws and ensuring compliance.

Key Aspects of Data Sovereignty in Tunisia:
* Data Subject Rights: Individuals in Tunisia have rights related to their personal data, including the right to access, rectify, and erase their data.
* Data Processing Requirements: The law outlines specific rules for data collection, storage, and processing, emphasizing transparency, purpose limitation, and fairness.
* Data Transfers: Tunisian law sets restrictions on transferring personal data outside the country, ensuring that data remains under Tunisian jurisdiction.
* Data Protection Authority: The INPDP is mandated to ensure compliance with the data protection provisions and can impose penalties for violations.
* Open Data Portal: Tunisia has established an Open Data Portal, promoting transparency and access to public data while ensuring data sovereignty.

Challenges and Considerations:
* Enforcement: While the INPDP has a legal mandate, there have been challenges in effectively enforcing the law and ensuring compliance across all sectors.
* Data Sovereignty in the Cloud: As Tunisia increasingly relies on cloud services, ensuring that data remains under Tunisian jurisdiction and meets data sovereignty requirements is a key challenge.
* Digital Surveillance: There are concerns about digital surveillance and the potential for the state to access personal data without proper safeguards, requiring vigilance in protecting data sovereignty.
`;

// Schema for chat history messages as passed to the prompt (with added boolean flags)
const PromptHistoryMessageSchema = FlowHistoryMessageSchema.extend({
  isUser: z.boolean(),
  isModel: z.boolean(),
});

// Input schema specifically for the tunisianLegalAssistantPrompt
const TunisianLegalAssistantPromptInternalInputSchema = z.object({
  query: z.string().describe('The current legal question from the user. Can be in Tunisian Arabic, French, or English.'),
  chatHistory: z.array(PromptHistoryMessageSchema).optional().describe('The history of the conversation so far, with role flags. The "model" role represents the AI assistant.'),
  retrievedContext: z.string().optional().describe("Contextual information retrieved from the knowledge base relevant to the user's query.")
});


const prompt = ai.definePrompt({
  name: 'tunisianLegalAssistantPrompt',
  input: {
    schema: TunisianLegalAssistantPromptInternalInputSchema
  },
  output: {schema: TunisianLegalAssistantOutputSchema},
  prompt: `You are an AI assistant specializing in Tunisian law.
You will engage in a conversation with the user.
First, identify the language of the user's CURRENT query (it will be Tunisian Arabic, French, or English).
Then, respond in the SAME language you identified for the current query.
Your response should be an explanation of the relevant legal steps and procedures in simple, easy-to-understand terms, pertinent to Tunisian law.
Consider the previous messages in the conversation for context.

You have access to the following specific information regarding Tunisian data protection and sovereignty, use it if the user's query relates to these topics:
--- DATA PROTECTION KNOWLEDGE START ---
${dataProtectionKnowledge}
--- DATA PROTECTION KNOWLEDGE END ---

{{#if retrievedContext}}
Additionally, consider the following information retrieved from our legal knowledge base which seems highly relevant to the user's current query:
--- RETRIEVED CONTEXT START ---
{{{retrievedContext}}}
--- RETRIEVED CONTEXT END ---
When using information from the retrieved context, try to cite or refer to the source if available in the context.
{{/if}}

{{#if chatHistory}}
Previous conversation:
{{#each chatHistory}}
{{#if this.isUser}}User: {{this.parts.0.text}}{{/if}}
{{#if this.isModel}}Assistant: {{this.parts.0.text}}{{/if}}
{{/each}}
{{/if}}

Current User Query: {{{query}}}
`,
});

const tunisianLegalAssistantFlow = ai.defineFlow(
  {
    name: 'tunisianLegalAssistantFlow',
    inputSchema: TunisianLegalAssistantInputSchema, // Flow uses the original input schema
    outputSchema: TunisianLegalAssistantOutputSchema,
  },
  async (input: TunisianLegalAssistantInput): Promise<TunisianLegalAssistantOutput> => {
    const legalDocsCollectionName = process.env.LEGAL_DOCS_COLLECTION_NAME;
    let retrievedContextText: string | undefined = undefined;
    let retrievedSourcesData: TunisianLegalAssistantOutput['retrievedContextSources'] = [];

    if (legalDocsCollectionName && input.query.trim()) {
      try {
        const searchResults = await searchDocuments(legalDocsCollectionName, input.query, 3);
        if (searchResults.length > 0) {
          retrievedContextText = searchResults
            .map((doc, index) => `Source ${index + 1} (Similarity: ${doc.score.toFixed(2)})${doc.source ? ` [${doc.source}]` : ''}:\n${doc.text}`)
            .join('\n\n---\n\n');
          
          retrievedSourcesData = searchResults.map(doc => ({
            text: doc.text,
            source: doc.source,
            score: doc.score,
          }));
        }
      } catch (e) {
        console.error("Error searching documents in Qdrant:", e);
        // Do not fail the whole flow, just proceed without retrieved context
      }
    }

    // Transform chatHistory for the prompt
    const transformedChatHistory = input.chatHistory?.map(msg => ({
      ...msg,
      isUser: msg.role === 'user',
      isModel: msg.role === 'model',
    }));

    // Prepare the input for the prompt function
    const promptInput: z.infer<typeof TunisianLegalAssistantPromptInternalInputSchema> = {
      query: input.query,
      chatHistory: transformedChatHistory,
      retrievedContext: retrievedContextText,
    };

    const {output} = await prompt(promptInput);
    
    if (output) {
      output.retrievedContextSources = retrievedSourcesData?.length > 0 ? retrievedSourcesData : undefined;
    }
    
    return output!;
  }
);
