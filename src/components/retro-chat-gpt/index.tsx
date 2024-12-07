"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChatHeader } from "@/components/retro-chat-gpt/chat-header";
import { ChatInput } from "@/components/retro-chat-gpt/chat-input";
import { MessageList } from "@/components/retro-chat-gpt/message-list";
import { type Message } from "@/components/retro-chat-gpt/types";
import { streamChatCompletion } from "@/app/actions";
import {
  handleStreamMessage,
  updateMessagesWithResponse,
  generateImageUrl,
} from "@/components/retro-chat-gpt/utils";

const promptSchema = z.object({
  userPrompt: z.string().min(1, "Please enter a message"),
});

type PromptForm = z.infer<typeof promptSchema>;

export function RetroChatGPT() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [score, setScore] = useState(25000);
  const [credits, setCredits] = useState(99);
  const [isImageMode, setIsImageMode] = useState(false);
  const isStreamingRef = useRef(false);

  const form = useForm<PromptForm>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      userPrompt: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleSend = async (userPrompt: string) => {
    if (!userPrompt.trim() || isSubmitting) return;

    try {
      isStreamingRef.current = true;

      const newMessage: Message = {
        role: "user",
        content: userPrompt,
      };
      setMessages((prev) => [...prev, newMessage]);
      setScore((prev) => prev + 1000);

      const result = await streamChatCompletion({
        messages: [...messages, newMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      console.log("result", result);

      if (!result.success) throw new Error(result.error);
      if (!result.data) throw new Error("No stream returned");

      await handleStreamMessage({
        stream: result.data,
        isStreamingRef,
        onProgress: (content) => setMessages((prev) => updateMessagesWithResponse(prev, content)),
      });
    } catch (error) {
      console.error("Error in handleSend:", error);
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? { role: "assistant", content: "Failed to generate response. Please try again." }
            : msg
        )
      );
    } finally {
      isStreamingRef.current = false;
    }
  };

  const handleImageGenerate = (userPrompt: string) => {
    const generatedImageUrl = generateImageUrl(userPrompt);
    const newMessage: Message = {
      role: "assistant",
      content: `Here's a generated image based on: ${userPrompt}`,
      image: generatedImageUrl,
    };
    setMessages((prev) => [...prev, newMessage]);
    setScore((prev) => prev + 500);
  };

  const onSubmit = async (data: PromptForm) => {
    const userPrompt = data.userPrompt;
    form.setValue("userPrompt", "");

    try {
      if (isImageMode) {
        await handleImageGenerate(userPrompt);
      } else {
        await handleSend(userPrompt);
      }
      setCredits((prev) => prev - 1);
      form.reset();
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  console.log("ttt", isSubmitting);

  return (
    <main className="flex flex-col bg-black px-2 h-screen text-white">
      <ChatHeader score={score} credits={credits} />

      <div className="flex flex-1 justify-center px-1 sm:px-2 min-h-0">
        <div className="flex flex-col w-full max-w-4xl h-full">
          <MessageList messages={messages} isSubmitting={isSubmitting} />
          <ChatInput
            form={form}
            credits={credits}
            isImageMode={isImageMode}
            onSubmit={form.handleSubmit(onSubmit)}
            onToggleMode={() => setIsImageMode(!isImageMode)}
          />
        </div>
      </div>
    </main>
  );
}
