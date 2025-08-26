
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { MoreVertical, Plus, Archive, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import GoalsPreviewPanel from "./GoalsPreviewPanel";

// Goal type definition
interface Goal {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Blocked" | "Completed" | "Cancelled";
  dueDate: Date | null;
  milestones?: Goal[];
  sectionId: string;
}

interface GoalsBoardViewProps {
  goals: Goal[];
  onAddGoal: (status: Goal["status"]) => void;
  onGoalUpdate?: (updatedGoal: Goal) => void;
}

const GoalsBoardView = ({ goals, onAddGoal, onGoalUpdate = () => {} }: GoalsBoardViewProps) => {
  const statuses: Goal["status"][] = ["To Do", "In Progress", "Blocked", "Completed", "Cancelled"];
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Work: "bg-blue-100 text-blue-800",
      Personal: "bg-green-100 text-green-800",
      Health: "bg-purple-100 text-purple-800",
      Meeting: "bg-orange-100 text-orange-800",
      Opportunity: "bg-teal-100 text-teal-800",
      Research: "bg-indigo-100 text-indigo-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsPreviewOpen(true);
  };

  const handlePanelClose = () => {
    setIsPreviewOpen(false);
    setSelectedGoal(null);
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:overflow-x-auto md:h-[calc(100vh-280px)]">
        {statuses.map((status) => {
          const statusGoals = goals.filter((goal) => goal.status === status);

          return (
            <div 
              key={status} 
              className="md:w-64 flex-shrink-0 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{status}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onAddGoal(status)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {statusGoals.map((goal) => (
                  <Card 
                    key={goal.id} 
                    className="bg-card shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleGoalClick(goal)}
                  >
                    <CardHeader className="p-3 pb-0 flex flex-row items-start justify-between space-y-0">
                      <div className="w-full overflow-hidden">
                        <CardTitle className="text-sm font-medium leading-tight">
                          {goal.title}
                        </CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>
                            <span className="flex items-center gap-2">
                              <Archive className="h-4 w-4" /> Archive
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span className="flex items-center gap-2">
                              <Delete className="h-4 w-4" /> Delete
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="p-3 pt-2">
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge 
                          variant="outline" 
                          className={cn(getCategoryColor(goal.category), "text-xs font-normal")}
                        >
                          {goal.category}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={cn(getPriorityColor(goal.priority), "text-xs font-normal")}
                        >
                          {goal.priority}
                        </Badge>
                      </div>
                      {goal.dueDate && (
                        <div className={cn(
                          "text-xs text-muted-foreground",
                          new Date(goal.dueDate) < new Date() && "text-red-500"
                        )}>
                          Due: {format(new Date(goal.dueDate), "MMM d, yyyy")}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {statusGoals.length === 0 && (
                  <div className="h-24 rounded-md border border-dashed flex items-center justify-center text-sm text-muted-foreground">
                    No goals
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <GoalsPreviewPanel
        isOpen={isPreviewOpen}
        onClose={handlePanelClose}
        goal={selectedGoal}
        onGoalUpdate={onGoalUpdate}
      />
    </>
  );
};

export default GoalsBoardView;
