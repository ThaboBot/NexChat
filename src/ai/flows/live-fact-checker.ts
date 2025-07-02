// This is an auto-generated file from Firebase Studio.
'use server';

/**
 * @fileOverview A live fact checker AI agent.
 *
 * - liveFactChecker - A function that handles the fact checking process.
 * - LiveFactCheckerInput - The input type for the liveFactChecker function.
 * - LiveFactCheckerOutput - The return type for the liveFactChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LiveFactCheckerInputSchema = z.object({
  statement: z.string().describe('The statement to fact check.'),
});
export type LiveFactCheckerInput = z.infer<typeof LiveFactCheckerInputSchema>;

const LiveFactCheckerOutputSchema = z.object({
  isCorrect: z.boolean().describe('Whether or not the statement is correct.'),
  explanation: z.string().describe('The explanation of why the statement is correct or incorrect.'),
  source: z.string().optional().describe('The source of the information.'),
});
export type LiveFactCheckerOutput = z.infer<typeof LiveFactCheckerOutputSchema>;

export async function liveFactChecker(input: LiveFactCheckerInput): Promise<LiveFactCheckerOutput> {
  return liveFactCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'liveFactCheckerPrompt',
  input: {schema: LiveFactCheckerInputSchema},
  output: {schema: LiveFactCheckerOutputSchema},
  prompt: `You are a fact-checking expert. Your job is to determine whether a given statement is correct or not.

Statement: {{{statement}}}

Respond in the format:
{
  "isCorrect": true or false,
  "explanation": "Explanation of why the statement is correct or incorrect.",
  "source": "Source of the information. Include the URL if available."
}
`,
});

const liveFactCheckerFlow = ai.defineFlow(
  {
    name: 'liveFactCheckerFlow',
    inputSchema: LiveFactCheckerInputSchema,
    outputSchema: LiveFactCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
