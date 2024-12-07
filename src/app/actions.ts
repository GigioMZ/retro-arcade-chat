"use server";

import { z } from "zod";

import { heurist, openai } from "@/lib/heurist";

const chatCompletionSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ),
});

export async function streamChatCompletion(input: z.infer<typeof chatCompletionSchema>) {
  const parsed = chatCompletionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid input",
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "theia-llama-3.1-8b",
      messages: parsed.data.messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return {
      success: true,
      data: response,
    };
  } catch {
    return {
      success: false,
      error: "Failed to generate response. Please try again.",
    };
  }
}

export async function generateImage(prompt: string) {
  const response = await heurist.images.generate({
    model: "FLUX.1-dev",
    prompt,
  });

  return response;
}
