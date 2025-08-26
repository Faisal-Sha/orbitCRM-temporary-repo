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
import GoalsPreviewPanel from "./GoalsPreviewPanel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  isCompleted?: boolean;
  sectionId: string;
}

interface GoalsListViewProps {
  goals: Goal[];
  sections: { id: string; title: string }[];
  onGoalUpdate: (updatedGoal: Goal) => void;
  onGoalToggle: (goalId: string) => void;
  onGoalComplete: (goalId: string) => void;
}

// Category and status color for "To Do" is gray
const grayBadgeClasses = "bg-gray-100 text-gray-800 hover:text-foreground transition-colors";

const GoalsListView = ({
  goals,
  sections,
  onGoalUpdate,
  onGoalToggle,
  onGoalComplete,
}: GoalsListViewProps) => {
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleEditStart = (goal: Goal, field: string) => {
    setEditingGoalId(goal.id);
    setEditingField(field);
    setEditValue(goal[field as keyof Goal]?.toString() || "");
  };

  const handleEditSave = (goal: Goal) => {
    const updatedGoal = { ...goal } as Goal;
    if (editingField && editingField in goal) {
      if (editingField === "status" || editingField === "priority") {
        (updatedGoal[editingField as "status" | "priority"] as any) = editValue;
      } else {
        (updatedGoal as any)[editingField] = editValue;
      }
    }
    onGoalUpdate(updatedGoal);
    setEditingGoalId(null);
    setEditingField(null);
  };

  const handleViewGoal = (goal: Goal) => {
    setSelectedGoal(goal);
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

  // Helper: is submilestone if parent rendering (depth > 0)
  const renderGoalRow = (goal: Goal, depth = 0) => {
    const isCompleted = goal.status === "Completed";
    const isPastDue = goal.dueDate && new Date(goal.dueDate) < new Date() && !isCompleted;
    const isMilestone = depth > 0;

    return (
      <>
        <TableRow
          key={goal.id}
          className={cn(
            "group transition-colors",
            isCompleted && "text-muted-foreground",
            isMilestone ? "bg-white" : "hover:bg-muted/50"
          )}
        >
          {/* Checkbox/toggle */}
          <TableCell className="w-14 p-2 align-middle">
            <div className="flex items-center">
              {!isMilestone && goal.milestones && goal.milestones.length > 0 ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onGoalToggle(goal.id)}
                  className="h-6 w-6"
                >
                  {goal.isExpanded ? (
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
                onCheckedChange={() => onGoalComplete(goal.id)}
                className="ml-1"
              />
            </div>
          </TableCell>

          {/* Title (no more tooltip; ellipsis on both main and milestones, increased width, no tooltip) */}
          <TableCell
            className={cn(
              "align-middle font-medium",
              isCompleted && "line-through",
              "max-w-[370px] min-w-[220px] truncate", // wider
              !isMilestone && "max-w-[370px] w-[370px]"
            )}
            style={{ verticalAlign: "middle" }}
          >
            {editingGoalId === goal.id && editingField === "title" ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleEditSave(goal)}
                onKeyDown={(e) => e.key === "Enter" && handleEditSave(goal)}
                autoFocus
                className="h-8 py-1"
                maxLength={80}
              />
            ) : isMilestone ? (
              <div className="w-[330px] pl-6 flex items-start">
                <span
                  onClick={() => handleEditStart(goal, "title")}
                  className="text-sm font-normal text-muted-foreground truncate cursor-pointer hover:underline block"
                  style={{ maxWidth: 270 }}
                >
                  {goal.title}
                </span>
              </div>
            ) : (
              <div
                onClick={() => handleEditStart(goal, "title")}
                className="group-hover:text-primary transition-colors w-full truncate cursor-pointer max-w-[350px] block"
                style={{ maxWidth: 350 }}
              >
                {goal.title}
              </div>
            )}
          </TableCell>

          {/* Category: always grey, center-aligned */}
          <TableCell className="w-[125px] min-w-[100px] align-middle select-none text-center">
            {editingGoalId === goal.id && editingField === "category" ? (
              <Select
                value={editValue}
                onValueChange={(value) => {
                  setEditValue(value);
                  setEditingGoalId(null);
                  setEditingField(null);
                  onGoalUpdate({ ...goal, category: value });
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
                onClick={() => handleEditStart(goal, "category")}
                className="cursor-pointer w-full flex justify-center"
              >
                <Badge
                  className={cn(
                    grayBadgeClasses,
                    isCompleted && "opacity-60"
                  )}
                >
                  {goal.category}
                </Badge>
              </div>
            )}
          </TableCell>

          {/* Priority: center-aligned */}
          <TableCell className="w-[120px] min-w-[90px] align-middle text-center">
            {editingGoalId === goal.id && editingField === "priority" ? (
              <Select
                value={editValue}
                onValueChange={(value) => {
                  setEditValue(value);
                  setEditingGoalId(null);
                  setEditingField(null);
                  onGoalUpdate({ ...goal, priority: value as Goal["priority"] });
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
                onClick={() => handleEditStart(goal, "priority")}
                className="cursor-pointer w-full flex justify-center"
              >
                <Badge
                  className={cn(
                    goal.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : goal.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800",
                    isCompleted && "opacity-60"
                  )}
                >
                  {goal.priority}
                </Badge>
              </div>
            )}
          </TableCell>

          {/* Status: center-aligned, "Progress" instead of "In Progress" */}
          <TableCell className="w-[120px] min-w-[100px] align-middle text-center">
            {editingGoalId === goal.id && editingField === "status" ? (
              <Select
                value={editValue}
                onValueChange={(value) => {
                  setEditValue(value);
                  setEditingGoalId(null);
                  setEditingField(null);
                  onGoalUpdate({ ...goal, status: value as Goal["status"] });
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
                onClick={() => handleEditStart(goal, "status")}
                className="cursor-pointer w-full flex justify-center"
              >
                <Badge className={cn(getStatusColor(goal.status), isCompleted && "opacity-60")}>
                  {goal.status === "In Progress"
                    ? "Progress"
                    : (goal.status === "Completed" ? <Check className="h-3 w-3 mr-1 inline" /> : null)
                  }
                  {goal.status === "Completed" ? "Completed"
                    : goal.status === "Cancelled" ? (<><X className="h-3 w-3 mr-1 inline" />Cancelled</>)
                    : goal.status !== "In Progress" ? goal.status : null}
                </Badge>
              </div>
            )}
          </TableCell>

          {/* Due Date: center-aligned */}
          <TableCell className="w-[135px] min-w-[110px] align-middle text-center">
            {editingGoalId === goal.id && editingField === "dueDate" ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8">
                    {goal.dueDate ? format(new Date(goal.dueDate), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={goal.dueDate ? new Date(goal.dueDate) : undefined}
                    onSelect={(date) => {
                      setEditingGoalId(null);
                      setEditingField(null);
                      onGoalUpdate({ ...goal, dueDate: date });
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div
                onClick={() => handleEditStart(goal, "dueDate")}
                className={cn(
                  "cursor-pointer",
                  isPastDue && "text-red-500",
                  isCompleted && "text-muted-foreground"
                )}
              >
                {goal.dueDate ? format(new Date(goal.dueDate), "MMM dd, yyyy") : ""}
              </div>
            )}
          </TableCell>

          {/* Actions: MoreVertical button, swap Archive & Delete order, add icons. Center header and actions */}
          <TableCell className={cn(
            "w-[90px] min-w-[48px] align-middle text-center"
          )}>
            {!isMilestone ? (
              <div className="flex justify-center items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => handleViewGoal(goal)}
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
        {goal.milestones && goal.isExpanded &&
          goal.milestones.map(milestone => renderGoalRow(milestone, depth + 1))}
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
            {goals.map(goal => renderGoalRow(goal))}
          </TableBody>
        </Table>
      </div>

      {selectedGoal && (
        <GoalsPreviewPanel
          isOpen={isPreviewOpen}
          onClose={handlePanelClose}
          goal={selectedGoal}
          onGoalUpdate={onGoalUpdate}
        />
      )}
    </>
  );
};

export default GoalsListView;
