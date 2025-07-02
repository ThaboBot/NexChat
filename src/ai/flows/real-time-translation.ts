// This is an AI-powered tool that translates text into a target language.
// - translateMessage - A function that translates the input message into the target language.
// - RealTimeTranslationInput - The input type for the translateMessage function.
// - RealTimeTranslationOutput - The return type for the translateMessage function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RealTimeTranslationInputSchema = z.object({
  message: z.string().describe('The message to translate.'),
  targetLanguage: z.string().describe('The target language for translation.'),
});
export type RealTimeTranslationInput = z.infer<typeof RealTimeTranslationInputSchema>;

const RealTimeTranslationOutputSchema = z.object({
  translatedMessage: z.string().describe('The translated message.'),
});
export type RealTimeTranslationOutput = z.infer<typeof RealTimeTranslationOutputSchema>;

export async function translateMessage(input: RealTimeTranslationInput): Promise<RealTimeTranslationOutput> {
  return realTimeTranslationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'realTimeTranslationPrompt',
  input: {schema: RealTimeTranslationInputSchema},
  output: {schema: RealTimeTranslationOutputSchema},
  prompt: `Translate the following message into {{targetLanguage}}:\n\n{{message}}`,
});

const realTimeTranslationFlow = ai.defineFlow(
  {
    name: 'realTimeTranslationFlow',
    inputSchema: RealTimeTranslationInputSchema,
    outputSchema: RealTimeTranslationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
