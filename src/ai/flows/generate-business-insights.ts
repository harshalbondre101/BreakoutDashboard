'use server';
/**
 * @fileOverview A business insights AI agent.
 *
 * - generateBusinessInsights - A function that handles the business insights generation process.
 * - GenerateBusinessInsightsInput - The input type for the generateBusinessInsights function.
 * - GenerateBusinessInsightsOutput - The return type for the generateBusinessInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBusinessInsightsInputSchema = z.object({
  businessData: z.string().describe('A string of business data points.'),
});
export type GenerateBusinessInsightsInput = z.infer<typeof GenerateBusinessInsightsInputSchema>;

const GenerateBusinessInsightsOutputSchema = z.object({
  insights: z.array(z.object({
    title: z.string().describe('The title of the insight.'),
    recommendation: z.string().describe('The recommendation for the insight.'),
  })).describe('An array of insights and recommendations.')
});
export type GenerateBusinessInsightsOutput = z.infer<typeof GenerateBusinessInsightsOutputSchema>;

export async function generateBusinessInsights(input: GenerateBusinessInsightsInput): Promise<GenerateBusinessInsightsOutput> {
  return generateBusinessInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessInsightsPrompt',
  input: { schema: GenerateBusinessInsightsInputSchema },
  output: { schema: GenerateBusinessInsightsOutputSchema },
  prompt: `You are a business analyst. Based on the following data, provide 2-3 key insights and actionable recommendations.

Data:
{{{businessData}}}

Generate insights that are concise and recommendations that are practical.`,
});

const generateBusinessInsightsFlow = ai.defineFlow(
  {
    name: 'generateBusinessInsightsFlow',
    inputSchema: GenerateBusinessInsightsInputSchema,
    outputSchema: GenerateBusinessInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      return { insights: [] };
    }
    return output;
  }
);
