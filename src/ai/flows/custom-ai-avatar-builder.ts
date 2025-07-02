// src/ai/flows/custom-ai-avatar-builder.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for building a custom AI avatar.
 *
 * - buildCustomAIAvatar - A function that orchestrates the AI avatar creation process.
 * - CustomAIAvatarInput - The input type for the buildCustomAIAvatar function.
 * - CustomAIAvatarOutput - The return type for the buildCustomAIAvatar function, includes avatar description and image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const CustomAIAvatarInputSchema = z.object({
  avatarDescription: z
    .string()
    .describe('A detailed description of the desired AI avatar, including appearance, personality, and background.'),
});
export type CustomAIAvatarInput = z.infer<typeof CustomAIAvatarInputSchema>;

const CustomAIAvatarOutputSchema = z.object({
  avatarImage: z
    .string()
    .describe(
      'A data URI containing the generated image of the AI avatar, including MIME type and Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Removed the \' to avoid escaping issues
    ),
  avatarVoice: z.string().describe('A data URI containing audio data of the avatar voice.'),
  avatarBio: z.string().describe('A short bio of the avatar.'),
});
export type CustomAIAvatarOutput = z.infer<typeof CustomAIAvatarOutputSchema>;

const avatarImagePrompt = ai.definePrompt({
  name: 'avatarImagePrompt',
  input: {schema: CustomAIAvatarInputSchema},
  output: z.object({media: z.string().describe('The generated image as a data URI.')}),
  prompt: `Generate an image of an AI avatar based on the following description: {{{avatarDescription}}}.  The image should be a realistic portrait.  Return the image as a data URI in the media field.
`,
});

const avatarBioPrompt = ai.definePrompt({
  name: 'avatarBioPrompt',
  input: {schema: CustomAIAvatarInputSchema},
  output: z.object({bio: z.string().describe('The bio of the avatar.')}),
  prompt: `Write a short bio for the avatar described as follows: {{{avatarDescription}}}. The bio should be no more than 3 sentences long.
`,
});

const avatarVoicePrompt = ai.definePrompt({
  name: 'avatarVoicePrompt',
  input: {schema: CustomAIAvatarInputSchema},
  output: z.object({voice: z.string().describe('The voice of the avatar as a data URI.')}),
  prompt: `Generate a voice for an AI avatar based on the following description: {{{avatarDescription}}}.  The voice should match the avatar's personality and appearance. Return the voice as a data URI in the voice field.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

export async function buildCustomAIAvatar(
  input: CustomAIAvatarInput
): Promise<CustomAIAvatarOutput> {
  return customAIAvatarFlow(input);
}

const customAIAvatarFlow = ai.defineFlow(
  {
    name: 'customAIAvatarFlow',
    inputSchema: CustomAIAvatarInputSchema,
    outputSchema: CustomAIAvatarOutputSchema,
  },
  async input => {
    // Generate the avatar image
    const imageResult = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {text: `Generate an image of an AI avatar based on the following description: ${input.avatarDescription}. The image should be a realistic portrait.`},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!imageResult.media) {
      throw new Error('Could not generate avatar image.');
    }
    const {output: bioResult} = await avatarBioPrompt(input);

    const {media: voice} = await ai.generate({
      model: ai.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: `Create a voice sample based on this description: ${input.avatarDescription}`,
    });

    if (!voice) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      voice.url.substring(voice.url.indexOf(',') + 1),
      'base64'
    );

    const avatarVoice = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {
      avatarImage: imageResult.media.url,
      avatarVoice: avatarVoice,
      avatarBio: bioResult!.bio,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
