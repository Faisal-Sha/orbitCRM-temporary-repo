
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MessageListProps {
  messages: any[];
}

const TeamMessageList = ({ messages }: MessageListProps) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
    <div className="mb-4"></div>
    {messages.map((message) => {
      const isMine = message.isCurrentUser;
      return (
        <div key={message.id} className={cn("flex flex-col gap-2", isMine ? "items-end" : "items-start")}>
          <div className={cn("flex items-end gap-2", isMine ? "justify-end" : "")}>
            {!isMine && (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold shrink-0">
                <img
                  src={message.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Other"}
                  alt={message.user}
                  className="h-8 w-8 rounded-full"
                />
              </div>
            )}
            <div className={cn(
              "min-w-[200px] max-w-[80vw] md:max-w-[500px] p-3 rounded-lg shadow-sm relative group flex-1",
              isMine ? "bg-primary text-white rounded-br-none ml-auto" : "bg-muted text-gray-800 rounded-bl-none"
            )}>
              <div className="flex flex-row items-center justify-between gap-2">
                <span className="font-medium text-sm">{message.user}</span>
                <span className={isMine ? "text-xs text-white font-semibold" : "text-xs text-gray-600 font-semibold"}>
                  {message.time}
                </span>
              </div>
              <div className="mt-1 text-sm break-words">{message.message}</div>
            </div>
            {isMine && (
              <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center font-bold shrink-0">
                <img
                  src={message.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=You"}
                  alt={message.user}
                  className="h-8 w-8 rounded-full"
                />
              </div>
            )}
          </div>
          {/* Actions (like/reply) */}
          <div className={cn("flex gap-2 text-xs mt-1 px-2", isMine ? "justify-end" : "")}>
            <button
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors",
                isMine ? "text-primary" : "text-gray-600"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21c-6.075-4.58-10-7.532-10-11.502C2 6.37 4.686 4 7.5 4c1.613 0 3.235.81 4.5 2.09C13.265 4.81 14.887 4 16.5 4 19.314 4 22 6.37 22 9.498c0 3.97-3.925 6.923-10 11.502z"/></svg>
            </button>
            <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10V6a1 1 0 01.883-.993L4 5h7a5 5 0 015 5v1m-7 2V9m0 0H3"></path></svg>
              <span>Reply</span>
            </button>
          </div>
        </div>
      );
    })}
  </div>
);

export default TeamMessageList;
