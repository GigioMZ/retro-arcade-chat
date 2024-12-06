import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { type Message } from "./types";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="relative flex-1 bg-black py-1 sm:py-2 overflow-hidden">
      <div className="absolute inset-0 star-field"></div>
      <div className="top-0 left-0 absolute text-purple-500 blink">►</div>
      <ScrollArea className="relative z-10 h-full">
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
      </ScrollArea>
    </div>
  );
}
