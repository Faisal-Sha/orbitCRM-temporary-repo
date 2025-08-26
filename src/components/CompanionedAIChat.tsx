
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Send, User, Smile } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea"; // Add textarea import

// The Message type stays the same
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

// Populate with enough messages to require scroll (25+)
const DUMMY_MESSAGES: Message[] = [
  { id: '1', text: "Hello! How can I assist you today?", sender: 'ai', timestamp: "10:00 AM" },
  { id: '2', text: "I'm looking for information on managing anxiety.", sender: 'user', timestamp: "10:01 AM" },
  { id: '3', text: "Certainly. I can provide you with some resources and techniques. Would you like to start with breathing exercises or information on cognitive behavioral therapy?", sender: 'ai', timestamp: "10:02 AM" },
  { id: '4', text: "Let's start with breathing exercises.", sender: 'user', timestamp: "10:03 AM" },
  { id: '5', text: "Great choice! One simple technique is a 4-7-8 breath. Inhale for 4 seconds, hold for 7, and exhale for 8. Try it a few times.", sender: 'ai', timestamp: "10:04 AM" },
  { id: '6', text: "Okay, I'll try that. What else?", sender: 'user', timestamp: "10:05 AM" },
  { id: '7', text: "We can also discuss mindfulness meditation. It involves focusing on your present moment without judgment. Interested?", sender: 'ai', timestamp: "10:06 AM" },
  { id: '8', text: "Yes, tell me more about mindfulness.", sender: 'user', timestamp: "10:07 AM" },
  { id: '9', text: "Mindfulness can help reduce stress and improve focus. You can start with just 5 minutes a day, focusing on your breath or bodily sensations.", sender: 'ai', timestamp: "10:08 AM" },
  { id: '10', text: "That sounds helpful. Thanks!", sender: 'user', timestamp: "10:09 AM" },
  // 23 more to demonstrate scrolling
  ...Array.from({ length: 23 }).map((_, i) => ({
    id: String(11 + i),
    text: i % 2 === 0
      ? "Tell me more about stress management. What's another useful technique I can try?"
      : "Deep breathing is a great start. You might also try progressive muscle relaxation. Would you like a step-by-step guide?",
    sender: (i % 2 === 0 ? 'user' : 'ai') as 'user' | 'ai',
    timestamp: `10:${10 + i + 1 < 10 ? '0' : ''}${10 + i + 1} AM`,
  }))
];

const CompanionedAIChat = () => {
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: String(Date.now()),
        text: inputValue,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputValue('');
      setTimeout(() => {
        const aiResponse: Message = {
          id: String(Date.now() + 1),
          text: "Thanks for your message. I'm processing your request.",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prevMessages => [...prevMessages, aiResponse]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-background rounded-lg border">
      <ScrollArea
        className="flex-1 min-h-0"
        ref={scrollAreaRef}
        style={{ maxHeight: '100%', minHeight: 0 }}
      >
        <div className="space-y-4 px-2 py-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Smile className="h-5 w-5 text-primary" />
                </div>
              )}
              <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>{msg.timestamp}</p>
              </div>
              {msg.sender === 'user' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-5 w-5 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-3 border-t bg-muted/50">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Type a message..."
            className="flex-1 bg-background resize-none"
            value={inputValue}
            rows={2}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => (e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), handleSendMessage()) : undefined)}
            aria-label="Type message"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanionedAIChat;
