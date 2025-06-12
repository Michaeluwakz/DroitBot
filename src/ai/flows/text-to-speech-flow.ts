
'use server';
/**
 * @fileOverview A Genkit flow to convert text to speech using ElevenLabs API.
 *
 * - generateSpeech - A function that takes text and returns audio data.
 * - GenerateSpeechInput - The input type for the generateSpeech function.
 * - GenerateSpeechOutput - The return type for the generateSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z}
from 'genkit';

const GenerateSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  voiceId: z.string().optional().default('21m00Tcm4TlvDq8ikWAM').describe('The ElevenLabs voice ID to use. Defaults to "Rachel".'),
  modelId: z.string().optional().default('eleven_multilingual_v2').describe('The ElevenLabs model ID to use.'),
  stability: z.number().optional().default(0.5).describe('Voice stability setting (0-1).'),
  similarityBoost: z.number().optional().default(0.75).describe('Voice similarity boost setting (0-1).'),
});
export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;

const GenerateSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI (e.g., data:audio/mpeg;base64,...).'),
});
export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;

export async function generateSpeech(input: GenerateSpeechInput): Promise<GenerateSpeechOutput> {
  return generateSpeechFlow(input);
}

const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: GenerateSpeechInputSchema,
    outputSchema: GenerateSpeechOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API key is not configured.');
    }

    const voiceId = input.voiceId || '21m00Tcm4TlvDq8ikWAM';
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const headers = {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    };

    const body = JSON.stringify({
      text: input.text,
      model_id: input.modelId,
      voice_settings: {
        stability: input.stability,
        similarity_boost: input.similarityBoost,
        speaker_boost: true, // Added for enhanced clarity
      },
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`ElevenLabs API request failed with status ${response.status}: ${errorBody}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString('base64');
      const audioDataUri = `data:audio/mpeg;base64,${audioBase64}`;

      return { audioDataUri };
    } catch (error: any) {
      console.error('Error calling ElevenLabs API:', error);
      throw new Error(error.message || 'Failed to generate speech via ElevenLabs.');
    }
  }
);
