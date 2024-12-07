"use client";

import { useState, useRef } from "react";
import { ChatHeader } from "@/components/retro-chat-gpt/chat-header";
import { ChatInput } from "@/components/retro-chat-gpt/chat-input";
import { MessageList } from "@/components/retro-chat-gpt/message-list";
import { type Message } from "@/components/retro-chat-gpt/types";
import { streamChatCompletion } from "@/app/actions";
import { handleStreamMessage, updateMessagesWithResponse, generateImageUrl } from "./utils";

export function RetroChatGPT() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(25000);
  const [credits, setCredits] = useState(99);
  const [isImageMode, setIsImageMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isStreamingRef = useRef(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      isStreamingRef.current = true;

      const newMessage: Message = {
        role: "user",
        content: input,
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      setScore((prev) => prev + 1000);

      const result = await streamChatCompletion({
        messages: [...messages, newMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

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
      setIsLoading(false);
      isStreamingRef.current = false;
    }
  };

  const handleImageGenerate = () => {
    const generatedImageUrl = generateImageUrl(input);
    const newMessage: Message = {
      role: "assistant",
      content: `Here's a generated image based on: ${input}`,
      image: generatedImageUrl,
    };
    setMessages((prev) => [...prev, newMessage]);
    setScore((prev) => prev + 500);
    setInput("");
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isImageMode) {
        handleImageGenerate();
      } else {
        await handleSend();
      }
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) {
      return;
    }

    try {
      if (isImageMode) {
        await handleImageGenerate();
      } else {
        await handleSend();
      }
      setCredits((prev) => prev - 1);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <main className="flex flex-col bg-black px-2 h-screen text-white">
      <ChatHeader score={score} credits={credits} />

      <div className="flex flex-1 justify-center px-1 sm:px-2 min-h-0">
        <div className="flex flex-col w-full max-w-4xl h-full">
          <MessageList messages={messages} isLoading={isLoading} />
          <ChatInput
            input={input}
            credits={credits}
            isImageMode={isImageMode}
            isLoading={isLoading}
            onInputChange={setInput}
            onKeyDown={handleKeyDown}
            onSend={handleSubmit}
            onToggleMode={() => setIsImageMode(!isImageMode)}
          />
        </div>
      </div>
    </main>
  );
}
