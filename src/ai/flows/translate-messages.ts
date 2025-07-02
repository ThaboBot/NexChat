// This is an AI-powered tool that translates text into a target language.
// - translateMessage - A function that translates the input message into the target language.
// - TranslateMessagesInput - The input type for the translateMessage function.
// - TranslateMessagesOutput - The return type for the translateMessage function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateMessagesInputSchema = z.object({
  message: z.string().describe('The message to translate.'),
  targetLanguage: z.string().describe('The target language for translation.'),
});
export type TranslateMessagesInput = z.infer<typeof TranslateMessagesInputSchema>;

const TranslateMessagesOutputSchema = z.object({
  translatedMessage: z.string().describe('The translated message.'),
});
export type TranslateMessagesOutput = z.infer<typeof TranslateMessagesOutputSchema>;

export async function translateMessages(input: TranslateMessagesInput): Promise<TranslateMessagesOutput> {
  return translateMessagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateMessagesPrompt',
  input: {schema: TranslateMessagesInputSchema},
  output: {schema: TranslateMessagesOutputSchema},
  prompt: `Translate the following message into {{targetLanguage}}:\n\n{{message}}`,
});

const translateMessagesFlow = ai.defineFlow(
  {
    name: 'translateMessagesFlow',
    inputSchema: TranslateMessagesInputSchema,
    outputSchema: TranslateMessagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
