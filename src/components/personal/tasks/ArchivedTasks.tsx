import React, { useMemo, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ArchiveRestore, Trash2, ChevronDown, ChevronRight, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import ArchivedTaskPanel from "./ArchivedTaskPanel";

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

const dummyTasks: ArchivedTask[] = Array.from({ length: 20 }, (_, i) => ({
  id: `task${i + 1}`,
  title: `Archived Task #${i + 1}`,
  category: i % 2 ? "Personal" : "Work",
  status: (i % 5 === 0 ? "Canceled" : "Completed") as StatusT,
  dueDate: new Date(2025, 2, i + 1),
  completionDate: new Date(2025, 2, i + 2),
  archivedDate: new Date(2025, 2, i + 3),
  assignee: i % 2 === 0 ? "Alex" : "Sam",
  sectionId: "personal",
  archivedBy: i % 2 === 0 ? "Admin" : "System",
  description: `Description for archived task #${i + 1}`,
  linkedRecord: { label: `Record #${i + 1}`, type: "Type", id: `rec${i + 1}` },
  subtasks: [],
})); 

const assigneeList = [
  "John Doe",
  "Emily Davis",
  "Mike Johnson"
];

const categoriesList = [
  "Work", "Personal", "Health", "Meeting", "Opportunity", "Research"
];

const statusList: StatusT[] = ["Completed", "Canceled"];

const rangeOptions = [
  { label: "All time", value: "all" },
  { label: "Last month", value: "last_month" },
  { label: "Last quarter", value: "last_quarter" },
  { label: "Custom", value: "custom" },
];

const getDateRange = (rangeValue: string) => {
  const now = new Date();
  switch (rangeValue) {
    case "last_month":
      return [new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), 0)];
    case "last_quarter":
      const quarter = Math.floor((now.getMonth() - 3) / 3);
      return [new Date(now.getFullYear(), quarter * 3, 1), new Date(now.getFullYear(), quarter * 3 + 2, 30)];
    default:
      return [null, null];
  }
};

const recordTypes = [
  "CRM Contact",
  "Business Contact",
  "EHR Patient"
];

