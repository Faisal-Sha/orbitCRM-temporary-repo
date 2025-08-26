
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ChatInputBar from "./ChatInputBar";
import {
  taskChatsData,
  generateTaskMessages,
  getCategoryColor,
  getPriorityColor
} from "./TeamChatShared";
import TeamMessageList from "./TeamMessageList";
import TeamChatHeader from "./TeamChatHeader";
import { ListTodo, User, Clock } from "lucide-react";

const SESSION_KEY = "last_open_task_chat_id";

const TeamTaskChat = () => {
  const [tasks] = useState(taskChatsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTask, setActiveTask] = useState<number | null>(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return Number(stored);
    return null;
  });
  const [taskThreads, setTaskThreads] = useState<Record<number, any[]>>({});
  const [hasInteractedWithTasks, setHasInteractedWithTasks] = useState<boolean>(!!activeTask);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dummy populate
    const initialTasks: Record<number, any[]> = {};
    tasks.forEach((task) => {
      initialTasks[task.id] = generateTaskMessages(task.id, task);
    });
    setTaskThreads(initialTasks);
  }, []);

  useEffect(() => {
    if (
      messagesEndRef.current &&
      activeTask
    ) {
      const messagesContainer = messagesEndRef.current.parentElement;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [activeTask, taskThreads[activeTask]?.length]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || activeTask === null) return;
    const newMsg = {
      id: taskThreads[activeTask]?.length + 1 || 1,
      user: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      message: newMessage,
      time: "Just now",
      isCurrentUser: true,
      reactions: 0,
      attachmentType: null,
      attachmentName: null,
      taggedMembers: [],
    };
    setTaskThreads((prev) => ({
      ...prev,
      [activeTask]: [...(prev[activeTask] || []), newMsg],
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

  const handleMarkTaskAsDone = () => {
    if (activeTask) {
      const newMsg = {
        id: taskThreads[activeTask].length + 1,
        user: "System",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=System",
        message: "Task marked as completed",
        time: "Just now",
        isCurrentUser: false,
        isSystemMessage: true,
        reactions: 0,
        attachmentType: null,
        attachmentName: null,
      };
      setTaskThreads((prev) => ({
        ...prev,
        [activeTask]: [...(prev[activeTask] || []), newMsg],
      }));
    }
  };

  const handleArchiveTask = () => {
    if (activeTask) {
      const newMsg = {
        id: taskThreads[activeTask].length + 1,
        user: "System",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=System",
        message: "Task archived",
        time: "Just now",
        isCurrentUser: false,
        isSystemMessage: true,
        reactions: 0,
        attachmentType: null,
        attachmentName: null,
      };
      setTaskThreads((prev) => ({
        ...prev,
        [activeTask]: [...(prev[activeTask] || []), newMsg],
      }));
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.contactName &&
        task.contactName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeTaskData = activeTask
    ? tasks.find((t) => t.id === activeTask)
    : null;

  useEffect(() => {
    if (activeTask !== null) {
      sessionStorage.setItem(SESSION_KEY, String(activeTask));
    }
  }, [activeTask]);

  return (
    <div className="flex h-[calc(100vh-12rem)]">
      {/* Sidebar */}
      <div className="w-80 border-r bg-background flex flex-col">
        <div className="p-3 border-b">
          <Button variant="outline" size="sm" className="w-full">
            Create task
          </Button>
        </div>
        <div className="p-3 border-b">
          <div className="relative">
            <ListTodo className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`flex flex-col p-2 rounded-lg hover:bg-accent/50 cursor-pointer ${activeTask === task.id ? "bg-accent/50" : ""}`}
                onClick={() => {
                  setActiveTask(task.id);
                  setHasInteractedWithTasks(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {task.isFollowUp ? (
                      <div className="relative">
                        <img src={task.contactAvatar} alt={task.contactName} className="w-8 h-8 rounded-full" />
                      </div>
                    ) : (
                      <ListTodo className="h-5 w-5 text-primary" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate max-w-[180px]">
                        {task.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {task.lastUpdated}
                      </span>
                    </div>
                  </div>
                  {task.unread > 0 && (
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      {task.unread}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className={getCategoryColor(task.category)}>
                    {task.category}
                  </Badge>
                  <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                {task.dueDate && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Due: {task.dueDate}</span>
                  </div>
                )}
                {task.assignedTeammates.length > 0 && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>
                      {task.assignedTeammates.length === 1
                        ? task.assignedTeammates[0]
                        : `${task.assignedTeammates[0]} +${task.assignedTeammates.length - 1}`}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                <p>No tasks found.</p>
                <p className="text-sm mt-2">
                  Try adjusting your search or create a new task.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Main Panel */}
      {activeTask && hasInteractedWithTasks ? (
        <div className="flex-1 flex flex-col bg-background">
          <TeamChatHeader
            type="tasks"
            data={activeTaskData}
            onMarkDone={handleMarkTaskAsDone}
            onArchive={handleArchiveTask}
          />
          <TeamMessageList messages={taskThreads[activeTask] || []} />
          <div ref={messagesEndRef} />
          {/* Message input */}
          <div className="border-t bg-muted/50 px-4 py-3">
            <div className="flex gap-2 items-end">
              <textarea
                className="flex-1 resize-none border rounded-md p-2"
                placeholder="Type your message... (use @ to tag team members)"
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
            <ListTodo className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Select a task</h3>
          <p className="text-muted-foreground max-w-md">
            Choose a task from the list or create a new one.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamTaskChat;
