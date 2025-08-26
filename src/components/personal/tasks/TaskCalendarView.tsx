import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import TaskPreviewPanel from "./TaskPreviewPanel";

// Task type definition
interface Task {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Blocked" | "Completed" | "Cancelled";
  dueDate: Date | null;
  subtasks?: Task[];
  sectionId: string;
}

interface TaskCalendarViewProps {
  tasks: Task[];
  onTaskUpdate?: (updatedTask: Task) => void;
}

const TaskCalendarView = ({ tasks, onTaskUpdate = () => {} }: TaskCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getDayTasks = (day: Date) => {
    return tasks.filter((task) => 
      task.dueDate && isSameDay(new Date(task.dueDate), day)
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

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsPreviewOpen(true);
  };

  const handlePanelClose = () => {
    setIsPreviewOpen(false);
    setSelectedTask(null);
  };

  const selectedDayTasks = selectedDate ? getDayTasks(selectedDate) : [];

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
              hasTask: { 
                fontWeight: "bold",
                backgroundColor: "var(--muted)"
              }
            }}
            modifiers={{
              hasTask: (date) => getDayTasks(date).length > 0,
            }}
            components={{
              DayContent: (props) => {
                const dayTasks = getDayTasks(props.date);
                return (
                  <div className="relative">
                    <div>{props.date.getDate()}</div>
                    {dayTasks.length > 0 && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayTasks.length <= 3 ? (
                          Array.from({ length: dayTasks.length }).map((_, i) => (
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
            {selectedDayTasks.length > 0 ? (
              selectedDayTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleTaskClick(task)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {task.title}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {task.category}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={cn(getPriorityColor(task.priority))}
                      >
                        {task.priority}
                      </Badge>
                      <Badge 
                        variant={task.status === "Completed" ? "default" : "outline"}
                        className={task.status === "Completed" ? "bg-green-500" : undefined}
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="border rounded-md h-32 flex items-center justify-center text-muted-foreground">
                No tasks scheduled for this day
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskPreviewPanel
        isOpen={isPreviewOpen}
        onClose={handlePanelClose}
        task={selectedTask}
        onTaskUpdate={onTaskUpdate}
      />
    </>
  );
};

export default TaskCalendarView;
