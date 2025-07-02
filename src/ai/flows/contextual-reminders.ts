'use server';

/**
 * @fileOverview This file defines a Genkit flow for setting contextual reminders based on past conversations.
 *
 * - contextualReminders - A function that sets contextual reminders.
 * - ContextualRemindersInput - The input type for the contextualReminders function.
 * - ContextualRemindersOutput - The return type for the contextualReminders function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualRemindersInputSchema = z.object({
  conversationHistory: z.string().describe('The history of the conversation.'),
  reminderQuery: z.string().describe('The specific information the user wants to be reminded about.'),
});
export type ContextualRemindersInput = z.infer<typeof ContextualRemindersInputSchema>;

const ContextualRemindersOutputSchema = z.object({
  reminder: z.string().describe('The contextual reminder based on the conversation history.'),
});
export type ContextualRemindersOutput = z.infer<typeof ContextualRemindersOutputSchema>;

export async function contextualReminders(input: ContextualRemindersInput): Promise<ContextualRemindersOutput> {
  return contextualRemindersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualRemindersPrompt',
  input: {schema: ContextualRemindersInputSchema},
  output: {schema: ContextualRemindersOutputSchema},
  prompt: `You are an AI assistant designed to create contextual reminders based on chat history.

  Given the following conversation history:
  {{conversationHistory}}

  And the user's request to be reminded about:
  {{reminderQuery}}

  Generate a concise and helpful reminder that captures the key details.
  The reminder should be a single sentence.
  Make it very clear what the reminder is in reference to, but be as brief as possible.
  `,
});

const contextualRemindersFlow = ai.defineFlow(
  {
    name: 'contextualRemindersFlow',
    inputSchema: ContextualRemindersInputSchema,
    outputSchema: ContextualRemindersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
