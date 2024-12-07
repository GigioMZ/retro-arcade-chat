import Heurist from "heurist";
import OpenAI from "openai";

if (!process.env.HEURIST_API_KEY) {
  throw new Error("Missing HEURIST_API_KEY environment variable");
}

export const heurist = new Heurist({
  apiKey: process.env.HEURIST_API_KEY,
});

export const openai = new OpenAI({
  apiKey: process.env.HEURIST_API_KEY,
  baseURL: "https://llm-gateway.heurist.xyz/v1",
});
