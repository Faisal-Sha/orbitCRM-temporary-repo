
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import CompanionedAIChat from "@/components/CompanionedAIChat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TabsComponent from "@/components/TabsComponent";
import DashboardHeader from "./DashboardHeader";
import GoalsOverview from "./GoalsOverview";
import TasksOverview from "./TasksOverview";
import NotesOverview from "./NotesOverview";

const Dashboard = () => {
  const [showAIChat, setShowAIChat] = useState(false);

  const tabs = [
    { 
      value: "goals", 
      label: "Goals Overview", 
      content: <GoalsOverview /> 
    },
    { 
      value: "tasks", 
      label: "Tasks Overview", 
      content: <TasksOverview /> 
    },
    { 
      value: "notes", 
      label: "Notes Overview", 
      content: <NotesOverview /> 
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <DashboardHeader 
        showAIChat={showAIChat}
        onToggleChat={() => setShowAIChat(!showAIChat)}
      />

      {/* AI Chat Section */}
      {showAIChat && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              AI Assistant
            </CardTitle>
            <CardDescription>Get insights about your goals, tasks and notes</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <CompanionedAIChat />
          </CardContent>
        </Card>
      )}

      <TabsComponent tabs={tabs} defaultTab="goals" />
    </div>
  );
};

export default Dashboard;
