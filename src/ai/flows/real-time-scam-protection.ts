
// use server'

/**
 * @fileOverview This file defines a Genkit flow for real-time scam detection in messages.
 *
 * The flow analyzes incoming messages from WhatsApp, SMS, and Telegram to identify potential scams.
 * It uses AI to detect scams like fake job offers or urgent money requests, providing immediate warnings to the user.
 *
 * @exports {
 *   analyzeMessage,
 *   AnalyzeMessageInput,
 *   AnalyzeMessageOutput,
 * }
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the analyzeMessage flow.
 */
const AnalyzeMessageInputSchema = z.object({
  message: z.string().describe('The content of the message to analyze.'),
  source: z
    .enum(['WHATSAPP', 'SMS', 'TELEGRAM'])
    .describe('The source of the message.'),
});
export type AnalyzeMessageInput = z.infer<typeof AnalyzeMessageInputSchema>;

/**
 * Output schema for the analyzeMessage flow.
 */
const AnalyzeMessageOutputSchema = z.object({
  isScam: z.boolean().describe('Whether the message is likely a scam.'),
  scamType: z
    .string()
    .optional()
    .describe('The type of scam detected, if any.'),
  confidence: z
    .number()
    .optional()
    .describe('The confidence level of the scam detection (0-1).'),
  explanation: z
    .string()
    .optional()
    .describe('A brief explanation of why the message is considered a scam, potentially including why it might be effective or who it targets.'),
});

export type AnalyzeMessageOutput = z.infer<typeof AnalyzeMessageOutputSchema>;

/**
 * Analyzes a message for potential scams.
 * @param input The input containing the message content and source.
 * @returns A promise resolving to the analysis result.
 */
export async function analyzeMessage(input: AnalyzeMessageInput): Promise<AnalyzeMessageOutput> {
  return analyzeMessageFlow(input);
}

const analyzeMessagePrompt = ai.definePrompt({
  name: 'analyzeMessagePrompt',
  input: {schema: AnalyzeMessageInputSchema},
  output: {schema: AnalyzeMessageOutputSchema},
  prompt: `You are an AI assistant specializing in detecting scams and fraud in messages, particularly those relevant to users in Tunisia.

  Analyze the following message and determine if it is a scam. Provide a confidence score (0-1).
  If it is a scam, identify the type of scam and provide a brief explanation. In your explanation, if relevant, include context about why such a scam might be effective or who it might typically target.

  Message Source: {{{source}}}
  Message Content: {{{message}}}

  Respond in JSON format.
  `,
});

const analyzeMessageFlow = ai.defineFlow(
  {
    name: 'analyzeMessageFlow',
    inputSchema: AnalyzeMessageInputSchema,
    outputSchema: AnalyzeMessageOutputSchema,
  },
  async input => {
    const {output} = await analyzeMessagePrompt(input);
    return output!;
  }
);
