
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
import { Sheet } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import ArchivedGoalPanel from "./ArchivedGoalsPanel";

type StatusT = "Completed" | "Canceled";
interface ArchivedGoal {
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
  milestones?: ArchivedGoal[];
  isExpanded?: boolean;
}

// Enhanced dummy archived goals data with more comprehensive fields
const dummyArchivedGoals: ArchivedGoal[] = [
  {
    id: "archived-goal-1",
    title: "Launch new product line",
    description: "Successfully launched our premium product line with 15 new items",
    category: "Business",
    status: "Completed",
    dueDate: new Date(2024, 11, 31),
    completionDate: new Date(2024, 11, 28),
    archivedDate: new Date(2025, 0, 5),
    assignee: "Sarah Johnson",
    linkedRecord: { label: "Product Launch Campaign", type: "CRM Contact", id: "campaign-123" },
    sectionId: "goals",
    archivedBy: "John Doe",
    milestones: [
      {
        id: "milestone-1-1",
        title: "Complete market research",
        category: "Research",
        status: "Completed",
        dueDate: new Date(2024, 9, 15),
        completionDate: new Date(2024, 9, 14),
        archivedDate: new Date(2024, 9, 20),
        assignee: "Sarah Johnson",
        sectionId: "goals",
        archivedBy: "John Doe"
      },
      {
        id: "milestone-1-2",
        title: "Design product prototypes",
        category: "Research",
        status: "Completed",
        dueDate: new Date(2024, 10, 15),
        completionDate: new Date(2024, 10, 12),
        archivedDate: new Date(2024, 10, 20),
        assignee: "Sarah Johnson",
        sectionId: "goals",
        archivedBy: "John Doe"
      }
    ]
  },
  {
    id: "archived-goal-2",
    title: "Complete fitness challenge",
    description: "Personal fitness goal - Run 100 miles in 3 months",
    category: "Health",
    status: "Completed",
    dueDate: new Date(2024, 10, 30),
    completionDate: new Date(2024, 10, 25),
    archivedDate: new Date(2024, 11, 1),
    assignee: "Mike Chen",
    linkedRecord: { label: "Health Tracker", type: "Business Contact", id: "health-456" },
    sectionId: "goals",
    archivedBy: "Mike Chen"
  },
  {
    id: "archived-goal-3",
    title: "Learn Spanish fluency",
    description: "Achieve conversational Spanish proficiency",
    category: "Personal",
    status: "Canceled",
    dueDate: new Date(2024, 11, 31),
    completionDate: null,
    archivedDate: new Date(2025, 0, 3),
    assignee: "Lisa Wong",
    sectionId: "goals",
    archivedBy: "Lisa Wong"
  },
  {
    id: "archived-goal-4",
    title: "Quarterly team meeting preparation",
    description: "Prepare comprehensive quarterly review materials",
    category: "Work",
    status: "Completed",
    dueDate: new Date(2024, 11, 15),
    completionDate: new Date(2024, 11, 14),
    archivedDate: new Date(2024, 11, 20),
    assignee: "Emily Davis",
    linkedRecord: { label: "Q4 Review", type: "EHR Patient", id: "review-789" },
    sectionId: "goals",
    archivedBy: "Admin"
  },
  {
    id: "archived-goal-5",
    title: "Home office organization",
    description: "Complete reorganization of home workspace",
    category: "Personal",
    status: "Completed",
    dueDate: new Date(2024, 9, 30),
    completionDate: new Date(2024, 9, 28),
    archivedDate: new Date(2024, 10, 5),
    assignee: "John Doe",
    sectionId: "goals",
    archivedBy: "System"
  }
];

const assigneeList = [
  "Sarah Johnson",
  "Mike Chen", 
  "Lisa Wong",
  "Emily Davis",
  "John Doe"
];

