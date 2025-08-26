
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArchiveRestore, Trash2, Badge } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Replicate types for props (could be imported if used elsewhere)
type StatusT = "Completed" | "Canceled";
interface ArchivedTask {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: StatusT;
  dueDate: Date | null;
  completionDate: Date | null;
  archivedDate: Date;
  assignee: string;
  linkedRecord?: { label: string; type: string; id: string };
  sectionId: string;
  archivedBy: string;
  subtasks?: ArchivedTask[];
  isExpanded?: boolean;
}

interface ArchivedTaskPanelProps {
  task: ArchivedTask;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  open: boolean;
}

const ArchivedTaskPanel: React.FC<ArchivedTaskPanelProps> = ({
  task,
  onRestore,
  onDelete,
  onClose,
  open
}) => {
  if (!task) return null;
  return (
    <SheetContent 
      className="w-[50%] sm:max-w-none p-0 border-l animate-slide-in-right" 
      side="right"
    >
      <ScrollArea className="h-full w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-bold text-xl">{task.title}</h3>
            <span className={cn(
              "px-2 py-1 text-sm rounded",
              task.status === "Completed"
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            )}>
              {task.status}
            </span>
          </div>
          <div className="mb-2 text-base text-gray-700">{task.description}</div>
          <Separator className="my-3"/>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="font-semibold">Category:</span> {task.category}</div>
            <div><span className="font-semibold">Assignee:</span> {task.assignee}</div>
            <div>
              <span className="font-semibold">Original Due Date:</span>{" "}
              {task.dueDate ? format(task.dueDate, "MMM dd, yyyy") : "—"}
            </div>
            <div>
              <span className="font-semibold">Completed:</span>{" "}
              {task.completionDate
                ? format(task.completionDate, "MMM dd, yyyy")
                : "—"}
            </div>
            <div>
              <span className="font-semibold">Archived:</span>{" "}
              {format(task.archivedDate, "MMM dd, yyyy")}
            </div>
            <div><span className="font-semibold">Archived by:</span> {task.archivedBy}</div>
            <div>
              <span className="font-semibold">Linked Record:</span>{" "}
              {task.linkedRecord
                ? <span className="bg-sky-100 text-blue-700 px-2 py-1 rounded">{task.linkedRecord.label}</span>
                : "—"}
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span className={cn(
                "px-2 py-1 rounded text-sm",
                task.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              )}>
                {task.status}
              </span>
            </div>
          </div>
          {task.subtasks?.length
            ? (
              <>
                <h4 className="font-semibold mt-5 mb-2 text-base">Subtasks:</h4>
                <ul className="list-disc ml-5">
                  {task.subtasks.map(sub =>
                    <li key={sub.id} className={cn("py-1", sub.status === "Completed" ? "line-through text-muted-foreground" : "")}>
                      {sub.title} — <span className="italic">{sub.status}</span>
                    </li>
                  )}
                </ul>
              </>
            )
            : null}
          <Separator className="my-3"/>
          <div className="flex justify-between mt-6 gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => onRestore(task.id)}
            >
              <ArchiveRestore className="h-4 w-4 mr-2" />
              Unarchive/Restore
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </ScrollArea>
    </SheetContent>
  )
};

export default ArchivedTaskPanel;

