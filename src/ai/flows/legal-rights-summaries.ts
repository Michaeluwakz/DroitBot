// LegalRightsSummaries.ts
'use server';

/**
 * @fileOverview Summarizes legal rights on various topics, with specific knowledge on Tunisian data protection, in the requested language.
 *
 * - legalRightsSummaries - A function that summarizes the legal rights on the provided topic in the specified language.
 * - LegalRightsSummariesInput - The input type for the legalRightsSummaries function.
 * - LegalRightsSummariesOutput - The return type for the legalRightsSummaries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LegalRightsSummariesInputSchema = z.object({
  topic: z.string().describe('The legal topic to summarize rights for, e.g., employment, housing, data protection, etc.'),
  country: z.string().optional().default('Tunisia').describe('The country for which the legal rights should be summarized. Defaults to Tunisia.'),
  language: z.enum(['en', 'fr', 'ar']).default('en').describe('The desired language for the response (en, fr, ar).'),
});
export type LegalRightsSummariesInput = z.infer<typeof LegalRightsSummariesInputSchema>;

const LegalRightsSummariesOutputSchema = z.object({
  summary: z.string().describe('A summary of the legal rights on the topic, considering specific Tunisian data protection laws if relevant, in the requested language.'),
});
export type LegalRightsSummariesOutput = z.infer<typeof LegalRightsSummariesOutputSchema>;

export async function legalRightsSummaries(input: LegalRightsSummariesInput): Promise<LegalRightsSummariesOutput> {
  return legalRightsSummariesFlow(input);
}

const dataProtectionKnowledge = `
Key Information on Tunisian Data Protection and Sovereignty (use if topic is related to data privacy, data protection, or digital rights):

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

const prompt = ai.definePrompt({
  name: 'legalRightsSummariesPrompt',
  input: {schema: LegalRightsSummariesInputSchema},
  output: {schema: LegalRightsSummariesOutputSchema},
  prompt: `You are a legal expert specializing in providing summaries of legal rights.
Your response MUST be in the language specified by the 'language' input field: {{language}}.

Summarize the legal rights for the following topic in {{{country}}}:

Topic: {{{topic}}}

If the topic is related to data protection, privacy, or digital rights in Tunisia, heavily utilize the following specific information:
${dataProtectionKnowledge}
`,
});

const legalRightsSummariesFlow = ai.defineFlow(
  {
    name: 'legalRightsSummariesFlow',
    inputSchema: LegalRightsSummariesInputSchema,
    outputSchema: LegalRightsSummariesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
