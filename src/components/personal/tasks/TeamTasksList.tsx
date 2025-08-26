
import { useMemo } from "react";
import TaskListView from "./TaskListView";

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

interface TeamTasksListProps {
  tasks: Task[];
  sections: { id: string; title: string }[];
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskToggle: (taskId: string) => void;
  onTaskComplete: (taskId: string) => void;
}

const TeamTasksList = ({
  tasks,
  sections,
  onTaskUpdate,
  onTaskToggle,
  onTaskComplete,
}: TeamTasksListProps) => {
  const teamTasks = useMemo(() => {
    return tasks.filter(task => task.sectionId === 'team');
  }, [tasks]);

  return (
    <TaskListView
      tasks={teamTasks}
      sections={sections}
      onTaskUpdate={onTaskUpdate}
      onTaskToggle={onTaskToggle}
      onTaskComplete={onTaskComplete}
    />
  );
};

export default TeamTasksList;
