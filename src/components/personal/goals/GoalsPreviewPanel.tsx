
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
import GoalsDetailsForm from "./GoalsDetailsForm";
import { Badge } from "@/components/ui/badge";
import FilesRecords from "@/components/FilesRecords";
import NotesRecords from "@/components/NotesRecords";
import CompanionedAIChat from "@/components/CompanionedAIChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus, CheckCircle, UserCheck, Mail, PhoneCall, AlertTriangle, Clock, Edit, Trash2 } from 'lucide-react';

// Goal type definition
interface Goal {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Blocked" | "Completed" | "Cancelled";
  dueDate: Date | null;
  milestones?: Goal[];
  isExpanded?: boolean;
  sectionId: string;
}

interface GoalsPreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onGoalUpdate: (updatedGoal: Goal) => void;
}

// Goal-specific activity data
const goalActivities = [
  { id: 1, title: "Goal Created", description: "Goal was created and assigned to you.", icon: CheckCircle, label: "Creation", date: "May 20, 2025", time: "09:30 AM", color: "bg-blue-500" },
  { id: 2, title: "Priority Updated", description: "Goal priority changed from Medium to High.", icon: Edit, label: "Update", date: "May 21, 2025", time: "11:45 AM", color: "bg-orange-500" },
  { id: 3, title: "Comment Added", description: "Team member added clarification comments.", icon: MessageSquare, label: "Comment", date: "May 22, 2025", time: "02:15 PM", color: "bg-green-500" },
  { id: 4, title: "Due Date Extended", description: "Goal deadline extended by 2 days due to dependencies.", icon: CalendarPlus, label: "Schedule", date: "May 23, 2025", time: "10:20 AM", color: "bg-purple-500" },
  { id: 5, title: "Status Changed", description: "Goal status updated from 'To Do' to 'In Progress'.", icon: Clock, label: "Status", date: "May 24, 2025", time: "08:45 AM", color: "bg-indigo-500" },
  { id: 6, title: "File Attached", description: "Project specifications document added to goal.", icon: FileText, label: "Attachment", date: "May 25, 2025", time: "03:30 PM", color: "bg-teal-500" },
  { id: 7, title: "Milestone Completed", description: "Research phase milestone marked as completed.", icon: CheckCircle, label: "Completion", date: "May 26, 2025", time: "04:10 PM", color: "bg-green-500" },
  { id: 8, title: "Review Requested", description: "Goal submitted for team lead review.", icon: UserCheck, label: "Review", date: "May 27, 2025", time: "01:25 PM", color: "bg-yellow-500" },
  { id: 9, title: "Blocked", description: "Goal blocked due to missing client approval.", icon: AlertTriangle, label: "Block", date: "May 28, 2025", time: "11:00 AM", color: "bg-red-500" },
];

// Newest at the TOP for timeline (reverse array order)
const timelineActivities = [...goalActivities].reverse();

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

const GoalsPreviewPanel: React.FC<GoalsPreviewPanelProps> = ({
  isOpen,
  onClose,
  goal,
  onGoalUpdate
}) => {
  const [activeTab, setActiveTab] = useState("details");

  if (!goal) return null;

  const handleMarkAsDone = () => {
    if (!goal) return;
    onGoalUpdate({
      ...goal,
      status: goal.status === "Completed" ? "To Do" : "Completed"
    });
  };

  // Get section label and color
  const sectionLabel = sectionLabelMap[goal.sectionId] || "";
  const sectionLabelColor = sectionLabelColorMap[goal.sectionId] || "bg-gray-100 text-gray-800";

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
              <h2 className="text-lg font-medium">Goal details</h2>
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
                className={goal.status === "Completed" ? "bg-green-50 text-green-600 border-green-200" : ""}
              >
                <Check className="h-4 w-4 mr-1" />
                {goal.status === "Completed" ? "Completed" : "Mark as done"}
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
                  Goal Notes
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
                  <GoalsDetailsForm goal={goal} onGoalUpdate={onGoalUpdate} />
                </div>
              </div>
            </TabsContent>
            
            {/* --- GOAL NOTES TAB --- */}
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
                        <CardTitle className="text-lg">Goal Activity Timeline</CardTitle>
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

export default GoalsPreviewPanel;
