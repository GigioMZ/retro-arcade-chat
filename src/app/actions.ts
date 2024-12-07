"use server";

import { z } from "zod";

import { openai } from "@/lib/heurist";

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
