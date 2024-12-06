interface ChatHeaderProps {
  score: number;
  credits: number;
}

export function ChatHeader({ score, credits }: ChatHeaderProps) {
  return (
    <div>
      <div className="flex justify-between p-2 sm:p-4">
        <div className="text-xs sm:text-base score-display">
          1UP {score.toString().padStart(6, "0")}
        </div>
        <div className="text-center">
          <h1 className="text-xl text-yellow-300 sm:text-2xl">RETRO AI CHAT</h1>
          <h2 className="text-lg sm:text-xl gradient-text">ARCADE EDITION</h2>
        </div>
        <div className="text-xs sm:text-base score-display">CREDITS {credits}</div>
      </div>
    </div>
  );
}
