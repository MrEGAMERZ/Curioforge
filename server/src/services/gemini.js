import { env } from '../config/env.js';
import { cleanAndParseJson } from '../utils/parseJson.js';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Generates structured JSON from Gemini using multimodal prompt (text, image, audio)
 */
export async function generateGeminiJson({
  systemPrompt,
  userContent,
  schema = null,
  imageBase64 = null,
  imageMimeType = 'image/jpeg',
  audioBase64 = null,
  audioMimeType = 'audio/webm',
  retryCount = 1,
}) {
  if (!env.isGeminiConfigured) {
    throw {
      status: 502,
      code: 'AI_UNAVAILABLE',
      message: 'Gemini API key is not configured in server/.env. Please add GEMINI_API_KEY to test live AI responses.',
    };
  }

  const model = env.GEMINI_MODEL;
  const endpoint = `${GEMINI_BASE_URL}/models/${model}:generateContent`;

  const contents = [];
  const parts = [];

  // Add image if provided
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: imageMimeType,
        data: imageBase64,
      },
    });
  }

  // Add audio if provided
  if (audioBase64) {
    parts.push({
      inlineData: {
        mimeType: audioMimeType,
        data: audioBase64,
      },
    });
  }

  // Add text content
  if (userContent) {
    parts.push({
      text: userContent,
    });
  }

  contents.push({
    role: 'user',
    parts,
  });

  const requestBody = {
    contents,
    generationConfig: {
      temperature: 0.6,
      topP: 0.95,
      responseMimeType: 'application/json',
    },
  };

  if (systemPrompt) {
    requestBody.systemInstruction = {
      parts: [{ text: systemPrompt }],
    };
  }

  let attempt = 0;
  while (attempt <= retryCount) {
    attempt++;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': env.GEMINI_API_KEY,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Gemini API Error] status ${response.status}:`, errorText);
        if (response.status === 429) {
          throw { status: 429, code: 'RATE_LIMITED', message: 'Gemini quota limit reached. Please wait a moment.' };
        }
        throw { status: 502, code: 'AI_UNAVAILABLE', message: `Gemini service error (${response.status})` };
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw { status: 502, code: 'AI_BAD_RESPONSE', message: 'Gemini returned an empty response' };
      }

      // Parse JSON
      const parsedJson = cleanAndParseJson(rawText);

      // Validate with schema if provided
      if (schema) {
        return schema.parse(parsedJson);
      }
      return parsedJson;
    } catch (err) {
      clearTimeout(timeout);

      if (err.name === 'AbortError') {
        if (attempt <= retryCount) {
          console.warn('[Gemini] Request timed out. Retrying once...');
          continue;
        }
        throw { status: 504, code: 'AI_TIMEOUT', message: 'AI request timed out after 30 seconds. Please try again.' };
      }

      if (attempt <= retryCount && (err.code === 'AI_BAD_RESPONSE' || err.name === 'ZodError')) {
        console.warn(`[Gemini] Attempt ${attempt} failed validation. Retrying once...`);
        continue;
      }

      throw err;
    }
  }
}
