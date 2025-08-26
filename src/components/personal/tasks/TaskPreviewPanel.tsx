import React, { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Heart, Reply, Check, Archive, Trash, Download, ExternalLink, MessageSquare, Paperclip, Link as LinkIcon, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import TaskDetailsForm from "./TaskDetailsForm";
import { Badge } from "@/components/ui/badge";
import FilesRecords from "@/components/FilesRecords";
import NotesRecords from "@/components/NotesRecords";
import CompanionedAIChat from "@/components/CompanionedAIChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus, CheckCircle, UserCheck, Mail, PhoneCall, AlertTriangle, Clock, Edit, Trash2 } from 'lucide-react';

// Task type definition
interface Task {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Blocked" | "Completed" | "Cancelled";
  dueDate: Date | null;
  subtasks?: Task[];
  isExpanded?: boolean;
  sectionId: string;
}

interface TaskPreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdate: (updatedTask: Task) => void;
}

// Task-specific activity data
const taskActivities = [
  { id: 1, title: "Task Created", description: "Task was created and assigned to you.", icon: CheckCircle, label: "Creation", date: "May 20, 2025", time: "09:30 AM", color: "bg-blue-500" },
  { id: 2, title: "Priority Updated", description: "Task priority changed from Medium to High.", icon: Edit, label: "Update", date: "May 21, 2025", time: "11:45 AM", color: "bg-orange-500" },
  { id: 3, title: "Comment Added", description: "Team member added clarification comments.", icon: MessageSquare, label: "Comment", date: "May 22, 2025", time: "02:15 PM", color: "bg-green-500" },
  { id: 4, title: "Due Date Extended", description: "Task deadline extended by 2 days due to dependencies.", icon: CalendarPlus, label: "Schedule", date: "May 23, 2025", time: "10:20 AM", color: "bg-purple-500" },
  { id: 5, title: "Status Changed", description: "Task status updated from 'To Do' to 'In Progress'.", icon: Clock, label: "Status", date: "May 24, 2025", time: "08:45 AM", color: "bg-indigo-500" },
  { id: 6, title: "File Attached", description: "Project specifications document added to task.", icon: FileText, label: "Attachment", date: "May 25, 2025", time: "03:30 PM", color: "bg-teal-500" },
  { id: 7, title: "Subtask Completed", description: "Research phase subtask marked as completed.", icon: CheckCircle, label: "Completion", date: "May 26, 2025", time: "04:10 PM", color: "bg-green-500" },
  { id: 8, title: "Review Requested", description: "Task submitted for team lead review.", icon: UserCheck, label: "Review", date: "May 27, 2025", time: "01:25 PM", color: "bg-yellow-500" },
  { id: 9, title: "Blocked", description: "Task blocked due to missing client approval.", icon: AlertTriangle, label: "Block", date: "May 28, 2025", time: "11:00 AM", color: "bg-red-500" },
];

// Newest at the TOP for timeline (reverse array order)
const timelineActivities = [...taskActivities].reverse();

// Dummy data for demonstrations
const dummyComments = [
  {
    id: "comment-1",
    author: "John Doe",
    avatar: "",
    initials: "JD",
    content: "I've started working on this task. Will update once the first phase is complete.",
    timestamp: new Date(2025, 4, 10, 9, 30),
    likes: 2,
    replies: [
      {
        id: "reply-1",
        author: "Sarah Smith",
        avatar: "",
        initials: "SS",
        content: "Great! Let me know if you need any help with the implementation.",
        timestamp: new Date(2025, 4, 10, 10, 15),
        likes: 1
      }
    ]
  },
  {
    id: "comment-2",
    author: "Mike Johnson",
    avatar: "",
    initials: "MJ",
    content: "I've shared some resources that might be useful for this task. Check the Files tab.",
    timestamp: new Date(2025, 4, 11, 14, 45),
    likes: 3,
    mentions: ["@Sarah"]
  },
  {
    id: "comment-3",
    author: "Emily Davis",
    avatar: "",
    initials: "ED",
    content: "I think we should consider updating our approach based on the recent client feedback.",
    timestamp: new Date(2025, 4, 12, 9, 20),
    likes: 1,
    replies: []
  },
  {
    id: "comment-4",
    author: "Alex Thompson",
    avatar: "",
    initials: "AT",
    content: "Just wanted to check if there are any blockers on this task? Let me know if I can help.",
    timestamp: new Date(2025, 4, 13, 11, 5),
    likes: 0,
    replies: [
      {
        id: "reply-2",
        author: "John Doe",
        avatar: "",
        initials: "JD",
        content: "All good so far, thanks for checking in!",
        timestamp: new Date(2025, 4, 13, 11, 30),
        likes: 1
      },
      {
        id: "reply-3",
        author: "Sarah Smith",
        avatar: "",
        initials: "SS",
        content: "I might need some help with the integration part later this week.",
        timestamp: new Date(2025, 4, 13, 12, 45),
        likes: 0
      }
    ]
  },
  {
    id: "comment-5",
    author: "Lisa Wong",
    avatar: "",
    initials: "LW",
    content: "@John can you share the latest version of the specifications document?",
    timestamp: new Date(2025, 4, 14, 15, 10),
    likes: 2,
    mentions: ["@John"]
  }
];

