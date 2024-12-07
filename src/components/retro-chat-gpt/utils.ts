import type { ChatCompletionChunk } from "openai/resources/index.mjs";
import type { Stream } from "openai/streaming.mjs";

import { type Message } from "./types";

interface StreamMessageParams {
  stream: Stream<ChatCompletionChunk>;
  isStreamingRef: React.RefObject<boolean>;
  onProgress: (content: string) => void;
}

export async function handleStreamMessage({
  stream,
  isStreamingRef,
  onProgress,
}: StreamMessageParams) {
  let currentContent = "";

  for await (const value of stream) {
    if (!isStreamingRef.current) {
      break;
    }
    const content = value?.choices[0]?.delta?.content || "";
    if (content) {
      currentContent += content;
      await new Promise((resolve) => setTimeout(resolve, 50));
      onProgress(currentContent);
    }
  }
}

export function updateMessagesWithResponse(messages: Message[], content: string): Message[] {
  const newMessages = [...messages];
  if (messages[messages.length - 1]?.role === "assistant") {
    newMessages[newMessages.length - 1] = { role: "assistant", content };
  } else {
    newMessages.push({ role: "assistant", content });
  }
  return newMessages;
}

export function generateImageUrl(prompt: string) {
  return `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(prompt)}`;
}
