
// src/ai/flows/image-pdf-fraud-check.ts
'use server';
/**
 * @fileOverview This file contains a Genkit flow for checking images and PDFs for fraud.
 *
 * - imagePdfFraudCheck -  A function that takes an image or PDF as input and returns a fraud assessment.
 * - ImagePdfFraudCheckInput - The input type for the imagePdfFraudCheck function.
 * - ImagePdfFraudCheckOutput - The output type for the imagePdfFraudCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImagePdfFraudCheckInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A file (image or PDF) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().optional().describe('Optional description of the document.'),
});
export type ImagePdfFraudCheckInput = z.infer<typeof ImagePdfFraudCheckInputSchema>;

const ImagePdfFraudCheckOutputSchema = z.object({
  isFraudulent: z.boolean().describe('Whether the document is likely fraudulent.'),
  confidence: z.number().describe('Confidence level of the fraud assessment (0-1).'),
  reason: z.string().describe('Explanation of why the document is considered fraudulent or not.'),
});
export type ImagePdfFraudCheckOutput = z.infer<typeof ImagePdfFraudCheckOutputSchema>;

export async function imagePdfFraudCheck(input: ImagePdfFraudCheckInput): Promise<ImagePdfFraudCheckOutput> {
  return imagePdfFraudCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imagePdfFraudCheckPrompt',
  input: {schema: ImagePdfFraudCheckInputSchema},
  output: {schema: ImagePdfFraudCheckOutputSchema},
  prompt: `You are an expert in fraud detection, specializing in identifying fraudulent documents such as fake court orders and contracts.
  Analyze the provided document (image or PDF) for signs of fraud.

  Consider details like official seals, signatures, formatting inconsistencies, unusual requests, and any other suspicious elements.

  Description: {{{description}}}
  Document: {{media url=fileDataUri}}

  Based on your analysis, determine if the document is likely fraudulent. Provide a confidence level (0-1) and explain your reasoning.
  Respond in a structured JSON format.
  `,
});

const imagePdfFraudCheckFlow = ai.defineFlow(
  {
    name: 'imagePdfFraudCheckFlow',
    inputSchema: ImagePdfFraudCheckInputSchema,
    outputSchema: ImagePdfFraudCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
