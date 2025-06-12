
'use server';

/**
 * @fileOverview An AI agent that analyzes audio content for potentially suspicious, fraudulent, manipulative, or harmful elements.
 *
 * - callShield - A function that handles the audio analysis process. (Note: Name retained for now, but functionality is generalized)
 * - CallShieldInput - The input type for the callShield function.
 * - CallShieldOutput - The return type for the callShield function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CallShieldInputSchema = z.object({
  callRecordingDataUri: z // Name retained, but represents any audio data URI
    .string()
    .describe(
      'An audio recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type CallShieldInput = z.infer<typeof CallShieldInputSchema>;

const CallShieldOutputSchema = z.object({
  isScam: z.boolean().describe('Whether or not the audio is likely suspicious or harmful.'),
  reason: z.string().describe('The reason why the audio is classified as suspicious/harmful or benign.'),
});
export type CallShieldOutput = z.infer<typeof CallShieldOutputSchema>;

export async function callShield(input: CallShieldInput): Promise<CallShieldOutput> {
  return callShieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'audioAnalysisPrompt', // Renamed prompt for clarity
  input: {schema: CallShieldInputSchema},
  output: {schema: CallShieldOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing audio content for potentially suspicious, fraudulent, manipulative, or harmful elements.

  You will be given an audio recording. Analyze its content carefully.
  Identify any parts of the audio that seem deceptive, coercive, aim to mislead, or could potentially harm the listener or others.
  This could include, but is not limited to, scam tactics (like pressure for money, requests for sensitive information, fake emergencies), misinformation, hate speech, or harassment.

  Based on your analysis:
  - If the audio contains such elements, set the 'isScam' output field to true (interpreting 'isScam' broadly as 'isSuspiciousOrHarmful'). Provide a 'reason' detailing what you detected and why it's problematic.
  - If the audio appears benign and free of such elements, set the 'isScam' output field to false. Provide a 'reason' confirming its benign nature or stating that no suspicious elements were found.

  Audio: {{media url=callRecordingDataUri}}`,
});

const callShieldFlow = ai.defineFlow(
  {
    name: 'audioAnalysisFlow', // Renamed flow for clarity
    inputSchema: CallShieldInputSchema,
    outputSchema: CallShieldOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
