// src/ai/flows/message-rewriter.ts
'use server';

/**
 * @fileOverview A message re-writing AI agent. It rewrites messages in different styles as requested by the user.
 *
 * - rewriteMessage - A function that handles the message re-writing process.
 * - RewriteMessageInput - The input type for the rewriteMessage function.
 * - RewriteMessageOutput - The return type for the rewriteMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteMessageInputSchema = z.object({
  message: z.string().describe('The message to be rewritten.'),
  style: z.string().describe('The style to rewrite the message in (e.g., professional, funny, persuasive).'),
});
export type RewriteMessageInput = z.infer<typeof RewriteMessageInputSchema>;

const RewriteMessageOutputSchema = z.object({
  rewrittenMessage: z.string().describe('The rewritten message in the specified style.'),
});
export type RewriteMessageOutput = z.infer<typeof RewriteMessageOutputSchema>;

export async function rewriteMessage(input: RewriteMessageInput): Promise<RewriteMessageOutput> {
  return rewriteMessageFlow(input);
}

const rewriteMessagePrompt = ai.definePrompt({
  name: 'rewriteMessagePrompt',
  input: {schema: RewriteMessageInputSchema},
  output: {schema: RewriteMessageOutputSchema},
  prompt: `Rewrite the following message in a {{{style}}} style:\n\n{{{message}}}`,
});

const rewriteMessageFlow = ai.defineFlow(
  {
    name: 'rewriteMessageFlow',
    inputSchema: RewriteMessageInputSchema,
    outputSchema: RewriteMessageOutputSchema,
  },
  async input => {
    const {output} = await rewriteMessagePrompt(input);
    return output!;
  }
);
