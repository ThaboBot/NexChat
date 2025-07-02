// src/ai/flows/chatgpt-plugin-integration.ts
'use server';

/**
 * @fileOverview Integrates ChatGPT with external AI plugins to extend its capabilities.
 *
 * - integrateChatGPTPlugins - A function that handles the integration of ChatGPT with AI plugins.
 * - ChatGPTPluginIntegrationInput - The input type for the integrateChatGPTPlugins function.
 * - ChatGPTPluginIntegrationOutput - The return type for the integrateChatGPTPlugins function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatGPTPluginIntegrationInputSchema = z.object({
  query: z.string().describe('The user query intended for ChatGPT, potentially utilizing plugins.'),
  pluginInstructions: z
    .string()
    .describe('Instructions for ChatGPT on how to utilize the available plugins.'),
});
export type ChatGPTPluginIntegrationInput = z.infer<
  typeof ChatGPTPluginIntegrationInputSchema
>;

const ChatGPTPluginIntegrationOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'The response from ChatGPT, potentially utilizing the integrated plugins to answer the user query.'
    ),
});
export type ChatGPTPluginIntegrationOutput = z.infer<
  typeof ChatGPTPluginIntegrationOutputSchema
>;

export async function integrateChatGPTPlugins(
  input: ChatGPTPluginIntegrationInput
): Promise<ChatGPTPluginIntegrationOutput> {
  return chatGPTPluginIntegrationFlow(input);
}

const chatGPTPluginIntegrationPrompt = ai.definePrompt({
  name: 'chatGPTPluginIntegrationPrompt',
  input: {schema: ChatGPTPluginIntegrationInputSchema},
  output: {schema: ChatGPTPluginIntegrationOutputSchema},
  prompt: `You are ChatGPT with access to external plugins.

Instructions for using plugins: {{{pluginInstructions}}}

User Query: {{{query}}}

Response: `,
});

const chatGPTPluginIntegrationFlow = ai.defineFlow(
  {
    name: 'chatGPTPluginIntegrationFlow',
    inputSchema: ChatGPTPluginIntegrationInputSchema,
    outputSchema: ChatGPTPluginIntegrationOutputSchema,
  },
  async input => {
    const {output} = await chatGPTPluginIntegrationPrompt(input);
    return output!;
  }
);
