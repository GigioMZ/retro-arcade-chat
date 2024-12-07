"use client";

import { ImageIcon, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

interface ChatInputProps {
  input: string;
  credits: number;
  isImageMode: boolean;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  onToggleMode: () => void;
}

export function ChatInput({
  input,
  credits,
  isImageMode,
  isLoading,
  onInputChange,
  onKeyDown,
  onSend,
  onToggleMode,
}: ChatInputProps) {
  const { pending } = useFormStatus();
  console.log("ttt", { pending });

  return (
    <div className="relative bg-gradient-to-r from-purple-900 to-indigo-900 p-2 sm:p-4 overflow-hidden">
      <div className="absolute inset-0 star-field"></div>
      <div className="relative z-10 space-y-2">
        <ModeToggle isImageMode={isImageMode} onToggleMode={onToggleMode} />
        <InputSection
          input={input}
          isImageMode={isImageMode}
          onInputChange={onInputChange}
          onKeyDown={onKeyDown}
          onSend={onSend}
          isLoading={isLoading}
        />
        <CreditsDisplay credits={credits} />
      </div>
    </div>
  );
}

function ModeToggle({
  isImageMode,
  onToggleMode,
}: {
  isImageMode: boolean;
  onToggleMode: () => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleMode}
        className={cn(
          "h-8 w-8 sm:h-9 sm:w-9",
          isImageMode ? "bg-purple-500 text-yellow-300" : "bg-yellow-300 text-black",
          "hover:bg-yellow-400"
        )}
      >
        {isImageMode ? (
          <ImageIcon className="w-4 sm:w-[1.2rem] h-4 sm:h-[1.2rem]" />
        ) : (
          <MessageSquare className="w-4 sm:w-[1.2rem] h-4 sm:h-[1.2rem]" />
        )}
      </Button>
      <p className="text-[10px] sm:text-xs">{isImageMode ? "Generate image" : "Chat with AI"}</p>
    </div>
  );
}

function InputSection({
  input,
  isImageMode,
  isLoading,
  onInputChange,
  onKeyDown,
  onSend,
}: {
  input: string;
  isImageMode: boolean;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
}) {
  const textareaClasses = cn(
    "flex-1 border-2 border-purple-500 bg-black",
    "h-[80px] sm:h-[100px]",
    "text-xs text-yellow-300 sm:text-sm",
    "placeholder-purple-400 retro-caret"
  );

  return (
    <form className="flex flex-col flex-grow items-end gap-2">
      <Textarea
        value={input}
        rows={3}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={isImageMode ? "DESCRIBE THE IMAGE..." : "ENTER YOUR MESSAGE..."}
        className={textareaClasses}
      />
      <SendButton
        isLoading={isLoading}
        isImageMode={isImageMode}
        onClick={onSend}
        disabled={!input.trim()}
      />
    </form>
  );
}

function SendButton({
  isLoading,
  isImageMode,
  onClick,
  disabled,
}: {
  isLoading: boolean;
  isImageMode: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="border-4 bg-yellow-300 hover:bg-yellow-400 p-4 hover:border-t-yellow-500 active:border-t-yellow-700 hover:border-r-yellow-700 active:border-r-yellow-500 border-black hover:border-b-yellow-700 active:border-b-yellow-500 hover:border-l-yellow-500 active:border-l-yellow-700 min-w-[100px] text-black arcade-text"
    >
      {isLoading ? "Generating..." : isImageMode ? "Generate" : "Send"}
    </Button>
  );
}

function CreditsDisplay({ credits }: { credits: number }) {
  return (
    <div className="mt-1 sm:mt-2 text-[10px] text-center text-purple-400 sm:text-xs">
      PRESS ENTER TO SEND • CREDITS: {credits}
    </div>
  );
}
