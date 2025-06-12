
'use server';

/**
 * @fileOverview This file contains the Genkit flow for debunking misinformation using an agentic workflow.
 *
 * - debunkMisinformation - An exported function that takes a piece of news and returns an analysis of its veracity,
 *   simulating web searches to cross-check claims.
 * - DebunkMisinformationInput - The input type for the debunkMisinformation function.
 * - DebunkMisinformationOutput - The output type for the debunkMisinformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DebunkMisinformationInputSchema = z.object({
  newsContent: z
    .string()
    .describe('The content of the news article or statement to be checked.'),
});
export type DebunkMisinformationInput = z.infer<typeof DebunkMisinformationInputSchema>;

const DebunkMisinformationOutputSchema = z.object({
  isMisinformation: z.boolean().describe('Whether the content is likely misinformation based on simulated web search and analysis.'),
  explanation: z.string().describe('Explanation of why the content is considered misinformation, referencing insights from simulated web search results.'),
  trustedSources: z
    .array(z.string())
    .describe('Links from simulated trusted sources that contradict or clarify the misinformation.'),
});
export type DebunkMisinformationOutput = z.infer<typeof DebunkMisinformationOutputSchema>;

// Mock Web Search Tool
const webSearchTool = ai.defineTool(
  {
    name: 'webSearchTool',
    description: 'Performs a simulated web search to find information and news articles related to a given query. Returns mock search results.',
    inputSchema: z.object({
      query: z.string().describe('The search query based on the news claim.'),
    }),
    outputSchema: z.object({
      results: z.array(
        z.object({
          title: z.string().describe('The title of the mock search result.'),
          link: z.string().url().describe('The URL of the mock search result.'),
          snippet: z.string().describe('A brief snippet from the mock search result.'),
        })
      ).describe('A list of mock search results.'),
    }),
  },
  async (input) => {
    const query = input.query.toLowerCase();
    let mockResults = [
      {
        title: "Official Tunisian News Agency - Report on Recent Developments",
        link: "https://www.tap.info.tn/latest-news",
        snippet: "TAP provides official updates and reports on various national topics, cross-referenced with governmental sources."
      },
      {
        title: "Independent Fact-Checking Initiative Tunisia - Analysis of Online Claims",
        link: "https://www.tunisia-factcheck.org/claims-review",
        snippet: "Our latest investigation reviews several trending online claims, providing evidence-based analysis."
      }
    ];

    if (query.includes("health") || query.includes("صحة") || query.includes("covid")) {
      mockResults.push({
        title: "Ministry of Health Tunisia - Public Health Advisory",
        link: "https://www.santetunisie.tn/advisories",
        snippet: "The Ministry of Health issues guidelines and clarifications regarding current public health concerns and information."
      });
    }
    if (query.includes("election") || query.includes("انتخابات") || query.includes("political")) {
      mockResults.push({
        title: "ISIE (Independent High Authority for Elections) - Official Statements",
        link: "https://www.isie.tn/official-statements",
        snippet: "ISIE provides official information and updates concerning electoral processes and regulations in Tunisia."
      });
    }
    if (query.includes("finance") || query.includes("economy") || query.includes("مالية")) {
        mockResults.push({
            title: "Central Bank of Tunisia - Economic Outlook",
            link: "https://www.bct.gov.tn/economic-outlook",
            snippet: "The Central Bank of Tunisia offers insights and data on the national economic situation."
        });
    }
     mockResults.push({
        title: "Global News Network - International Perspective on Tunisian Affairs",
        link: "https://www.globalnews.example.com/tunisia-desk",
        snippet: "Reporting on Tunisia from an international viewpoint, covering various socio-political topics."
    });

    // Simulate some variability
    return { results: mockResults.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2) }; // Returns 2 to 3 results
  }
);


export async function debunkMisinformation(input: DebunkMisinformationInput): Promise<DebunkMisinformationOutput> {
  return debunkMisinformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'misinformationDebunkingPrompt',
  input: {schema: DebunkMisinformationInputSchema},
  output: {schema: DebunkMisinformationOutputSchema},
  tools: [webSearchTool],
  prompt: `You are an AI assistant for DroitBot, specializing in identifying and debunking misinformation, particularly related to political or health topics relevant to Tunisia. You have access to a simulated web search tool.

Your primary goal is to determine if the provided 'newsContent' is misinformation by using the simulated web search tool and then to explain your findings.

Follow these steps:
1.  Carefully analyze the '{{{newsContent}}}' provided by the user to understand its core claims.
2.  Based on these claims, formulate one or two concise and effective search queries.
3.  Use the 'webSearchTool' by calling it with your formulated search query/queries.
4.  Critically evaluate the simulated search results provided by the tool.
5.  Based on your analysis of the simulated search results, determine if the '{{{newsContent}}}' is likely misinformation.
6.  Construct your 'explanation':
    *   Clearly state your conclusion (whether it's misinformation or not).
    *   If it is misinformation, explain why, referencing specific (simulated) information or a lack of corroboration from the search results.
    *   If the search results are inconclusive, or if they appear to support the claim, state that clearly in your explanation. Be cautious and indicate if the provided tools results are limited.
7.  Populate the 'trustedSources' array with 1-2 relevant links *from the simulated search results* that support your explanation or offer clarifying information. Prioritize links that appear to be from official Tunisian government sources or well-known fact-checking organizations if they are present in the simulated results. If the search tool returns no relevant links for this purpose, this array can be empty.

News Content: {{{newsContent}}}

Respond ONLY in the following JSON format. Do not add any text before or after the JSON block:
{
  "isMisinformation": true/false,
  "explanation": "Your detailed explanation, incorporating insights from the simulated web search results. Mention that the search is simulated if results are sparse or very generic.",
  "trustedSources": ["link_from_simulated_search_1", "link_from_simulated_search_2"]
}
`,
});

const debunkMisinformationFlow = ai.defineFlow(
  {
    name: 'debunkMisinformationFlow',
    inputSchema: DebunkMisinformationInputSchema,
    outputSchema: DebunkMisinformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure output is always valid, even if the LLM fails to generate parts of it perfectly
    if (!output) {
        return {
            isMisinformation: false,
            explanation: "The AI was unable to process the request or the provided news content effectively with the simulated search. Please try rephrasing or provide more specific content. Note: Web search is simulated.",
            trustedSources: []
        };
    }
    return {
        isMisinformation: output.isMisinformation || false,
        explanation: output.explanation || "Analysis inconclusive. Simulated web search did not yield definitive results for the provided content.",
        trustedSources: output.trustedSources || []
    };
  }
);