const dummyFiles = [
  {
    id: "file-1",
    name: "Project_Requirements.pdf",
    size: "2.4 MB",
    uploadedBy: "John Doe",
    uploadDate: new Date(2025, 4, 9)
  },
  {
    id: "file-2",
    name: "Design_Mockups.zip",
    size: "14.8 MB",
    uploadedBy: "Sarah Smith",
    uploadDate: new Date(2025, 4, 10)
  },
  {
    id: "file-3",
    name: "Meeting_Notes.docx",
    size: "456 KB",
    uploadedBy: "Mike Johnson",
    uploadDate: new Date(2025, 4, 11)
  },
  {
    id: "file-4",
    name: "Client_Feedback.pdf",
    size: "1.2 MB",
    uploadedBy: "Emily Davis",
    uploadDate: new Date(2025, 4, 12)
  },
  {
    id: "file-5",
    name: "Technical_Specs.xlsx",
    size: "3.7 MB",
    uploadedBy: "Alex Thompson",
    uploadDate: new Date(2025, 4, 13)
  },
  {
    id: "file-6",
    name: "Budget_Proposal.pdf",
    size: "845 KB",
    uploadedBy: "Lisa Wong",
    uploadDate: new Date(2025, 4, 14)
  },
  {
    id: "file-7",
    name: "Implementation_Plan.pptx",
    size: "5.2 MB",
    uploadedBy: "John Doe",
    uploadDate: new Date(2025, 4, 15)
  }
];

const dummyLinks = [
  {
    id: "link-1",
    title: "Client Profile - Acme Corp",
    type: "CRM Contact",
    url: "/clients/acme-corp"
  },
  {
    id: "link-2",
    title: "Sales Meeting - Q2 Review",
    type: "Calendar Event",
    url: "/calendar/event-123"
  },
  {
    id: "link-3",
    title: "Support Ticket #4567",
    type: "Support Ticket",
    url: "/support/ticket-4567"
  },
  {
    id: "link-4",
    title: "Email Thread - Project Kickoff",
    type: "Email",
    url: "/emails/thread-789"
  },
  {
    id: "link-5",
    title: "Patient Record - Jane Smith",
    type: "EHR Patient",
    url: "/patients/jane-smith"
  },
  {
    id: "link-6",
    title: "Progress Note - Session #3",
    type: "EHR Note",
    url: "/patients/notes/session-3"
  },
  {
    id: "link-7",
    title: "Intake Assessment - New Client",
    type: "EHR Assessment",
    url: "/patients/assessments/intake-456"
  },
  {
    id: "link-8",
    title: "Client Issues - Treatment Plan",
    type: "EHR Plan",
    url: "/patients/plans/treatment-789"
  }
];

// Section label by sectionId
const sectionLabelMap: Record<string, string> = {
  personal: "Personal",
  team: "Team",
  goals: "Goals"
};
const sectionLabelColorMap: Record<string, string> = {
  personal: "bg-gray-100 text-gray-800",
  team: "bg-blue-100 text-blue-800",
  goals: "bg-purple-100 text-purple-800"
};