const categoriesList = [
  "Business", "Health", "Personal", "Work", "Research", "Education"
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

const ArchivedGoals = () => {
  // State
  const [archivedGoals, setArchivedGoals] = useState<ArchivedGoal[]>(dummyArchivedGoals);
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
  const [toConfirmGoalId, setToConfirmGoalId] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<ArchivedGoal | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // ============ Filtering Logic ============
  const filteredGoals = useMemo(() => {
    let goals = archivedGoals;
    // Search
    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase();
      goals = goals.filter(g =>
        g.title.toLowerCase().includes(keyword) ||
        (g.description && g.description.toLowerCase().includes(keyword)) ||
        (g.category && g.category.toLowerCase().includes(keyword))
      );
    }
    // Category
    if (filters.category !== "all") {
      goals = goals.filter(g => g.category === filters.category);
    }
    // Assignee
    if (filters.assignee !== "all") {
      goals = goals.filter(g => g.assignee === filters.assignee);
    }
    // Status
    if (filters.status !== "all") {
      goals = goals.filter(g => g.status === filters.status);
    }
    // Archived Date Range
    if (filters.archivedRange !== "all") {
      const [start, end] = getDateRange(filters.archivedRange);
      if (start && end) {
        goals = goals.filter(g =>
          g.archivedDate >= start && g.archivedDate <= end
        );
      }
    }
    // Due Date Range
    if (filters.dueRange !== "all") {
      const [start, end] = getDateRange(filters.dueRange);
      if (start && end) {
        goals = goals.filter(g =>
          g.dueDate && g.dueDate >= start && g.dueDate <= end
        );
      }
    }
    // Linked Record
    if (filters.recordType !== "all") {
      goals = goals.filter(g => g.linkedRecord?.type === filters.recordType);
    }
    return goals;
  }, [archivedGoals, searchTerm, filters]);

  // ============ Handlers ============
  const handleExpandToggle = (id: string) => {
    setExpandedIds(prev => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const handleViewGoal = (goal: ArchivedGoal) => {
    setSelectedGoal(goal);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedGoal(null);
  };

  const handleRestoreClick = (id: string) => {
    setShowConfirmRestore(true);
    setToConfirmGoalId(id);
  };

  const confirmRestore = () => {
    // Simulate restore (remove from archive)
    if (toConfirmGoalId) {
      setArchivedGoals(goals => goals.filter(g => g.id !== toConfirmGoalId));
      setShowConfirmRestore(false);
      setToConfirmGoalId(null);
      setIsSheetOpen(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setShowConfirmDelete(true);
    setToConfirmGoalId(id);
  };

  const confirmDelete = () => {
    if (toConfirmGoalId) {
      setArchivedGoals(goals => goals.filter(g => g.id !== toConfirmGoalId));
      setShowConfirmDelete(false);
      setToConfirmGoalId(null);
      setIsSheetOpen(false);
    }
  };

  // ============ UI ============

  // Row Utility
  const statusBadge = (status: StatusT) =>
    status === "Completed"
      ? <Badge className="bg-green-100 text-green-800">Completed</Badge>
      : <Badge className="bg-orange-100 text-orange-800">Canceled</Badge>;

  function renderGoalRow(goal: ArchivedGoal, depth = 0) {
    const isExpanded = expandedIds.has(goal.id);
    const isCompleted = goal.status === "Completed";
    const mainRow = (
      <TableRow key={goal.id} className={cn(depth > 0 && "bg-white")}>
        <TableCell className="w-10 px-2 align-middle">
          {/* Expand/collapse only for parent with milestones */}
          {goal.milestones && goal.milestones.length > 0 && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => handleExpandToggle(goal.id)}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
            </Button>
          )}
        </TableCell>
        {/* Title: strikethrough if completed */}
        <TableCell className="w-[280px] min-w-[180px]">
          <span
            className={cn("truncate block cursor-pointer", isCompleted ? "line-through text-muted-foreground" : "")}
            title={goal.title}
            onClick={() => handleViewGoal(goal)}
          >
            {goal.title}
          </span>
          {depth > 0 && <span className="ml-1 py-0.5 text-xs text-gray-400">(Milestone)</span>}
        </TableCell>
        {/* Original Due Date */}
        <TableCell className="text-center">{goal.dueDate ? format(goal.dueDate, "MMM dd, yyyy") : ""}</TableCell>
        {/* Completion/Archived Date */}
        <TableCell className="text-center">
          {goal.completionDate
            ? <span title="Completed Date">{format(goal.completionDate, "MMM dd, yyyy")}</span>
            : <span title="Archived Date">{format(goal.archivedDate, "MMM dd, yyyy")}</span>
          }
        </TableCell>
        {/* Assignee */}
        <TableCell className="text-center">{goal.assignee}</TableCell>
        {/* Category */}
        <TableCell className="text-center">{goal.category}</TableCell>
        {/* Linked Record */}
        <TableCell className="text-center">
          {goal.linkedRecord && (
            <Badge className="bg-sky-100 text-blue-700">
              {goal.linkedRecord.label}
            </Badge>
          )}
        </TableCell>
        {/* Status */}
        <TableCell className="text-center">{statusBadge(goal.status)}</TableCell>
        {/* Actions */}
        <TableCell className="w-28 text-center flex gap-1 items-center justify-center">
          <Button size="icon" variant="ghost"
            aria-label="Restore"
            onClick={() => handleRestoreClick(goal.id)}
            className="hover:bg-green-50 hover:text-green-700"
          >
            <ArchiveRestore className="h-4 w-4"/>
          </Button>
          <Button size="icon" variant="ghost"
            aria-label="Delete"
            onClick={() => handleDeleteClick(goal.id)}
            className="hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4"/>
          </Button>
        </TableCell>
      </TableRow>
    );
    // Milestones
    return (
      <React.Fragment key={goal.id}>
        {mainRow}
        {isExpanded && goal.milestones?.map(milestone => renderGoalRow(milestone, depth + 1))}
      </React.Fragment>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto animate-fade-in" data-testid="archived-goals-section">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Archived Goals</h2>
          <p className="text-muted-foreground mt-1">View and manage your archived goals</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-end mb-4">
        <div className="relative flex-1">
          <Input
            className="pl-9 h-10"
            placeholder="Search archived goals..."
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
            {filteredGoals.length
              ? filteredGoals.map(goal => renderGoalRow(goal, 0))
              : <TableRow>
                  <TableCell colSpan={9}>
                    <div className="text-center text-muted-foreground py-8">No archived goals found</div>
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
            <div className="text-lg font-semibold">Restore Goal</div>
          </DialogHeader>
          <div>Are you sure you want to restore this goal? It will appear as active again.</div>
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
            <div className="text-lg font-semibold">Delete Goal Permanently</div>
          </DialogHeader>
          <div>This will erase the archived goal permanently.<br/>This action cannot be undone. Continue?</div>
          <DialogFooter>
            <Button onClick={() => setShowConfirmDelete(false)} variant="outline">Cancel</Button>
            <Button onClick={confirmDelete} variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Read-only Goal Panel (Sheet) */}
      <Sheet open={isSheetOpen} onOpenChange={open => !open && handleCloseSheet()}>
        {selectedGoal && (
          <ArchivedGoalPanel
            open={isSheetOpen}
            goal={selectedGoal}
            onRestore={handleRestoreClick}
            onDelete={handleDeleteClick}
            onClose={() => setIsSheetOpen(false)}
          />
        )}
      </Sheet>
    </div>
  );
};

export default ArchivedGoals;
