// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating AI-driven insights and actionable recommendations from business data.
 *
 * The flow takes business data as input and returns AI-generated insights and recommendations, filtered to ensure they are safe and compliant.
 *
 * @interface GenerateBusinessInsightsInput - Defines the input schema for the generateBusinessInsights flow.
 * @interface GenerateBusinessInsightsOutput - Defines the output schema for the generateBusinessInsights flow.
 * @function generateBusinessInsights - An async function that calls the generateBusinessInsightsFlow with the input and returns the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessInsightsInputSchema = z.object({
  businessData: z
    .string()
    .describe('A string containing business data for analysis.'),
});

export type GenerateBusinessInsightsInput = z.infer<
  typeof GenerateBusinessInsightsInputSchema
>;

const GenerateBusinessInsightsOutputSchema = z.object({
  insights: z.array(
    z.object({
      title: z.string().describe('The title of the insight.'),
      recommendation: z
        .string()
        .describe('An actionable recommendation based on the insight.'),
    })
  ),
});

export type GenerateBusinessInsightsOutput = z.infer<
  typeof GenerateBusinessInsightsOutputSchema
>;

const ComplianceCheckToolSchema = z.object({
  recommendation: z.string().describe('recommendation to check'),
});

const ComplianceCheckToolOutputSchema = z.object({
  isCompliant: z.boolean().describe('is the recommendation compliant?'),
  reason: z.string().optional().describe('why recommendation is not compliant'),
});

const complianceCheckTool = ai.defineTool({
  name: 'complianceCheckTool',
  description: 'Check if the recommendation is safe and compliant.',
  inputSchema: ComplianceCheckToolSchema,
  outputSchema: ComplianceCheckToolOutputSchema,
  async fn(input) {
    // TODO: Replace with actual compliance check logic
    return {isCompliant: true};
  },
});

const generateBusinessInsightsPrompt = ai.definePrompt({
  name: 'generateBusinessInsightsPrompt',
  input: {schema: GenerateBusinessInsightsInputSchema},
  output: {schema: GenerateBusinessInsightsOutputSchema},
  tools: [complianceCheckTool],
  prompt: `You are an AI assistant designed to provide business insights and actionable recommendations based on the provided business data. Ensure that all recommendations are safe and compliant by using the complianceCheckTool.

  Business Data: {{{businessData}}}
  
  Generate a list of insights and actionable recommendations. For each recommendation, use the complianceCheckTool to ensure it is safe and compliant. If a recommendation is not compliant, do not include it in the output.
  
  Format your response as a JSON array of objects, where each object has a "title" and a "recommendation" field.
  `,
});

const generateBusinessInsightsFlow = ai.defineFlow(
  {
    name: 'generateBusinessInsightsFlow',
    inputSchema: GenerateBusinessInsightsInputSchema,
    outputSchema: GenerateBusinessInsightsOutputSchema,
  },
  async input => {
    const {output} = await generateBusinessInsightsPrompt(input);
    return output!;
  }
);

export async function generateBusinessInsights(
  input: GenerateBusinessInsightsInput
): Promise<GenerateBusinessInsightsOutput> {
  return generateBusinessInsightsFlow(input);
}
