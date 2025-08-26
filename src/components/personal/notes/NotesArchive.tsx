
import React, { useState, useMemo } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ArchiveRestore, Trash2, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Sheet } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import ArchivedNotePanel from "./ArchivedNotePanel";

// Dummy tags for filtering
const tagsList = ["Work", "Personal", "Meeting", "Research", "Idea"];

// Generate 20 dummy notes for scroll testing (mix of different fields for realism)
const dummyNotesBase = [
  {
    id: "note1",
    title: "Q1 Project Plan",
    content: "Outline project goals, timelines, and responsible team members. Finalize requirements this week...",
    snippet: "Outline project goals, timelines, and responsible team members.",
    createdAt: new Date(2025, 2, 10, 9, 20),
    modifiedAt: new Date(2025, 2, 20, 15, 3),
    archivedAt: new Date(2025, 2, 22, 11, 0),
    tags: ["Work", "Idea"],
    attachments: [{ name: "Plan.pdf", url: "#" }],
    comments: [
      { id: "c1", author: "John", text: "Let's add more details in timeline.", timestamp: new Date(2025, 2, 10, 12, 5) }
    ]
  },
  {
    id: "note2",
    title: "Weekly Reflection",
    content: "This week, I learned about React hooks and improved the user onboarding flow. Still have some doubts about... ",
    snippet: "This week, I learned about React hooks and improved the user onboarding flow.",
    createdAt: new Date(2025, 2, 5, 19, 11),
    modifiedAt: new Date(2025, 2, 7, 14, 0),
    archivedAt: new Date(2025, 2, 8, 9, 30),
    tags: ["Personal"],
    attachments: [],
    comments: []
  },
  {
    id: "note3",
    title: "Partner Meeting Debrief",
    content: "Discussed new partnership opportunities with Stellar LLC. Action items: Compile summary, follow up by Friday.",
    snippet: "Discussed new partnership opportunities with Stellar LLC.",
    createdAt: new Date(2025, 1, 28, 10, 10),
    modifiedAt: new Date(2025, 2, 2, 16, 45),
    archivedAt: new Date(2025, 2, 3, 17, 18),
    tags: ["Work", "Meeting"],
    attachments: [],
    comments: [
      { id: "c2", author: "Emily", text: "Sent follow-up email.", timestamp: new Date(2025, 2, 3, 21, 10) }
    ]
  }
];

// Add more diverse dummy notes for a total of 20
const moreNotes = Array.from({length: 17}, (_, i) => ({
  id: `note${i+4}`,
  title: `Archived Note #${i+4}`,
  content: `This is archived note number ${i+4}. Some content here to test scrolling and list rendering.`,
  snippet: `Snippet of note #${i+4}.`,
  createdAt: new Date(2025, 2, 1 + i, 10),
  modifiedAt: new Date(2025, 2, 2 + i, 12),
  archivedAt: new Date(2025, 2, 3 + i, 13),
  tags: [tagsList[i % tagsList.length]],
  attachments: [],
  comments: [],
}));
const dummyNotes = [...dummyNotesBase, ...moreNotes];

// Helper for date ranges
const rangeOptions = [
  { label: "All time", value: "all" },
  { label: "Last 7 days", value: "last_7" },
  { label: "Last month", value: "last_month" },
  { label: "Custom", value: "custom" }
];

function getDateRange(rangeValue: string) {
  const now = new Date();
  switch (rangeValue) {
    case "last_7":
      return [new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7), now];
    case "last_month":
      return [new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), 0)];
    default:
      return [null, null];
  }
}

