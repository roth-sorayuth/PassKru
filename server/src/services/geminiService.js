import { GEMINI_MODEL, getGeminiClient, isGeminiConfigured } from "../config/gemini.js";

const DEFAULT_TIMEOUT_MS = 20000;

export { isGeminiConfigured };

/**
 * Calls Gemini with a JSON response schema and returns the parsed object.
 *
 * Generic on purpose: any feature that needs LLM-generated structured data
 * (study plans today, weakness analysis or similar later) can reuse this
 * instead of talking to the SDK directly, so retry/timeout/parsing behavior
 * stays in one place.
 */
export async function generateStructuredContent({ systemInstruction, prompt, schema, temperature = 0.4 }) {
  const client = getGeminiClient();
  if (!client) {
    const error = new Error("Gemini API key is not configured");
    error.code = "GEMINI_NOT_CONFIGURED";
    throw error;
  }

  const response = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      temperature,
      responseMimeType: "application/json",
      responseSchema: schema,
      abortSignal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    },
  });

  const text = response.text;
  if (!text) {
    const error = new Error("Gemini returned an empty response");
    error.code = "GEMINI_EMPTY_RESPONSE";
    throw error;
  }

  try {
    return JSON.parse(text);
  } catch (parseError) {
    const error = new Error("Gemini returned malformed JSON");
    error.code = "GEMINI_INVALID_JSON";
    error.cause = parseError;
    throw error;
  }
}
