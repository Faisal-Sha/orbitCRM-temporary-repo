
import React from "react";
import { Smile, Paperclip, Video, Send } from "lucide-react";

export interface ChatInputBarProps {
  onSend?: () => void;
  disabled?: boolean;
}

const ICON_SIZE = 20;

const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSend, disabled }) => {
  return (
    <div className="flex gap-2 items-center pr-1">
      <button
        type="button"
        className="rounded-full hover:bg-accent p-1 transition-colors"
        tabIndex={-1}
        aria-label="Add emoji"
      >
        <Smile className="h-5 w-5 text-muted-foreground" size={ICON_SIZE} />
      </button>
      <button
        type="button"
        className="rounded-full hover:bg-accent p-1 transition-colors"
        tabIndex={-1}
        aria-label="Attach file"
      >
        <Paperclip className="h-5 w-5 text-muted-foreground" size={ICON_SIZE} />
      </button>
      <button
        type="button"
        className="rounded-full hover:bg-accent p-1 transition-colors"
        tabIndex={-1}
        aria-label="Schedule video meeting"
      >
        <Video className="h-5 w-5 text-muted-foreground" size={ICON_SIZE} />
      </button>
      <button
        type="button"
        aria-label="Send"
        className="rounded-full flex items-center justify-center ml-2"
        disabled={disabled}
        onClick={() => {
          if (onSend && !disabled) onSend();
        }}
      >
        <Send className="h-5 w-5 text-muted-foreground opacity-80" size={ICON_SIZE} />
      </button>
    </div>
  );
};

export default ChatInputBar;
