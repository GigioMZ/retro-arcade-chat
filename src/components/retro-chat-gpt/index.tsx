"use client";

import { useState } from "react";
import { ChatHeader } from "@/components/retro-chat-gpt/chat-header";
import { MessageList } from "@/components/retro-chat-gpt/message-list";
import { ChatInput } from "@/components/retro-chat-gpt/chat-input";
import { type Message } from "@/components/retro-chat-gpt/types";

export function RetroChatGPT() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(25000);
  const [credits, setCredits] = useState(99);
  const [isImageMode, setIsImageMode] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = { role: "user", content: input };
      setMessages([...messages, newMessage]);
      setInput("");
      setScore((prev) => prev + 1000);

      setTimeout(() => {
        const aiResponse: Message = {
          role: "system",
          content:
            "This is a simulated AI response. In a real application, this would be generated by an AI model.",
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleImageGenerate = () => {
    const generatedImageUrl = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(
      input
    )}`;
    const newMessage: Message = {
      role: "system",
      content: `Here's a generated image based on: ${input}`,
      image: generatedImageUrl,
    };
    setMessages([...messages, newMessage]);
    setScore((prev) => prev + 500);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isImageMode) {
        handleImageGenerate();
      } else {
        handleSend();
      }
    }
    setCredits((prev) => prev - 1);
  };

  return (
    <main className="flex flex-col gap-2 bg-black px-2 h-screen text-white">
      <ChatHeader score={score} credits={credits} />

      <div className="flex flex-1 justify-center px-1 sm:px-2">
        <div className="flex flex-col w-full max-w-4xl">
          <MessageList messages={messages} />
          <ChatInput
            input={input}
            credits={credits}
            isImageMode={isImageMode}
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
