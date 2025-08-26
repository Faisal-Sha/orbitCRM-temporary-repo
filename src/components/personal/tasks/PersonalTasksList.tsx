
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

interface PersonalTasksListProps {
  tasks: Task[];
  sections: { id: string; title: string }[];
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskToggle: (taskId: string) => void;
  onTaskComplete: (taskId: string) => void;
}

const PersonalTasksList = ({
  tasks,
  sections,
  onTaskUpdate,
  onTaskToggle,
  onTaskComplete,
}: PersonalTasksListProps) => {
  const personalTasks = useMemo(() => {
    return tasks.filter(task => task.sectionId === 'personal');
  }, [tasks]);

  return (
    <TaskListView
      tasks={personalTasks}
      sections={sections}
      onTaskUpdate={onTaskUpdate}
      onTaskToggle={onTaskToggle}
      onTaskComplete={onTaskComplete}
    />
  );
};

export default PersonalTasksList;
