"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChatHeader } from "@/components/retro-chat-gpt/chat-header";
import { ChatInput } from "@/components/retro-chat-gpt/chat-input";
import { MessageList } from "@/components/retro-chat-gpt/message-list";
import { type Message } from "@/components/retro-chat-gpt/types";
import { streamChatCompletion, generateImage } from "@/app/actions";
import { handleStreamMessage, updateMessagesWithResponse } from "@/components/retro-chat-gpt/utils";

const promptSchema = z.object({
  userPrompt: z.string().min(1, "Please enter a message"),
});

type PromptForm = z.infer<typeof promptSchema>;

export function RetroChatGPT() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [score, setScore] = useState(0);
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

  const handleChat = async (userPrompt: string) => {
    if (!userPrompt.trim() || isSubmitting) return;

    try {
      isStreamingRef.current = true;

      const newMessage: Message = {
        role: "user",
        content: userPrompt,
      };
      setMessages((prev) => [...prev, newMessage]);

      const result = await streamChatCompletion({
        messages: [...messages, newMessage]
          .filter(
            (msg): msg is { role: "user" | "assistant"; content: string } =>
              msg.content !== undefined
          )
          .map(({ role, content }) => ({
            role,
            content,
          })),
      });

      if (!result.success) throw new Error(result.error);
      if (!result.data) throw new Error("No stream returned");

      await handleStreamMessage({
        stream: result.data,
        isStreamingRef,
        onProgress: (content) => setMessages((prev) => updateMessagesWithResponse(prev, content)),
      });
      setScore((prev) => prev + 1000);
    } catch (error) {
      console.error("Error in handleChat:", error);
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

  const handleImageGenerate = async (userPrompt: string) => {
    const userMessage: Message = {
      role: "user",
      content: userPrompt,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const imageResponse = await generateImage(userPrompt);

      if (!imageResponse?.url) {
        throw new Error("Failed to generate image");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          image: {
            url: imageResponse.url,
            propmpt: `Here's a generated image based on: ${userPrompt}`,
          },
        },
      ]);
      setScore((prev) => prev + 1000);
    } catch (error) {
      console.error("Error generating image:", error);
      setMessages((prev) =>
        prev.slice(0, -1).concat({
          role: "assistant",
          content: "Sorry, I couldn't generate that image. Please try again.",
        })
      );
    }
  };

  const onSubmit = async (data: PromptForm) => {
    const userPrompt = data.userPrompt;
    form.setValue("userPrompt", "");

    try {
      if (isImageMode) {
        await handleImageGenerate(userPrompt);
      } else {
        await handleChat(userPrompt);
      }
      setCredits((prev) => prev - 1);
      form.reset();
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

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