const TaskPreviewPanel: React.FC<TaskPreviewPanelProps> = ({
  isOpen,
  onClose,
  task,
  onTaskUpdate
}) => {
  const [activeTab, setActiveTab] = useState("details");

  if (!task) return null;

  const handleMarkAsDone = () => {
    if (!task) return;
    onTaskUpdate({
      ...task,
      status: task.status === "Completed" ? "To Do" : "Completed"
    });
  };

  // Get section label and color
  const sectionLabel = sectionLabelMap[task.sectionId] || "";
  const sectionLabelColor = sectionLabelColorMap[task.sectionId] || "bg-gray-100 text-gray-800";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        className="w-[50%] sm:max-w-none p-0 border-l" 
        side="right"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center relative">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">Task details</h2>
              <Badge
                className={cn(
                  "ml-2 px-2 py-1 rounded text-xs font-bold",
                  sectionLabelColor
                )}
              >
                {sectionLabel}
              </Badge>
            </div>
            <div className="flex items-center gap-2" style={{ marginRight: "40px" }}>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMarkAsDone}
                className={task.status === "Completed" ? "bg-green-50 text-green-600 border-green-200" : ""}
              >
                <Check className="h-4 w-4 mr-1" />
                {task.status === "Completed" ? "Completed" : "Mark as done"}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground"
              >
                <Archive className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs 
            defaultValue="details" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* --- TABS LIST --- */}
            <div className="px-6 bg-background border-b shrink-0">
              <TabsList className="mt-4 mb-2 h-10 flex w-full overflow-visible gap-1 min-w-0">
                <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-sm min-w-0 max-w-full truncate flex-1 shrink basis-0">
                  Details
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-sm min-w-0 max-w-full truncate flex-1 shrink basis-0">
                  Task Notes
                </TabsTrigger>
                <TabsTrigger value="files" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-sm min-w-0 max-w-full truncate flex-1 shrink basis-0">
                  Files
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-sm min-w-0 max-w-full truncate flex-1 shrink basis-0">
                  Activity
                </TabsTrigger>
                <TabsTrigger value="ai" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-sm min-w-0 max-w-full truncate flex-1 shrink basis-0">
                  CompanionedAI
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* --- DETAILS TAB --- */}
            <TabsContent value="details" className="flex-1 overflow-hidden data-[state=inactive]:hidden px-5 md:px-10 pt-4 flex flex-col min-h-0">
              {/* Added wrapper + padding for consistency */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <TaskDetailsForm task={task} onTaskUpdate={onTaskUpdate} />
                </div>
              </div>
            </TabsContent>
            
            {/* --- TASK NOTES TAB --- */}
            <TabsContent value="notes" className="flex-1 overflow-hidden data-[state=inactive]:hidden px-5 md:px-10 pt-4 flex flex-col min-h-0">
              <div className="flex-1 min-h-0 flex flex-col">
                <NotesRecords />
              </div>
            </TabsContent>
            
            {/* --- FILES TAB --- */}
            <TabsContent value="files" className="flex-1 overflow-hidden data-[state=inactive]:hidden px-5 md:px-10 pt-4 flex flex-col min-h-0">
              <div className="flex-1 w-full min-h-0 flex flex-col">
                <FilesRecords />
              </div>
            </TabsContent>
            
            {/* --- ACTIVITY TAB --- */}
            <TabsContent value="activity" className="flex-1 overflow-hidden data-[state=inactive]:hidden px-5 md:px-10 pt-4 flex flex-col min-h-0">
              <div className="flex-1 min-h-0 flex flex-col">
                <ScrollArea className="h-full">
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Task Activity Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative pl-6">
                          {/* Timeline line */}
                          <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                          {timelineActivities.map((activity, index) => (
                            <div key={activity.id} className="relative mb-6 pl-8 group hover:bg-gray-50/50 p-2 rounded-md transition-colors duration-150">
                              {/* Dot on the timeline */}
                              <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full ${activity.color} transform -translate-x-1/2 border-2 border-white group-hover:scale-110 transition-transform`}></div>
                              <div className="flex items-center mb-1">
                                <activity.icon className={`h-5 w-5 mr-2 ${activity.color.replace('bg-', 'text-')}`} />
                                <h4 className="font-semibold text-md">{activity.title}</h4>
                                <Badge variant="outline" className="ml-auto text-xs">{activity.label}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                              <p className="text-xs text-gray-400">{activity.date} at {activity.time}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            
            {/* --- COMPANIONEDAI TAB --- */}
            <TabsContent value="ai" className="flex-1 overflow-hidden data-[state=inactive]:hidden px-5 md:px-10 pt-4 flex flex-col min-h-0">
              <div className="flex-1 min-h-0 flex flex-col">
                <CompanionedAIChat />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaskPreviewPanel;
