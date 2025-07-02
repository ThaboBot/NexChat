'use server';
/**
 * @fileOverview Implements the emotionally aware messages feature, detecting sentiment and suggesting tone corrections or displaying emotion-based emojis.
 *
 * - analyzeMessageSentiment - Analyzes the sentiment of a message.
 * - AnalyzeMessageSentimentInput - The input type for the analyzeMessageSentiment function.
 * - AnalyzeMessageSentimentOutput - The return type for the analyzeMessageSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMessageSentimentInputSchema = z.object({
  message: z.string().describe('The message to analyze.'),
});
export type AnalyzeMessageSentimentInput = z.infer<
  typeof AnalyzeMessageSentimentInputSchema
>;

const AnalyzeMessageSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the message (positive, negative, neutral).'
    ),
  suggestedToneCorrection: z
    .string()
    .describe(
      'A suggested tone correction for the message, if needed.  Empty string if no correction needed.'
    ),
  emotionEmoji: z.string().describe('An emoji representing the emotion.'),
});
export type AnalyzeMessageSentimentOutput = z.infer<
  typeof AnalyzeMessageSentimentOutputSchema
>;

export async function analyzeMessageSentiment(
  input: AnalyzeMessageSentimentInput
): Promise<AnalyzeMessageSentimentOutput> {
  return analyzeMessageSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMessageSentimentPrompt',
  input: {schema: AnalyzeMessageSentimentInputSchema},
  output: {schema: AnalyzeMessageSentimentOutputSchema},
  prompt: `You are a helpful AI that analyzes the sentiment of messages and suggests tone corrections or displays emotion-based emojis.

Analyze the sentiment of the following message and provide a sentiment analysis (positive, negative, or neutral), a suggested tone correction (if needed, otherwise an empty string), and an emotion emoji that best represents the message's tone.

Message: {{{message}}}

Output your response as a JSON object.

{
  "sentiment": "<sentiment>",
  "suggestedToneCorrection": "<suggested tone correction>",
  "emotionEmoji": "<emotion emoji>"
}`,
});

const analyzeMessageSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeMessageSentimentFlow',
    inputSchema: AnalyzeMessageSentimentInputSchema,
    outputSchema: AnalyzeMessageSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
