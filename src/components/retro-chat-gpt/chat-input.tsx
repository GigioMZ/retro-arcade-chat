import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, MessageSquare, Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  credits: number;
  isImageMode: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  onToggleMode: () => void;
}

export function ChatInput({
  input,
  credits,
  isImageMode,
  onInputChange,
  onKeyDown,
  onSend,
  onToggleMode,
}: ChatInputProps) {
  return (
    <div className="relative bg-gradient-to-r from-purple-900 to-indigo-900 p-2 sm:p-4 overflow-hidden">
      <div className="absolute inset-0 star-field"></div>
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleMode}
            className={`h-8 w-8 sm:h-9 sm:w-9 ${
              isImageMode ? "bg-purple-500 text-yellow-300" : "bg-yellow-300 text-black"
            } hover:bg-yellow-400`}
          >
            {isImageMode ? (
              <MessageSquare className="w-4 sm:w-[1.2rem] h-4 sm:h-[1.2rem]" />
            ) : (
              <ImageIcon className="w-4 sm:w-[1.2rem] h-4 sm:h-[1.2rem]" />
            )}
          </Button>
          <p className="text-[10px] sm:text-xs">Toggle between chat and image generation</p>
        </div>
        <div className="flex space-x-2">
          {isImageMode ? (
            <Textarea
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="DESCRIBE THE IMAGE..."
              className="flex-1 border-2 border-purple-500 bg-black px-2 sm:px-3 py-1.5 sm:py-2 h-[80px] sm:h-[100px] text-xs text-yellow-300 sm:text-sm placeholder-purple-400 retro-caret"
            />
          ) : (
            <Textarea
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="ENTER YOUR MESSAGE..."
              className="flex-1 border-2 border-purple-500 bg-black h-[80px] sm:h-[100px] text-xs text-yellow-300 sm:text-sm placeholder-purple-400 resize-none retro-caret"
            />
          )}
          <Button
            onClick={onSend}
            className="bg-yellow-300 hover:bg-yellow-400 p-1.5 sm:p-2 w-8 sm:w-10 h-8 sm:h-10 text-black"
          >
            <Send className="w-full h-full" />
          </Button>
        </div>
        <div className="mt-1 sm:mt-2 text-[10px] text-center text-purple-400 sm:text-xs">
          PRESS ENTER TO SEND • CREDITS: {credits}
        </div>
      </div>
    </div>
  );
}
