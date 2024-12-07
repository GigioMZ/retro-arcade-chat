import { ImageIcon, MessageSquare } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  form: UseFormReturn<{ userPrompt: string }>;
  credits: number;
  isImageMode: boolean;
  onSubmit: (e: React.BaseSyntheticEvent) => Promise<void>;
  onToggleMode: () => void;
}

export function ChatInput({ form, credits, isImageMode, onSubmit, onToggleMode }: ChatInputProps) {
  const isLoading = form.formState.isSubmitting;
  const isValid = form.formState.isValid;

  return (
    <div className="relative bg-gradient-to-r from-purple-900 to-indigo-900 p-2 sm:p-4 overflow-hidden">
      <div className="absolute inset-0 star-field"></div>
      <div className="relative z-10 space-y-2">
        <form onSubmit={onSubmit} className="flex flex-col flex-grow items-end gap-2">
          <Textarea
            {...form.register("userPrompt")}
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
            placeholder={isImageMode ? "DESCRIBE THE IMAGE..." : "ENTER YOUR MESSAGE..."}
            className={cn(
              "flex-1 border-2 border-purple-500 bg-black",
              "h-[80px] sm:h-[100px]",
              "text-xs text-yellow-300 sm:text-sm",
              "placeholder-purple-400 retro-caret"
            )}
          />
          <div className="flex justify-between items-center w-full">
            <ModeToggle isImageMode={isImageMode} onToggleMode={onToggleMode} />
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="border-4 bg-yellow-300 hover:bg-yellow-400 disabled:opacity-50 p-4 hover:border-t-yellow-500 active:border-t-yellow-700 hover:border-r-yellow-700 active:border-r-yellow-500 border-black hover:border-b-yellow-700 active:border-b-yellow-500 hover:border-l-yellow-500 active:border-l-yellow-700 min-w-[100px] text-black arcade-text"
            >
              {isLoading ? "Generating..." : isImageMode ? "Generate" : "Send"}
            </Button>
          </div>
        </form>
        <div className="mt-1 sm:mt-2 text-[10px] text-center text-purple-400 sm:text-xs">
          PRESS ENTER TO SEND • CREDITS: {credits}
        </div>
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
