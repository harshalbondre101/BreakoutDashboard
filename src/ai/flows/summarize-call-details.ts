'use server';

/**
 * @fileOverview Summarizes call details, including customer sentiment, topics discussed, and outcomes.
 *
 * - summarizeCallDetails - A function that summarizes call details.
 * - SummarizeCallDetailsInput - The input type for the summarizeCallDetails function.
 * - SummarizeCallDetailsOutput - The return type for the summarizeCallDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCallDetailsInputSchema = z.object({
  transcript: z.string().describe('The transcript of the call.'),
});
export type SummarizeCallDetailsInput = z.infer<typeof SummarizeCallDetailsInputSchema>;

const SummarizeCallDetailsOutputSchema = z.object({
  sentiment: z.string().describe('The overall sentiment of the customer during the call (e.g., positive, negative, neutral).'),
  topics: z.string().describe('The main topics discussed during the call.'),
  outcome: z.string().describe('The outcome of the call (e.g., issue resolved, follow-up required).'),
  summary: z.string().describe('A concise summary of the call, including sentiment, topics, and outcome.'),
});
export type SummarizeCallDetailsOutput = z.infer<typeof SummarizeCallDetailsOutputSchema>;

export async function summarizeCallDetails(input: SummarizeCallDetailsInput): Promise<SummarizeCallDetailsOutput> {
  return summarizeCallDetailsFlow(input);
}

const summarizeCallDetailsPrompt = ai.definePrompt({
  name: 'summarizeCallDetailsPrompt',
  input: {schema: SummarizeCallDetailsInputSchema},
  output: {schema: SummarizeCallDetailsOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing call details from call center transcripts.

  Analyze the following call transcript and provide a summary including the customer's sentiment, the topics discussed, and the outcome of the call.
  \n
  Transcript: {{{transcript}}}

  \n
  Consider these guidelines for your output:
  - Sentiment: Determine the overall sentiment of the customer (positive, negative, or neutral).
  - Topics: Identify the main subjects discussed during the conversation.
  - Outcome: Describe the resolution or final status of the call (e.g., issue resolved, further action needed).
  - Summary: Provide a brief overview of the call, incorporating sentiment, topics, and outcome.
  `,
});

const summarizeCallDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeCallDetailsFlow',
    inputSchema: SummarizeCallDetailsInputSchema,
    outputSchema: SummarizeCallDetailsOutputSchema,
  },
  async input => {
    const {output} = await summarizeCallDetailsPrompt(input);
    return output!;
  }
);
