
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
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

interface GoalsCalendarViewProps {
  goals: Goal[];
  onGoalUpdate?: (updatedGoal: Goal) => void;
}

const GoalsCalendarView = ({ goals, onGoalUpdate = () => {} }: GoalsCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getDayGoals = (day: Date) => {
    return goals.filter((goal) => 
      goal.dueDate && isSameDay(new Date(goal.dueDate), day)
    );
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

  const selectedDayGoals = selectedDate ? getDayGoals(selectedDate) : [];

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 pt-2">
        <div className="md:w-1/2 lg:w-1/3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="border rounded-md p-4"
            modifiersStyles={{
              hasGoal: { 
                fontWeight: "bold",
                backgroundColor: "var(--muted)"
              }
            }}
            modifiers={{
              hasGoal: (date) => getDayGoals(date).length > 0,
            }}
            components={{
              DayContent: (props) => {
                const dayGoals = getDayGoals(props.date);
                return (
                  <div className="relative">
                    <div>{props.date.getDate()}</div>
                    {dayGoals.length > 0 && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayGoals.length <= 3 ? (
                          Array.from({ length: dayGoals.length }).map((_, i) => (
                            <div 
                              key={i} 
                              className="h-1 w-1 rounded-full bg-primary"
                            />
                          ))
                        ) : (
                          <>
                            <div className="h-1 w-1 rounded-full bg-primary" />
                            <div className="h-1 w-1 rounded-full bg-primary" />
                            <div className="h-1 w-1 rounded-full bg-primary" />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            }}
          />
        </div>

        <div className="md:w-1/2 lg:w-2/3 space-y-4">
          <h3 className="text-lg font-medium">
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
          </h3>
          
          <div className="space-y-3">
            {selectedDayGoals.length > 0 ? (
              selectedDayGoals.map((goal) => (
                <Card 
                  key={goal.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleGoalClick(goal)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {goal.title}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {goal.category}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={cn(getPriorityColor(goal.priority))}
                      >
                        {goal.priority}
                      </Badge>
                      <Badge 
                        variant={goal.status === "Completed" ? "default" : "outline"}
                        className={goal.status === "Completed" ? "bg-green-500" : undefined}
                      >
                        {goal.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="border rounded-md h-32 flex items-center justify-center text-muted-foreground">
                No goals scheduled for this day
              </div>
            )}
          </div>
        </div>
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

export default GoalsCalendarView;
