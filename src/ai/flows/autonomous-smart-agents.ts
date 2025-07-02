'use server';

/**
 * @fileOverview A personal AI bot that summarizes chats, manages group spam, and gives reminders.
 *
 * - autonomousSmartAgents - A function that orchestrates the AI bot's actions.
 * - AutonomousSmartAgentsInput - The input type for the autonomousSmartAgents function.
 * - AutonomousSmartAgentsOutput - The return type for the autonomousSmartAgents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutonomousSmartAgentsInputSchema = z.object({
  chatHistory: z.string().describe('The complete chat history as a string.'),
  userQuery: z.string().describe('The latest user query or message.'),
});
export type AutonomousSmartAgentsInput = z.infer<typeof AutonomousSmartAgentsInputSchema>;

const AutonomousSmartAgentsOutputSchema = z.object({
  summary: z.string().describe('A summarized version of the chat history.'),
  spamReport: z.string().describe('A report on potential spam messages.'),
  reminders: z.string().describe('A list of identified reminders from the chat.'),
});
export type AutonomousSmartAgentsOutput = z.infer<typeof AutonomousSmartAgentsOutputSchema>;

export async function autonomousSmartAgents(
  input: AutonomousSmartAgentsInput
): Promise<AutonomousSmartAgentsOutput> {
  return autonomousSmartAgentsFlow(input);
}

const summarizeChatPrompt = ai.definePrompt({
  name: 'summarizeChatPrompt',
  input: {schema: AutonomousSmartAgentsInputSchema},
  output: {schema: z.string().describe('The summarized chat history.')},
  prompt: `Summarize the following chat history:\n\n{{{chatHistory}}}`,
});

const detectSpamPrompt = ai.definePrompt({
  name: 'detectSpamPrompt',
  input: {schema: AutonomousSmartAgentsInputSchema},
  output: {schema: z.string().describe('A report on potential spam messages.')},
  prompt: `Analyze the following chat history and identify any potential spam messages. Provide a report detailing the spam messages and why they are considered spam:\n\n{{{chatHistory}}}`,
});

const extractRemindersPrompt = ai.definePrompt({
  name: 'extractRemindersPrompt',
  input: {schema: AutonomousSmartAgentsInputSchema},
  output: {schema: z.string().describe('A list of identified reminders from the chat.')},
  prompt: `Extract any reminders from the following chat history.  Format each reminder with a specific date and time if available:\n\n{{{chatHistory}}}`,
});

const autonomousSmartAgentsFlow = ai.defineFlow(
  {
    name: 'autonomousSmartAgentsFlow',
    inputSchema: AutonomousSmartAgentsInputSchema,
    outputSchema: AutonomousSmartAgentsOutputSchema,
  },
  async input => {
    const summaryResult = await summarizeChatPrompt(input);
    const spamReportResult = await detectSpamPrompt(input);
    const remindersResult = await extractRemindersPrompt(input);

    return {
      summary: summaryResult.output!,
      spamReport: spamReportResult.output!,
      reminders: remindersResult.output!,
    };
  }
);
