"use client";

import OpenAI from "openai";
import { useState, useRef, useEffect } from "react";

import { ChatHeader } from "@/components/retro-chat-gpt/chat-header";
import { ChatInput } from "@/components/retro-chat-gpt/chat-input";
import { MessageList } from "@/components/retro-chat-gpt/message-list";
import { type Message } from "@/components/retro-chat-gpt/types";

if (!process.env.NEXT_PUBLIC_HEURIST_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_HEURIST_API_KEY environment variable");
}

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_HEURIST_API_KEY,
  baseURL: "https://llm-gateway.heurist.xyz/v1",
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

export function RetroChatGPT() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(25000);
  const [credits, setCredits] = useState(99);
  const [isImageMode, setIsImageMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isStreamingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (isStreamingRef.current) {
        setIsLoading(false);
        isStreamingRef.current = false;
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
      }
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) {return;}

    try {
      setIsLoading(true);
      isStreamingRef.current = true;
      abortControllerRef.current = new AbortController();

      const newMessage: Message = { role: "user", content: input };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      setScore((prev) => prev + 1000);

      const stream = await openai.chat.completions.create(
        {
          model: "theia-llama-3.1-8b",
          messages: [...messages, newMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          stream: true,
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          signal: abortControllerRef.current.signal,
        }
      );

      let currentContent = "";

      for await (const chunk of stream) {
        if (!isStreamingRef.current) {break;}

        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          currentContent += content;
          await new Promise((resolve) => setTimeout(resolve, 50));

          setMessages((prev) => {
            const newMessages = [...prev];
            if (prev[prev.length - 1]?.role === "assistant") {
              newMessages[newMessages.length - 1] = {
                role: "assistant",
                content: currentContent,
              };
            } else {
              newMessages.push({
                role: "assistant",
                content: currentContent,
              });
            }
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? {
                role: "assistant",
                content: "Failed to generate response. Please try again.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      isStreamingRef.current = false;
      abortControllerRef.current = null;
    }
  };

  const handleImageGenerate = () => {
    const generatedImageUrl = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(
      input
    )}`;
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
    setCredits((prev) => prev - 1);
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
            onSend={isImageMode ? handleImageGenerate : handleSend}
            onToggleMode={() => setIsImageMode(!isImageMode)}
          />
        </div>
      </div>
    </main>
  );
}
