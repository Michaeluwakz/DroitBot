
'use server';
/**
 * @fileOverview Provides a checklist of required steps, official links, and estimated costs/timelines for common customs and bureaucratic procedures in Tunisia.
 *
 * - customsBureaucracyHelp - A function that provides help for Tunisian customs and bureaucratic procedures.
 * - CustomsBureaucracyHelpInput - The input type for the customsBureaucracyHelp function.
 * - CustomsBureaucracyHelpOutput - The return type for the customsBureaucracyHelp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomsBureaucracyHelpInputSchema = z.object({
  procedure: z
    .string()
    .describe('The specific customs or bureaucratic procedure to get help with.'),
  language: z.enum(['en', 'fr', 'ar']).describe('The desired language for the response (en, fr, ar).'),
});
export type CustomsBureaucracyHelpInput = z.infer<
  typeof CustomsBureaucracyHelpInputSchema
>;

const CustomsBureaucracyHelpOutputSchema = z.object({
  checklist: z.array(z.string()).describe('A list of steps required for the procedure.'),
  officialLinks: z
    .array(z.string().url())
    .describe('Official government links related to the procedure.'),
  costEstimate: z.string().optional().describe('An estimated cost for the procedure, if available (e.g., "Approximately 50 TND").'),
  timelineEstimate: z.string().optional().describe('An estimated timeline for completing the procedure, if available (e.g., "Around 2-3 weeks").'),
  toolResponseMessage: z.string().optional().describe("A message regarding the outcome of using the link finding tool, if applicable.")
});
export type CustomsBureaucracyHelpOutput = z.infer<
  typeof CustomsBureaucracyHelpOutputSchema
>;

const mockProcedureLinks: Record<string, string[]> = {
  "passport renewal": [
    "https://www.interieur.gov.tn/procedures/passeports",
    "https://consulat.gov.tn/passeports",
  ],
  "car import": [
    "https://www.douane.gov.tn/reglementation/vehicules/",
    "https://www.attt.com.tn/fr/pro_service/immatveh/",
  ],
  "birth certificate": [
    "https://www.commune-tunis.gov.tn/publish/content/article.asp?id=361",
    "https://www.e-justice.tn/web/guest/services-en-ligne",
  ],
  "driving license": [
    "https://www.attt.com.tn/fr/pro_service/permiscon/",
    "https://www.interieur.gov.tn/procedures/permis-de-conduire",
  ],
  "national id card": [
    "https://www.interieur.gov.tn/procedures/cin",
  ],
  "business registration": [
    "https://www.registre-commerce.tn/",
    "https://www.apii.tn/constitution-entreprise",
  ],
  "visa application": [
    "https://diplomatie.gov.tn/index.php?id=80", // Ministry of Foreign Affairs visa info
    // Specific embassy links would vary greatly, so a general MFA link is safer
  ],
  "tax declaration": [
    "https://www.impots.finances.gov.tn/", // Ministry of Finance tax portal
  ]
};

const findOfficialProcedureLinksTool = ai.defineTool(
  {
    name: 'findOfficialProcedureLinksTool',
    description: 'Finds known official Tunisian government links for a given customs or bureaucratic procedure.',
    inputSchema: z.object({
      procedure: z.string().describe('The name of the procedure to find links for.'),
      language: z.string().describe('The target language for any messaging (en, fr, ar).')
    }),
    outputSchema: z.object({
      links: z.array(z.string().url()).describe('A list of official URLs.'),
      message: z.string().optional().describe('A message about the outcome, e.g., if no specific links were found.')
    }),
  },
  async (input) => {
    const procedureNormalized = input.procedure.toLowerCase().trim();
    let foundLinks: string[] = [];
    let message: string | undefined = undefined;

    for (const key in mockProcedureLinks) {
      if (procedureNormalized.includes(key)) {
        foundLinks = [...foundLinks, ...mockProcedureLinks[key]];
      }
    }
    const uniqueLinks = Array.from(new Set(foundLinks));
    const finalLinks = uniqueLinks.slice(0, 3); // Limit to 3 links

    if (finalLinks.length === 0) {
      if (input.language === 'ar') {
        message = "لم يتمكن أداة البحث من العثور على روابط محددة لهذا الإجراء. قد تكون الروابط العامة للمواقع الحكومية مفيدة.";
      } else if (input.language === 'fr') {
        message = "L'outil de recherche n'a pas trouvé de liens spécifiques pour cette procédure. Les portails gouvernementaux généraux pourraient être utiles.";
      } else {
        message = "The link finding tool could not find specific links for this procedure. General government portals might be useful.";
      }
    }
    return { links: finalLinks, message };
  }
);


export async function customsBureaucracyHelp(
  input: CustomsBureaucracyHelpInput
): Promise<CustomsBureaucracyHelpOutput> {
  return customsBureaucracyHelpFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customsBureaucracyHelpPrompt',
  input: {schema: CustomsBureaucracyHelpInputSchema},
  output: {schema: CustomsBureaucracyHelpOutputSchema},
  tools: [findOfficialProcedureLinksTool],
  prompt: `You are an AI assistant specialized in providing guidance for customs and bureaucratic procedures in Tunisia.
Your response MUST be in the language specified by the 'language' input field: {{language}}.

The user is asking for help with the following procedure: {{{procedure}}}

First, use the 'findOfficialProcedureLinksTool' with the 'procedure' and 'language' to find relevant official URLs.
- If the tool returns links, prioritize using these in the 'officialLinks' field of your output.
- Include any 'message' from the tool's output in the 'toolResponseMessage' field.

Then, provide:
1. A 'checklist' of the required steps for the procedure in {{language}}.
2. An 'estimatedCost' if applicable and reasonably known for Tunisia (e.g., "Approximately 50 TND") in {{language}}.
3. An 'estimatedTimeline' if applicable and reasonably known (e.g., "Around 2-3 weeks") in {{language}}.

If cost or timeline information is not readily available or varies greatly, you can state that in {{language}} or omit those fields.
If the tool did not find specific links and you are providing general portal links, ensure they are official Tunisian government domains (like .gov.tn, .tn). If you cannot confidently provide any official links, the 'officialLinks' array should be empty.
Be as specific as possible.
`,
});

const customsBureaucracyHelpFlow = ai.defineFlow(
  {
    name: 'customsBureaucracyHelpFlow',
    inputSchema: CustomsBureaucracyHelpInputSchema,
    outputSchema: CustomsBureaucracyHelpOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      // Fallback in case the LLM fails to produce an output
      let fallbackMessage = "Could not retrieve information for this procedure.";
      if (input.language === 'fr') fallbackMessage = "Impossible de récupérer les informations pour cette procédure.";
      if (input.language === 'ar') fallbackMessage = "تعذر استرداد المعلومات لهذا الإجراء.";
      return {
        checklist: [fallbackMessage],
        officialLinks: [],
        toolResponseMessage: fallbackMessage,
      };
    }
     // Ensure officialLinks is always an array, even if the LLM makes a mistake.
    if (!Array.isArray(output.officialLinks)) {
        output.officialLinks = [];
    }
    return output;
  }
);
