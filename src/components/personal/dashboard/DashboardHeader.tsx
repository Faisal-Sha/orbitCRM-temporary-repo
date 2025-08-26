
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface DashboardHeaderProps {
  showAIChat: boolean;
  onToggleChat: () => void;
}

const DashboardHeader = ({ showAIChat, onToggleChat }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Personal Dashboard</h1>
        <p className="text-muted-foreground">Your AI-powered overview of tasks and notes</p>
      </div>
      <Button 
        onClick={onToggleChat}
        className={`flex items-center gap-2 ${
          showAIChat 
            ? "bg-white text-primary border border-primary hover:bg-gray-50" 
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        <MessageCircle className="h-4 w-4" />
        {showAIChat ? "Close Chat" : "CompanionedAI"}
      </Button>
    </div>
  );
};

export default DashboardHeader;
