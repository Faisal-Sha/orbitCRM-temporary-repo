import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Trash, Plus, User, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface TaskDetailsFormProps {
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void;
}

const dummyTeamMembers = [
  { id: "user-1", name: "John Doe", avatar: "", initials: "JD" },
  { id: "user-2", name: "Sarah Smith", avatar: "", initials: "SS" },
  { id: "user-3", name: "Mike Johnson", avatar: "", initials: "MJ" },
  { id: "user-4", name: "Emily Davis", avatar: "", initials: "ED" }
];

const dummyCreator = { id: "user-1", name: "John Doe", avatar: "", initials: "JD" };

const sectionIdToType = (sectionId: string) =>
  sectionId === "personal" ? "personal"
    : sectionId === "team" ? "team"
    : sectionId === "goals" ? "goals"
    : "";

const TaskDetailsForm: React.FC<TaskDetailsFormProps> = ({
  task,
  onTaskUpdate
}) => {
  // Controlled dummy team assignment. Initialize depending on section.
  const initialAssigned = sectionIdToType(task.sectionId) === "team"
    ? dummyTeamMembers.slice(0, 2)
    : [];

  const [assignedMembers, setAssignedMembers] = useState(
    initialAssigned
  );

  const [showMemberSelect, setShowMemberSelect] = useState(false);

  // Team member assignment: Add button now shows menu of available members to assign (for visual UI only)
  const availableMembers = dummyTeamMembers.filter(
    (m) => !assignedMembers.find(am => am.id === m.id)
  );

  const handleAddMember = () => {
    setShowMemberSelect(true);
  };

  const selectDummyMember = (id: string) => {
    const member = dummyTeamMembers.find((m) => m.id === id);
    if (member) {
      setAssignedMembers([...assignedMembers, member]);
      setShowMemberSelect(false);
    }
  };

  const handleRemoveMember = (id: string) => {
    setAssignedMembers(assignedMembers.filter((m) => m.id !== id));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTaskUpdate({
      ...task,
      title: e.target.value
    });
  };

  const handleCategoryChange = (value: string) => {
    onTaskUpdate({
      ...task,
      category: value
    });
  };

  const handlePriorityChange = (value: string) => {
    onTaskUpdate({
      ...task,
      priority: value as Task["priority"]
    });
  };

  const handleStatusChange = (value: string) => {
    onTaskUpdate({
      ...task,
      status: value as Task["status"]
    });
  };

  const handleDueDateChange = (date: Date | undefined) => {
    onTaskUpdate({
      ...task,
      dueDate: date || null
    });
  };

  const handleAddSubtask = () => {
    const subtasks = task.subtasks || [];
    const newSubtask: Task = {
      id: `subtask-${Date.now()}`,
      title: "New Subtask",
      category: task.category,
      priority: "Medium",
      status: "To Do",
      dueDate: null,
      sectionId: task.sectionId
    };

    onTaskUpdate({
      ...task,
      subtasks: [...subtasks, newSubtask]
    });
  };

  const handleSubtaskUpdate = (updatedSubtask: Task) => {
    if (!task.subtasks) return;

    onTaskUpdate({
      ...task,
      subtasks: task.subtasks.map(subtask =>
        subtask.id === updatedSubtask.id ? updatedSubtask : subtask
      )
    });
  };

  const handleSubtaskDelete = (subtaskId: string) => {
    if (!task.subtasks) return;

    onTaskUpdate({
      ...task,
      subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
    });
  };

  // Don't show Team Members section for "Goals"
  const sectionType = sectionIdToType(task.sectionId);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Task Title
        </label>
        <Input
          id="title"
          value={task.title}
          onChange={handleTitleChange}
          className="w-full"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          placeholder="Add a task description..."
          className="min-h-[100px]"
        />
      </div>

      {/* Two column layout for task details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          {/* Created By */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Created By
            </label>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={dummyCreator.avatar} />
                <AvatarFallback>{dummyCreator.initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{dummyCreator.name}</span>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <Select defaultValue={task.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Opportunity">Opportunity</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <Select defaultValue={task.priority} onValueChange={handlePriorityChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">
                  <Badge className="bg-red-100 text-red-800 border-none mr-2">High</Badge>
                  High
                </SelectItem>
                <SelectItem value="Medium">
                  <Badge className="bg-yellow-100 text-yellow-800 border-none mr-2">Medium</Badge>
                  Medium
                </SelectItem>
                <SelectItem value="Low">
                  <Badge className="bg-green-100 text-green-800 border-none mr-2">Low</Badge>
                  Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Column 2 */}
        <div className="space-y-6">
          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <Select defaultValue={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !task.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {task.dueDate ? format(task.dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={task.dueDate || undefined}
                  onSelect={handleDueDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Assigned Team Members (dummy UI + menu for Add) */}
          {sectionType !== "goals" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Assigned Team Members
              </label>
              <div className="flex gap-2 flex-wrap relative">
                {assignedMembers.map(user => (
                  <div key={user.id} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs mr-1">{user.name}</span>
                    <button
                      type="button"
                      className="ml-1 text-gray-400 hover:text-red-500 rounded-full"
                      onClick={() => handleRemoveMember(user.id)}
                      tabIndex={0}
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {assignedMembers.length < dummyTeamMembers.length && (
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 rounded-full px-2 flex items-center"
                      onClick={handleAddMember}
                    >
                      <User className="h-3 w-3 mr-1" />
                      <span className="text-xs">Add</span>
                    </Button>
                    {showMemberSelect && (
                      <div className="absolute z-10 mt-2 w-36 bg-white border rounded shadow-lg">
                        {availableMembers.map(m => (
                          <button
                            key={m.id}
                            className="w-full text-left px-3 py-2 hover:bg-muted block text-xs"
                            onClick={() => selectDummyMember(m.id)}
                            type="button"
                          >
                            {m.name}
                          </button>
                        ))}
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-muted block text-xs text-gray-500"
                          onClick={() => setShowMemberSelect(false)}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtasks */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Subtasks
          </label>
          <Button variant="outline" size="sm" onClick={handleAddSubtask}>
            <Plus className="h-3 w-3 mr-1" />
            Add Subtask
          </Button>
        </div>
        {task.subtasks && task.subtasks.length > 0 ? (
          <div className="space-y-3 border rounded-md p-3">
            {task.subtasks.map(subtask => (
              <div key={subtask.id} className="flex items-center gap-2">
                <Badge className={cn(
                  "flex-shrink-0 w-2 h-2 p-0 rounded-full",
                  subtask.status === "Completed" ? "bg-green-500" :
                  subtask.status === "In Progress" ? "bg-blue-500" :
                  subtask.status === "Blocked" ? "bg-red-500" : "bg-gray-300"
                )} />
                <Input
                  value={subtask.title}
                  onChange={(e) => handleSubtaskUpdate({ ...subtask, title: e.target.value })}
                  className="flex-1"
                />
                <Select
                  defaultValue={subtask.status}
                  onValueChange={(value) => handleSubtaskUpdate({ ...subtask, status: value as Task["status"] })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSubtaskDelete(subtask.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">No subtasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsForm;
