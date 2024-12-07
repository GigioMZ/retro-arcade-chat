import Image from "next/image";
import { useEffect, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { type Message } from "./types";

interface MessageListProps {
  messages: Message[];
  isSubmitting?: boolean;
}

export function MessageList({ messages, isSubmitting = false }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isStreamingAssistantMessage =
    messages.length > 0 && messages[messages.length - 1].role === "assistant";
  const shouldShowLoadingIndicator = isSubmitting && !isStreamingAssistantMessage;

  useEffect(() => {
    const scrollToBottom = () => {
      if (containerRef.current) {
        const viewport = containerRef.current.querySelector("[data-radix-scroll-area-viewport]");
        if (viewport instanceof HTMLElement) {
          const scrollHeight = viewport.scrollHeight;
          viewport.style.scrollBehavior = "smooth";
          viewport.scrollTop = scrollHeight;
        }
      }
    };

    // Scroll immediately and after a short delay to ensure content is rendered
    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  return (
    <div className="flex-1 min-h-0" ref={containerRef}>
      <div className="relative bg-black py-1 sm:py-2 h-full">
        <div className="absolute inset-0 star-field"></div>
        {!messages?.length && <div className="top-0 left-0 absolute text-purple-500 blink">►</div>}
        <ScrollArea className="relative z-10 h-full">
          <div className="px-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 sm:mb-6 flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`inline-block p-2 sm:p-4 pixel-border max-w-[85%] sm:max-w-[80%] ${
                    message.role === "user"
                      ? "bg-purple-900 bg-opacity-90"
                      : "bg-indigo-900 bg-opacity-90"
                  }`}
                >
                  <p className="text-xs text-yellow-300 sm:text-sm">{message.content}</p>
                  {message.image && (
                    <Image
                      src={message.image}
                      alt="Generated AI Image"
                      width={200}
                      height={200}
                      className="mt-2 pixel-border rounded w-full sm:w-auto max-w-[200px]"
                    />
                  )}
                </div>
              </div>
            ))}

            {shouldShowLoadingIndicator && (
              <div className="flex justify-start mb-4 sm:mb-6">
                <div className="inline-block bg-indigo-900 bg-opacity-90 p-2 sm:p-4 pixel-border max-w-[85%] sm:max-w-[80%]">
                  <div className="flex gap-2">
                    <Skeleton className="bg-yellow-300/30 rounded-full w-2 h-2" />
                    <Skeleton className="bg-yellow-300/30 rounded-full w-2 h-2" />
                    <Skeleton className="bg-yellow-300/30 rounded-full w-2 h-2" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
