import { z } from "zod";

export const ZServerSettings = z.object({
  groqApiKey: z.string(),
});

export const SERVER_SETTINGS = ZServerSettings.parse({
  groqApiKey: process.env["GROQ_API_KEY"],
});
