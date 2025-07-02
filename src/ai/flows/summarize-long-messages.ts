// src/ai/flows/summarize-long-messages.ts
'use server';

/**
 * @fileOverview Message summarization flow specifically designed for long messages.
 *
 * - summarizeLongMessage - A function that summarizes a given long message.
 * - SummarizeLongMessageInput - The input type for the summarizeLongMessage function.
 * - SummarizeLongMessageOutput - The return type for the summarizeLongMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLongMessageInputSchema = z.object({
  message: z.string().describe('The long message to be summarized.'),
});
export type SummarizeLongMessageInput = z.infer<typeof SummarizeLongMessageInputSchema>;

const SummarizeLongMessageOutputSchema = z.object({
  summary: z.string().describe('The summarized message.'),
});
export type SummarizeLongMessageOutput = z.infer<typeof SummarizeLongMessageOutputSchema>;

export async function summarizeLongMessage(input: SummarizeLongMessageInput): Promise<SummarizeLongMessageOutput> {
  return summarizeLongMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLongMessagePrompt',
  input: {schema: SummarizeLongMessageInputSchema},
  output: {schema: SummarizeLongMessageOutputSchema},
  prompt: `Summarize the following long message: {{{message}}}`,
});

const summarizeLongMessageFlow = ai.defineFlow(
  {
    name: 'summarizeLongMessageFlow',
    inputSchema: SummarizeLongMessageInputSchema,
    outputSchema: SummarizeLongMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