function ArchivedTasks() {
  // State
  const [archivedTasks, setArchivedTasks] = useState<ArchivedTask[]>(dummyTasks);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    archivedRange: "all",
    dueRange: "all",
    category: "all",
    assignee: "all",
    recordType: "all",
    status: "all",
  });
  const [showConfirmRestore, setShowConfirmRestore] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [toConfirmTaskId, setToConfirmTaskId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<ArchivedTask | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // ============ Filtering Logic ============
  const filteredTasks = useMemo(() => {
    let tasks = archivedTasks;
    // Search
    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(keyword) ||
        (t.description && t.description.toLowerCase().includes(keyword)) ||
        (t.category && t.category.toLowerCase().includes(keyword))
      );
    }
    // Category
    if (filters.category !== "all") {
      tasks = tasks.filter(t => t.category === filters.category);
    }
    // Assignee
    if (filters.assignee !== "all") {
      tasks = tasks.filter(t => t.assignee === filters.assignee);
    }
    // Status
    if (filters.status !== "all") {
      tasks = tasks.filter(t => t.status === filters.status);
    }
    // Archived Date Range
    if (filters.archivedRange !== "all") {
      const [start, end] = getDateRange(filters.archivedRange);
      if (start && end) {
        tasks = tasks.filter(t =>
          t.archivedDate >= start && t.archivedDate <= end
        );
      }
    }
    // Due Date Range (simulate like above)
    if (filters.dueRange !== "all") {
      const [start, end] = getDateRange(filters.dueRange);
      if (start && end) {
        tasks = tasks.filter(t =>
          t.dueDate && t.dueDate >= start && t.dueDate <= end
        );
      }
    }
    // Linked Record
    if (filters.recordType !== "all") {
      tasks = tasks.filter(t => t.linkedRecord?.type === filters.recordType);
    }
    return tasks;
  }, [archivedTasks, searchTerm, filters]);

  // ============ Handlers ============
  const handleExpandToggle = (id: string) => {
    setExpandedIds(prev => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };
  const handlePanelOpen = (task: ArchivedTask) => {
    setActiveTask(task);
    setPanelOpen(true);
  };
  const handlePanelClose = () => {
    setPanelOpen(false);
    setActiveTask(null);
  };
  const handleRestoreClick = (id: string) => {
    setShowConfirmRestore(true);
    setToConfirmTaskId(id);
  };
  const confirmRestore = () => {
    // Simulate restore (remove from archive)
    if (toConfirmTaskId) {
      setArchivedTasks(tasks => tasks.filter(t => t.id !== toConfirmTaskId));
      setShowConfirmRestore(false);
      setToConfirmTaskId(null);
      setPanelOpen(false);
    }
  };
  const handleDeleteClick = (id: string) => {
    setShowConfirmDelete(true);
    setToConfirmTaskId(id);
  };
  const confirmDelete = () => {
    if (toConfirmTaskId) {
      setArchivedTasks(tasks => tasks.filter(t => t.id !== toConfirmTaskId));
      setShowConfirmDelete(false);
      setToConfirmTaskId(null);
      setPanelOpen(false);
    }
  };

  // ============ UI ============

  // Row Utility
  const statusBadge = (status: StatusT) =>
    status === "Completed"
      ? <Badge className="bg-green-100 text-green-800">Completed</Badge>
      : <Badge className="bg-orange-100 text-orange-800">Canceled</Badge>;

  function renderTaskRow(task: ArchivedTask, depth = 0) {
    const isExpanded = expandedIds.has(task.id);
    const isCompleted = task.status === "Completed";
    const mainRow = (
      <TableRow key={task.id} className={cn(depth > 0 && "bg-white")}>
        <TableCell className="w-10 px-2 align-middle">
          {/* Expand/collapse only for parent with subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => handleExpandToggle(task.id)}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
            </Button>
          )}
        </TableCell>
        {/* Title: strikethrough if completed */}
        <TableCell className="w-[280px] min-w-[180px]">
          <span
            className={cn("truncate block cursor-pointer", isCompleted ? "line-through text-muted-foreground" : "")}
            title={task.title}
            onClick={() => handlePanelOpen(task)}
          >
            {task.title}
          </span>
          {depth > 0 && <span className="ml-1 py-0.5 text-xs text-gray-400">(Subtask)</span>}
        </TableCell>
        {/* Original Due Date */}
        <TableCell className="text-center">{task.dueDate ? format(task.dueDate, "MMM dd, yyyy") : ""}</TableCell>
        {/* Completion/Archived Date */}
        <TableCell className="text-center">
          {task.completionDate
            ? <span title="Completed Date">{format(task.completionDate, "MMM dd, yyyy")}</span>
            : <span title="Archived Date">{format(task.archivedDate, "MMM dd, yyyy")}</span>
          }
        </TableCell>
        {/* Assignee */}
        <TableCell className="text-center">{task.assignee}</TableCell>
        {/* Category */}
        <TableCell className="text-center">{task.category}</TableCell>
        {/* Linked Record */}
        <TableCell className="text-center">
          {task.linkedRecord && (
            <Badge className="bg-sky-100 text-blue-700">
              {task.linkedRecord.label}
            </Badge>
          )}
        </TableCell>
        {/* Status */}
        <TableCell className="text-center">{statusBadge(task.status)}</TableCell>
        {/* Actions */}
        <TableCell className="w-28 text-center flex gap-1 items-center justify-center">
          <Button size="icon" variant="ghost"
            aria-label="Restore"
            onClick={() => handleRestoreClick(task.id)}
            className="hover:bg-green-50 hover:text-green-700"
          >
            <ArchiveRestore className="h-4 w-4"/>
          </Button>
          <Button size="icon" variant="ghost"
            aria-label="Delete"
            onClick={() => handleDeleteClick(task.id)}
            className="hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4"/>
          </Button>
        </TableCell>
      </TableRow>
    );
    // Subtasks
    return (
      <React.Fragment key={task.id}>
        {mainRow}
        {isExpanded && task.subtasks?.map(sub => renderTaskRow(sub, depth + 1))}
      </React.Fragment>
    );
  }

  // ==== FILTER UI ====

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto animate-fade-in" data-testid="archived-tasks-section">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end mb-4">
        <div className="relative flex-1">
          <Input
            className="pl-9 h-10"
            placeholder="Search archived tasks..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none"/>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4"/>
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-800 mb-1">Category</label>
                  <Select value={filters.category} onValueChange={v => setFilters(f => ({...f, category: v}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {categoriesList.map(cat => <SelectItem value={cat} key={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-800 mb-1">Assignee</label>
                  <Select value={filters.assignee} onValueChange={v => setFilters(f => ({...f, assignee: v}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {assigneeList.map(a => <SelectItem value={a} key={a}>{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-800 mb-1">Status</label>
                  <Select value={filters.status} onValueChange={v => setFilters(f => ({...f, status: v}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {statusList.map(st => <SelectItem value={st} key={st}>{st}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-800 mb-1">Linked Record</label>
                  <Select value={filters.recordType} onValueChange={v => setFilters(f => ({...f, recordType: v}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {recordTypes.map(rt => <SelectItem value={rt} key={rt}>{rt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-800 mb-1">Archived Date</label>
                  <Select value={filters.archivedRange} onValueChange={v => setFilters(f => ({...f, archivedRange: v}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All"/>
                    </SelectTrigger>
                    <SelectContent>
                      {rangeOptions.map(opt =>
                        <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-800 mb-1">Original Due Date</label>
                  <Select value={filters.dueRange} onValueChange={v => setFilters(f => ({...f, dueRange: v}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All"/>
                    </SelectTrigger>
                    <SelectContent>
                      {rangeOptions.map(opt =>
                        <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="overflow-x-auto rounded-lg shadow border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="min-w-[180px]">Title</TableHead>
              <TableHead className="min-w-[120px] text-center">Original Due</TableHead>
              <TableHead className="min-w-[135px] text-center">Completion/Archived</TableHead>
              <TableHead className="min-w-[110px] text-center">Original Assignee</TableHead>
              <TableHead className="min-w-[110px] text-center">Category</TableHead>
              <TableHead className="min-w-[120px] text-center">Linked Record</TableHead>
              <TableHead className="min-w-[100px] text-center">Status</TableHead>
              <TableHead className="w-20 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length
              ? filteredTasks.map(task => renderTaskRow(task, 0))
              : <TableRow>
                  <TableCell colSpan={9}>
                    <div className="text-center text-muted-foreground py-8">No archived tasks found</div>
                  </TableCell>
                </TableRow>
            }
          </TableBody>
        </Table>
      </div>
      {/* Confirm Restore Dialog */}
      <Dialog open={showConfirmRestore} onOpenChange={setShowConfirmRestore}>
        <DialogContent className="max-w-[360px]">
          <DialogHeader>
            <div className="text-lg font-semibold">Restore Task</div>
          </DialogHeader>
          <div>Are you sure you want to restore this task? It will appear as active again.</div>
          <DialogFooter>
            <Button onClick={() => setShowConfirmRestore(false)} variant="outline">Cancel</Button>
            <Button onClick={confirmRestore} variant="default">Restore</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirm Delete Dialog */}
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent className="max-w-[360px]">
          <DialogHeader>
            <div className="text-lg font-semibold">Delete Task Permanently</div>
          </DialogHeader>
          <div>This will erase the archived task permanently.<br/>This action cannot be undone. Continue?</div>
          <DialogFooter>
            <Button onClick={() => setShowConfirmDelete(false)} variant="outline">Cancel</Button>
            <Button onClick={confirmDelete} variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Read-only Task Panel (Sheet) */}
      <Sheet open={panelOpen} onOpenChange={open => !open && handlePanelClose()}>
        {activeTask && (
          <ArchivedTaskPanel
            open={panelOpen}
            task={activeTask}
            onRestore={handleRestoreClick}
            onDelete={handleDeleteClick}
            onClose={() => setPanelOpen(false)}
          />
        )}
      </Sheet>
    </div>
  );
}

export default ArchivedTasks;
