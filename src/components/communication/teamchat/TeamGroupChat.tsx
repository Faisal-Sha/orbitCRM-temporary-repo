
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ChatInputBar from "./ChatInputBar";
import { spacesData, generateDummyMessages } from "./TeamChatShared";
import TeamMessageList from "./TeamMessageList";
import TeamChatHeader from "./TeamChatHeader";
import { Users, Star } from "lucide-react";

const SESSION_KEY = "last_open_group_chat_id";

const TeamGroupChat = () => {
  const [spaces] = useState(spacesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSpace, setActiveSpace] = useState<number | null>(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return Number(stored);
    return null;
  });
  const [spaceMessages, setSpaceMessages] = useState<Record<number, any[]>>({});
  const [hasInteractedWithSpaces, setHasInteractedWithSpaces] = useState<boolean>(!!activeSpace);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dummy populate
    const initialSpaces: Record<number, any[]> = {};
    spaces.forEach((space) => {
      initialSpaces[space.id] = generateDummyMessages(space.id);
    });
    setSpaceMessages(initialSpaces);
  }, []);

  useEffect(() => {
    if (
      messagesEndRef.current &&
      activeSpace
    ) {
      const messagesContainer = messagesEndRef.current.parentElement;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [activeSpace, spaceMessages[activeSpace]?.length]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || activeSpace === null) return;
    const newMsg = {
      id: spaceMessages[activeSpace]?.length + 1 || 1,
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
    setSpaceMessages((prev) => ({
      ...prev,
      [activeSpace]: [...(prev[activeSpace] || []), newMsg],
    }));
    setNewMessage("");
    setTimeout(() => {
      if (messagesEndRef.current) {
        const messagesContainer = messagesEndRef.current.parentElement;
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }
    }, 100);
  };

  const filteredSpaces = spaces.filter((space) =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSpaceData = activeSpace
    ? spaces.find((s) => s.id === activeSpace)
    : null;

  useEffect(() => {
    if (activeSpace !== null) {
      sessionStorage.setItem(SESSION_KEY, String(activeSpace));
    }
  }, [activeSpace]);

  return (
    <div className="flex h-[calc(100vh-12rem)]">
      {/* Sidebar */}
      <div className="w-80 border-r bg-background flex flex-col">
        <div className="p-3 border-b">
          <Button variant="outline" size="sm" className="w-full">
            Create group
          </Button>
        </div>
        <div className="p-3 border-b">
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-2">
            {filteredSpaces.map((space) => (
              <div
                key={space.id}
                className={`flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 cursor-pointer ${activeSpace === space.id ? "bg-accent/50" : ""}`}
                onClick={() => {
                  setActiveSpace(space.id);
                  setHasInteractedWithSpaces(true);
                }}
              >
                <div className="flex items-center gap-3">
                  {space.pinned && <Star className="h-4 w-4 text-primary" />}
                  <span className="text-sm">{space.name}</span>
                  {space.unread > 0 && (
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      {space.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Main Panel */}
      {activeSpace && hasInteractedWithSpaces ? (
        <div className="flex-1 flex flex-col bg-background">
          <TeamChatHeader type="spaces" data={activeSpaceData} />
          <TeamMessageList messages={spaceMessages[activeSpace] || []} />
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
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Select a group</h3>
          <p className="text-muted-foreground max-w-md">
            Choose a group from the list or create a new one.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamGroupChat;
