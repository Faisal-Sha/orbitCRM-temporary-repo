
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ChatInputBar from "./ChatInputBar";
import { directMessagesData, generateDummyMessages, getStatusColor } from "./TeamChatShared";
import TeamMessageList from "./TeamMessageList";
import TeamChatHeader from "./TeamChatHeader";
import { MessageCircle } from "lucide-react";

const SESSION_KEY = "last_open_dm_chat_id";

const TeamPersonalChat = () => {
  const [directMessages] = useState(directMessagesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDirectMessage, setActiveDirectMessage] = useState<number | null>(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return Number(stored);
    return null;
  });
  const [directMessageThreads, setDirectMessageThreads] = useState<Record<number, any[]>>({});
  const [hasInteractedWithChat, setHasInteractedWithChat] = useState<boolean>(!!activeDirectMessage);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Populate messages
    const initialDMs: Record<number, any[]> = {};
    directMessages.forEach((dm) => {
      initialDMs[dm.id] = generateDummyMessages(dm.id);
    });
    setDirectMessageThreads(initialDMs);
  }, []);

  useEffect(() => {
    if (
      messagesEndRef.current &&
      activeDirectMessage
    ) {
      const messagesContainer = messagesEndRef.current.parentElement;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [activeDirectMessage, directMessageThreads[activeDirectMessage]?.length]); // scroll on change

  const handleSendMessage = () => {
    if (!newMessage.trim() || activeDirectMessage === null) return;
    const newMsg = {
      id: directMessageThreads[activeDirectMessage]?.length + 1 || 1,
      user: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      message: newMessage,
      time: "Just now",
      isCurrentUser: true,
      reactions: 0,
      replies: 0,
      attachmentType: null,
      attachmentName: null,
    };
    setDirectMessageThreads((prev) => ({
      ...prev,
      [activeDirectMessage]: [...(prev[activeDirectMessage] || []), newMsg],
    }));
    setNewMessage("");

    // Scroll to bottom after sending message
    setTimeout(() => {
      if (messagesEndRef.current) {
        const messagesContainer = messagesEndRef.current.parentElement;
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }
    }, 100);
  };

  const filteredDirectMessages = directMessages.filter((dm) =>
    dm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDirectMessageData = activeDirectMessage
    ? directMessages.find((dm) => dm.id === activeDirectMessage)
    : null;

  // Save last active DM to session on change
  useEffect(() => {
    if (activeDirectMessage !== null) {
      sessionStorage.setItem(SESSION_KEY, String(activeDirectMessage));
    }
  }, [activeDirectMessage]);

  return (
    <div className="flex h-[calc(100vh-12rem)]">
      {/* Sidebar */}
      <div className="w-80 border-r bg-background flex flex-col">
        <div className="p-3 border-b">
          <Button variant="outline" size="sm" className="w-full">
            New conversation
          </Button>
        </div>
        <div className="p-3 border-b">
          <div className="relative">
            <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search direct messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-2">
            {filteredDirectMessages.map((dm) => (
              <div
                key={dm.id}
                className={`flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 cursor-pointer ${activeDirectMessage === dm.id ? "bg-accent/50" : ""}`}
                onClick={() => {
                  setActiveDirectMessage(dm.id);
                  setHasInteractedWithChat(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={dm.avatar} alt={dm.name} className="w-8 h-8 rounded-full" />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(dm.status)}`}
                    ></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{dm.name}</span>
                    <span className="text-xs text-muted-foreground">{dm.lastActive}</span>
                  </div>
                </div>
                {dm.unread > 0 && (
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {dm.unread}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Main Panel */}
      {activeDirectMessage && hasInteractedWithChat ? (
        <div className="flex-1 flex flex-col bg-background">
          <TeamChatHeader type="chat" data={activeDirectMessageData} />
          <TeamMessageList messages={directMessageThreads[activeDirectMessage] || []} />
          <div ref={messagesEndRef} />
          {/* Message input */}
          <div className="border-t bg-muted/50 px-4 py-3">
            <div className="flex gap-2 items-end">
              <textarea
                className="flex-1 resize-none border rounded-md p-2"
                placeholder="Type your message..."
                rows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <ChatInputBar onSend={handleSendMessage} disabled={!newMessage.trim()} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-background">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-muted-foreground max-w-md">
            Choose a conversation from the list or start a new one.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamPersonalChat;