const NotesArchive = () => {
  // State
  const [notes, setNotes] = useState(dummyNotes);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    archived: "all",
    created: "all",
    modified: "all",
    tag: "all"
  });
  const [activeNote, setActiveNote] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingNoteId, setPendingNoteId] = useState<string | null>(null);

  // Search and filter logic
  const filteredNotes = useMemo(() => {
    let filtered = [...notes];
    // Search title/content/tags
    if (search.trim()) {
      const keyword = search.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(keyword) ||
        n.content.toLowerCase().includes(keyword) ||
        (n.tags && n.tags.some(tag => tag.toLowerCase().includes(keyword)))
      );
    }
    // Filter by tag
    if (filters.tag !== "all") {
      filtered = filtered.filter(n => n.tags && n.tags.includes(filters.tag));
    }
    // Filter by archived range
    if (filters.archived !== "all") {
      const [start, end] = getDateRange(filters.archived);
      if (start && end)
        filtered = filtered.filter(n => n.archivedAt >= start && n.archivedAt <= end);
    }
    // Filter by created range
    if (filters.created !== "all") {
      const [start, end] = getDateRange(filters.created);
      if (start && end)
        filtered = filtered.filter(n => n.createdAt >= start && n.createdAt <= end);
    }
    // Filter by modified range
    if (filters.modified !== "all") {
      const [start, end] = getDateRange(filters.modified);
      if (start && end)
        filtered = filtered.filter(n => n.modifiedAt >= start && n.modifiedAt <= end);
    }
    return filtered;
  }, [notes, search, filters]);

  // Handlers
  const handleOpenPanel = (note: any) => {
    setActiveNote(note);
    setPanelOpen(true);
  };
  const handleClosePanel = () => {
    setActiveNote(null);
    setPanelOpen(false);
  };
  const handleRestore = (id: string) => {
    setShowRestoreConfirm(true);
    setPendingNoteId(id);
  };
  const confirmRestore = () => {
    setNotes(ns => ns.filter(n => n.id !== pendingNoteId));
    setShowRestoreConfirm(false);
    setPendingNoteId(null);
    setPanelOpen(false);
  };
  const handleDelete = (id: string) => {
    setShowDeleteConfirm(true);
    setPendingNoteId(id);
  };
  const confirmDelete = () => {
    setNotes(ns => ns.filter(n => n.id !== pendingNoteId));
    setShowDeleteConfirm(false);
    setPendingNoteId(null);
    setPanelOpen(false);
  };

  // Row Renderer
  function renderRow(note: any) {
    return (
      <TableRow
        key={note.id}
        className={cn(
          // Match ArchivedTasks.tsx table row hover & background: white, with subtle hover highlight
          "bg-white hover:bg-gray-100 transition cursor-pointer"
        )}
      >
        {/* Title */}
        <TableCell
          className="font-medium w-[240px] underline underline-offset-2 hover:text-primary transition-colors"
          onClick={() => handleOpenPanel(note)}
        >
          {note.title}
        </TableCell>
        {/* Snippet */}
        <TableCell
          className="text-sm text-gray-500 truncate max-w-[200px]"
          onClick={() => handleOpenPanel(note)}
        >
          {note.snippet}
        </TableCell>
        {/* Created */}
        <TableCell className="text-center">{format(note.createdAt, "MMM dd, yyyy")}</TableCell>
        {/* Modified */}
        <TableCell className="text-center">{format(note.modifiedAt, "MMM dd, yyyy")}</TableCell>
        {/* Archived */}
        <TableCell className="text-center text-muted-foreground">{format(note.archivedAt, "MMM dd, yyyy")}</TableCell>
        {/* Tags */}
        <TableCell>
          {note.tags && note.tags.length > 0
            ? note.tags.map((tag: string) => (
                <Badge key={tag} className="bg-gray-200 text-gray-700 mr-1 px-2 py-0.5">{tag}</Badge>
              ))
            : <span className="text-gray-400 text-xs">—</span>}
        </TableCell>
        {/* Actions */}
        <TableCell className="w-[100px] flex gap-1 items-center justify-center">
          <Button
            size="icon"
            variant="ghost"
            onClick={e => { e.stopPropagation(); handleRestore(note.id); }}
            aria-label="Restore"
            className="hover:bg-green-50 hover:text-green-700"
          >
            <ArchiveRestore className="h-4 w-4"/>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={e => { e.stopPropagation(); handleDelete(note.id); }}
            aria-label="Delete"
            className="hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4"/>
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  // ===== UI Render =====
  // DO NOT add scroll or height constraints here: page scroll only!
  return (
    <div className="w-full bg-white rounded-lg border shadow animate-fade-in" data-testid="archived-notes">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end px-6 pt-6">
        <div className="relative flex-1">
          <Input
            className="pl-9 h-10"
            placeholder="Search archived notes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
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
          <PopoverContent className="w-80 z-30">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-800">Tag</label>
                  <Select value={filters.tag} onValueChange={v => setFilters(f => ({ ...f, tag: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {tagsList.map(tag => <SelectItem value={tag} key={tag}>{tag}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-800">Archived Date</label>
                  <Select value={filters.archived} onValueChange={v => setFilters(f => ({ ...f, archived: v }))}>
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
                  <label className="mb-1 block text-xs font-medium text-gray-800">Created Date</label>
                  <Select value={filters.created} onValueChange={v => setFilters(f => ({ ...f, created: v }))}>
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
                  <label className="mb-1 block text-xs font-medium text-gray-800">Last Modified</label>
                  <Select value={filters.modified} onValueChange={v => setFilters(f => ({ ...f, modified: v }))}>
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
      <div className="overflow-x-auto mt-5 rounded-lg border bg-white px-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[240px]">Title</TableHead>
              <TableHead className="min-w-[180px]">Preview</TableHead>
              <TableHead className="min-w-[110px] text-center">Created</TableHead>
              <TableHead className="min-w-[110px] text-center">Last Modified</TableHead>
              <TableHead className="min-w-[110px] text-center">Archived</TableHead>
              <TableHead className="min-w-[120px] text-center">Tags</TableHead>
              <TableHead className="w-[80px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotes.length
              ? filteredNotes.map(renderRow)
              : <TableRow>
                  <TableCell colSpan={7}>
                    <div className="text-center text-muted-foreground py-8">No archived notes found</div>
                  </TableCell>
                </TableRow>
            }
          </TableBody>
        </Table>
      </div>
      {/* Confirm Restore Dialog */}
      <Dialog open={showRestoreConfirm} onOpenChange={setShowRestoreConfirm}>
        <DialogContent className="max-w-[360px]">
          <DialogHeader>
            <div className="text-lg font-semibold">Restore Note</div>
          </DialogHeader>
          <div>This will move the note back to My Notes and make it editable again.</div>
          <DialogFooter>
            <Button onClick={() => setShowRestoreConfirm(false)} variant="outline">Cancel</Button>
            <Button onClick={confirmRestore} variant="default">Restore</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirm Delete Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-[360px]">
          <DialogHeader>
            <div className="text-lg font-semibold">Delete Note Permanently</div>
          </DialogHeader>
          <div>This will erase the archived note permanently.<br/>This action cannot be undone. Continue?</div>
          <DialogFooter>
            <Button onClick={() => setShowDeleteConfirm(false)} variant="outline">Cancel</Button>
            <Button onClick={confirmDelete} variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Note Detail (Sheet) */}
      <Sheet open={panelOpen} onOpenChange={v => !v && handleClosePanel()}>
        {activeNote && (
          <ArchivedNotePanel
            open={panelOpen}
            note={activeNote}
            onRestore={handleRestore}
            onClose={handleClosePanel}
            onDelete={handleDelete}
          />
        )}
      </Sheet>
    </div>
  );
};

export default NotesArchive;
