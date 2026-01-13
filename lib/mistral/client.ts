import { Mistral } from "@mistralai/mistralai";

// Client Mistral (côté serveur uniquement)
export function getMistralClient(): Mistral {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is not defined in environment variables");
  }

  return new Mistral({
    apiKey,
  });
}

// Modèle par défaut
export const DEFAULT_MODEL =
  process.env.MISTRAL_MODEL || "mistral-small-latest";
