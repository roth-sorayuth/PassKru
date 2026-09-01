import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let client;
let attempted = false;

/**
 * Lazily builds the Gemini client so importing this module never fails when
 * GEMINI_API_KEY is unset (local dev, CI) — callers check isGeminiConfigured()
 * and fall back to non-AI behavior instead.
 */
export function getGeminiClient() {
  if (!attempted) {
    attempted = true;
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      client = new GoogleGenAI({ apiKey });
    }
  }
  return client || null;
}

export function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}
