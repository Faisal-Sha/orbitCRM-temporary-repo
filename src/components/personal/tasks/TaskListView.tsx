import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Calendar, Check, ChevronDown, ChevronRight, Filter, LayoutList, Loader, MoreVertical, X, Archive, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import TaskPreviewPanel from "./TaskPreviewPanel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  isCompleted?: boolean;
  sectionId: string;
}

interface TaskListViewProps {
  tasks: Task[];
  sections: { id: string; title: string }[];
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskToggle: (taskId: string) => void;
  onTaskComplete: (taskId: string) => void;
}

// Category and status color for "To Do" is gray
const grayBadgeClasses = "bg-gray-100 text-gray-800 hover:text-foreground transition-colors";

const TaskListView = ({
  tasks,
  sections,
  onTaskUpdate,
  onTaskToggle,
  onTaskComplete,
}: TaskListViewProps) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleEditStart = (task: Task, field: string) => {
    setEditingTaskId(task.id);
    setEditingField(field);
    setEditValue(task[field as keyof Task]?.toString() || "");
  };

  const handleEditSave = (task: Task) => {
    const updatedTask = { ...task } as Task;
    if (editingField && editingField in task) {
      if (editingField === "status" || editingField === "priority") {
        (updatedTask[editingField as "status" | "priority"] as any) = editValue;
      } else {
        (updatedTask as any)[editingField] = editValue;
      }
    }
    onTaskUpdate(updatedTask);
    setEditingTaskId(null);
    setEditingField(null);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsPreviewOpen(true);
  };

  const handlePanelClose = () => {
    setIsPreviewOpen(false);
  };

  const getStatusColor = (status: string) => {
    // Always To Do for gray (match requirements)
    return status === "To Do"
      ? "bg-gray-100 text-gray-800"
      : status === "In Progress"
      ? "bg-blue-100 text-blue-800"
      : status === "Blocked"
      ? "bg-red-100 text-red-800"
      : status === "Completed"
      ? "bg-green-100 text-green-800"
      : status === "Cancelled"
      ? "bg-orange-100 text-orange-800"
      : "bg-gray-100 text-gray-800";
  };

  // Helper: is subtask if parent rendering (depth > 0)
  const renderTaskRow = (task: Task, depth = 0) => {
    const isCompleted = task.status === "Completed";
    const isPastDue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;
    const isSubtask = depth > 0;

    return (
      <>
        <TableRow
          key={task.id}
          className={cn(
            "group transition-colors",
            isCompleted && "text-muted-foreground",
            isSubtask ? "bg-white" : "hover:bg-muted/50"
          )}
        >
          {/* Checkbox/toggle */}
          <TableCell className="w-14 p-2 align-middle">
            <div className="flex items-center">
              {!isSubtask && task.subtasks && task.subtasks.length > 0 ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onTaskToggle(task.id)}
                  className="h-6 w-6"
                >
                  {task.isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <div className="w-6"></div>
              )}
              <Checkbox
                checked={isCompleted}
                onCheckedChange={() => onTaskComplete(task.id)}
                className="ml-1"
              />
            </div>
          </TableCell>

          {/* Title (no more tooltip; ellipsis on both main and subtasks, increased width, no tooltip) */}
          <TableCell
            className={cn(
              "align-middle font-medium",
              isCompleted && "line-through",
              "max-w-[370px] min-w-[220px] truncate", // wider
              !isSubtask && "max-w-[370px] w-[370px]"
            )}
            style={{ verticalAlign: "middle" }}
          >
            {editingTaskId === task.id && editingField === "title" ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleEditSave(task)}
                onKeyDown={(e) => e.key === "Enter" && handleEditSave(task)}
                autoFocus
                className="h-8 py-1"
                maxLength={80}
              />
            ) : isSubtask ? (
              <div className="w-[330px] pl-6 flex items-start">
                <span
                  onClick={() => handleEditStart(task, "title")}
                  className="text-sm font-normal text-muted-foreground truncate cursor-pointer hover:underline block"
                  style={{ maxWidth: 270 }}
                >
                  {task.title}
                </span>
              </div>
            ) : (
              <div
                onClick={() => handleEditStart(task, "title")}
                className="group-hover:text-primary transition-colors w-full truncate cursor-pointer max-w-[350px] block"
                style={{ maxWidth: 350 }}
              >
                {task.title}
              </div>
            )}
          </TableCell>

          {/* Category: always grey, center-aligned */}
          <TableCell className="w-[125px] min-w-[100px] align-middle select-none text-center">
            {editingTaskId === task.id && editingField === "category" ? (
              <Select
                value={editValue}
                onValueChange={(value) => {
                  setEditValue(value);
                  setEditingTaskId(null);
                  setEditingField(null);
                  onTaskUpdate({ ...task, category: value });
                }}
                defaultOpen
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Work", "Personal", "Health", "Meeting", "Opportunity", "Research"].map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div
                onClick={() => handleEditStart(task, "category")}
                className="cursor-pointer w-full flex justify-center"
              >
                <Badge
                  className={cn(
                    grayBadgeClasses,
                    isCompleted && "opacity-60"
                  )}
                >
                  {task.category}
                </Badge>
              </div>
            )}
          </TableCell>

          {/* Priority: center-aligned */}
          <TableCell className="w-[120px] min-w-[90px] align-middle text-center">
            {editingTaskId === task.id && editingField === "priority" ? (
              <Select
                value={editValue}
                onValueChange={(value) => {
                  setEditValue(value);
                  setEditingTaskId(null);
                  setEditingField(null);
                  onTaskUpdate({ ...task, priority: value as Task["priority"] });
                }}
                defaultOpen
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["High", "Medium", "Low"].map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div
                onClick={() => handleEditStart(task, "priority")}
                className="cursor-pointer w-full flex justify-center"
              >
                <Badge
                  className={cn(
                    task.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800",
                    isCompleted && "opacity-60"
                  )}
                >
                  {task.priority}
                </Badge>
              </div>
            )}
          </TableCell>

          {/* Status: center-aligned, "Progress" instead of "In Progress" */}
          <TableCell className="w-[120px] min-w-[100px] align-middle text-center">
            {editingTaskId === task.id && editingField === "status" ? (
              <Select
                value={editValue}
                onValueChange={(value) => {
                  setEditValue(value);
                  setEditingTaskId(null);
                  setEditingField(null);
                  onTaskUpdate({ ...task, status: value as Task["status"] });
                }}
                defaultOpen
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* "Progress" replaces "In Progress" (but value must remain the same) */}
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">Progress</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div
                onClick={() => handleEditStart(task, "status")}
                className="cursor-pointer w-full flex justify-center"
              >
                <Badge className={cn(getStatusColor(task.status), isCompleted && "opacity-60")}>
                  {task.status === "In Progress"
                    ? "Progress"
                    : (task.status === "Completed" ? <Check className="h-3 w-3 mr-1 inline" /> : null)
                  }
                  {task.status === "Completed" ? "Completed"
                    : task.status === "Cancelled" ? (<><X className="h-3 w-3 mr-1 inline" />Cancelled</>)
                    : task.status !== "In Progress" ? task.status : null}
                </Badge>
              </div>
            )}
          </TableCell>

          {/* Due Date: center-aligned */}
          <TableCell className="w-[135px] min-w-[110px] align-middle text-center">
            {editingTaskId === task.id && editingField === "dueDate" ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8">
                    {task.dueDate ? format(new Date(task.dueDate), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={task.dueDate ? new Date(task.dueDate) : undefined}
                    onSelect={(date) => {
                      setEditingTaskId(null);
                      setEditingField(null);
                      onTaskUpdate({ ...task, dueDate: date });
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div
                onClick={() => handleEditStart(task, "dueDate")}
                className={cn(
                  "cursor-pointer",
                  isPastDue && "text-red-500",
                  isCompleted && "text-muted-foreground"
                )}
              >
                {task.dueDate ? format(new Date(task.dueDate), "MMM dd, yyyy") : ""}
              </div>
            )}
          </TableCell>

          {/* Actions: MoreVertical button, swap Archive & Delete order, add icons. Center header and actions */}
          <TableCell className={cn(
            "w-[90px] min-w-[48px] align-middle text-center"
          )}>
            {!isSubtask ? (
              <div className="flex justify-center items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => handleViewTask(task)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
              </div>
            ) : (
              <div />
            )}
          </TableCell>
        </TableRow>
        {task.subtasks && task.isExpanded &&
          task.subtasks.map(subtask => renderTaskRow(subtask, depth + 1))}
      </>
    );
  };

  return (
    <>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14 text-center"></TableHead>
              <TableHead className="w-[370px] min-w-[220px]">Title</TableHead>
              <TableHead className="w-[125px] min-w-[100px] text-center">Category</TableHead>
              <TableHead className="w-[120px] min-w-[90px] text-center">Priority</TableHead>
              <TableHead className="w-[120px] min-w-[100px] text-center">Status</TableHead>
              <TableHead className="w-[135px] min-w-[110px] text-center">Due Date</TableHead>
              <TableHead className="w-[90px] min-w-[48px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map(task => renderTaskRow(task))}
          </TableBody>
        </Table>
      </div>

      {selectedTask && (
        <TaskPreviewPanel
          isOpen={isPreviewOpen}
          onClose={handlePanelClose}
          task={selectedTask}
          onTaskUpdate={onTaskUpdate}
        />
      )}
    </>
  );
};

export default TaskListView;
