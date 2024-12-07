import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { type Message } from "@/components/retro-chat-gpt/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isSubmitting?: boolean;
}

export function MessageList({ messages, isSubmitting = false }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isStreamingAssistantMessage =
    messages.length > 0 && messages[messages.length - 1].role === "assistant";
  const shouldShowLoadingIndicator = isSubmitting && !isStreamingAssistantMessage;
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>(() => {
    const initialStates: Record<string, boolean> = {};
    messages.forEach((message) => {
      if (message?.image?.url) {
        initialStates[message?.image.url] = true;
      }
    });
    return initialStates;
  });
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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

  const handleImageLoad = (imageUrl: string) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [imageUrl]: false,
    }));
  };

  const handleImageError = (imageUrl: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [imageUrl]: true,
    }));
    setImageLoadingStates((prev) => ({
      ...prev,
      [imageUrl]: false,
    }));
  };

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
                  {!!message.content && (
                    <p className="mb-4 text-xs text-yellow-300 sm:text-sm">{message.content}</p>
                  )}
                  {!!message?.image?.url && !imageErrors[message?.image?.url] && (
                    <div className="relative mx-auto mt-4 w-full max-w-md aspect-square">
                      <p className="mb-2 text-xs text-yellow-300 sm:text-sm">
                        {message.image.propmpt}
                      </p>
                      {imageLoadingStates[message?.image?.url] && (
                        <div className="z-10 absolute inset-0">
                          <Skeleton
                            className={cn("w-full h-full", "animate-pulse bg-yellow-300/30")}
                          />
                        </div>
                      )}
                      <div className="relative w-full aspect-square">
                        <Image
                          src={message?.image?.url}
                          alt="Generated image"
                          fill
                          className="object-contain"
                          onError={() => handleImageError(message?.image?.url || "")}
                          onLoad={() => handleImageLoad(message?.image?.url || "")}
                          sizes="(max-width: 768px) 100vw, 768px"
                          priority
                        />
                      </div>
                    </div>
                  )}
                  {message?.image?.url && imageErrors[message?.image.url] && (
                    <div className="p-4 text-center text-red-500">
                      Failed to load image. The image URL has expired or is unavailable.
                    </div>
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
