'use server';
/**
 * @fileOverview A flow to generate auto-replies based on the user's routine.
 *
 * - generateAutoReply - A function that generates an auto-reply based on the user's routine and the incoming message.
 * - GenerateAutoReplyInput - The input type for the generateAutoReply function.
 * - GenerateAutoReplyOutput - The return type for the generateAutoReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAutoReplyInputSchema = z.object({
  userRoutine: z
    .string()
    .describe('The user routine, including time and activities.'),
  incomingMessage: z.string().describe('The incoming message to reply to.'),
});
export type GenerateAutoReplyInput = z.infer<typeof GenerateAutoReplyInputSchema>;

const GenerateAutoReplyOutputSchema = z.object({
  autoReply: z.string().describe('The generated auto-reply message.'),
});
export type GenerateAutoReplyOutput = z.infer<typeof GenerateAutoReplyOutputSchema>;

export async function generateAutoReply(input: GenerateAutoReplyInput): Promise<GenerateAutoReplyOutput> {
  return generateAutoReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAutoReplyPrompt',
  input: {schema: GenerateAutoReplyInputSchema},
  output: {schema: GenerateAutoReplyOutputSchema},
  prompt: `You are a helpful assistant that generates auto-replies based on the user's routine.

  User Routine: {{{userRoutine}}}
  Incoming Message: {{{incomingMessage}}}

  Generate an auto-reply that acknowledges the message and explains that the user is currently busy based on their routine. The auto-reply should be concise and informative.
  `,
});

const generateAutoReplyFlow = ai.defineFlow(
  {
    name: 'generateAutoReplyFlow',
    inputSchema: GenerateAutoReplyInputSchema,
    outputSchema: GenerateAutoReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
