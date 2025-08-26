
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Star as StarFilled, Tag, Edit, Archive, Trash2, FileText, CopyCheck, Image, Folder, ListOrdered, List, Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3, Copy } from "lucide-react";

// Dummy data
const folders = [
  { id: 1, name: "Work" },
  { id: 2, name: "Ideas" },
  { id: 3, name: "Personal" },
];

const initialDummyNotes = [
  {
    id: 101,
    title: "Onboarding Protocol Draft",
    content: "This is a <b>draft</b> onboarding protocol for new team members.",
    tags: ["Work", "Onboarding"],
    folderId: 1,
    pinned: true,
    date: "2025-05-12",
  },
  {
    id: 102,
    title: "Personal Reflection",
    content: "Reflections on Q2 progress and <i>personal goals</i>.",
    tags: ["Personal", "Reflection"],
    folderId: 3,
    pinned: false,
    date: "2025-05-10",
  },
  {
    id: 103,
    title: "Marketing Ideas",
    content: "1. Launch spring campaign<br>2. Run a giveaway<br>3. <u>Contact influencers</u> for collab.",
    tags: ["Ideas"],
    folderId: 2,
    pinned: true,
    date: "2025-05-07",
  }
];

const availableTags = [
  "Work", "Ideas", "Personal", "Reflection", "Tech", "Urgent"
];

function formatContent(content: string) {
  // Show HTML as rich text dummy (no XSS concern with controlled dummy UI)
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

const EditorToolbar = ({ onCommand }: { onCommand: (cmd: string) => void }) => (
  <div className="flex gap-2 border-b pb-2 mb-2">
    <Button size="icon" variant="ghost" type="button" onClick={() => onCommand("bold")} aria-label="Bold"><Bold /></Button>
    <Button size="icon" variant="ghost" type="button" onClick={() => onCommand("italic")} aria-label="Italic"><Italic /></Button>
    <Button size="icon" variant="ghost" type="button" onClick={() => onCommand("underline")} aria-label="Underline"><Underline /></Button>
    <Button size="icon" variant="ghost" type="button" onClick={() => onCommand("strike")} aria-label="Strikethrough"><Strikethrough /></Button>
    <Button size="icon" variant="ghost" type="button" onClick={() => onCommand("heading1")} aria-label="Heading 1"><Heading1 /></Button>
    <Button size="icon" variant="ghost" type="button" onClick={() => onCommand("heading2")} aria-label="Heading 2"><Heading2 /></Button>
    <Button size="icon" variant="ghost" type="button" onClick={() => onCommand("heading3")} aria-label="Heading 3"><Heading3 /></Button>
    <Button size="icon" variant="ghost" type="button" onClick={() => onCommand("ul")} aria-label="Bulleted List"><List /></Button>
    <Button size="icon" variant="ghost" type="button" onClick={() => onCommand("ol")} aria-label="Numbered List"><ListOrdered /></Button>
    <Button size="icon" variant="ghost" type="button" onClick={() => onCommand("image")} aria-label="Image"><Image /></Button>
    <Button size="icon" variant="ghost" type="button" onClick={() => onCommand("attach")} aria-label="Attach File"><FileText /></Button>
    {/* Add color swatches, font size, etc. if desired */}
  </div>
);

const PersonalNotes: React.FC = () => {
  // Use local state for notes so edits are visually reflected
  const [notes, setNotes] = useState(initialDummyNotes);
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editNoteId, setEditNoteId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [pinnedOnly, setPinnedOnly] = useState(false);

  const openEditor = (note?: typeof initialDummyNotes[0]) => {
    if (note) {
      setEditNoteId(note.id);
      setNewTitle(note.title);
      setNewContent(note.content);
      setEditorTags(note.tags);
    } else {
      setEditNoteId(null);
      setNewTitle("");
      setNewContent("");
      setEditorTags([]);
    }
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditNoteId(null);
    setNewTitle("");
    setNewContent("");
    setEditorTags([]);
  };

  // Add or update the note in local dummy state for demo purposes
  const handleSaveNote = () => {
    if (!newTitle.trim()) {
      // Could toast/alert for required field
      return;
    }
    if (editNoteId != null) {
      // Update existing note
      setNotes(notes =>
        notes.map(note =>
          note.id === editNoteId
            ? { ...note, title: newTitle, content: newContent, tags: editorTags }
            : note
        )
      );
    } else {
      // Add new note
      const maxId = notes.length ? Math.max(...notes.map(n => n.id)) : 100;
      setNotes([
        {
          id: maxId + 1,
          title: newTitle,
          content: newContent,
          tags: editorTags,
          folderId: 1,
          pinned: false,
          date: new Date().toISOString().slice(0, 10),
        },
        ...notes,
      ]);
    }
    closeEditor();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(tags =>
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  };

  // Separate editor tags to prevent clashing with filter tags UI
  const toggleEditorTag = (tag: string) => {
    setEditorTags(tags =>
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  };

  // Simulate rich text WYSIWYG commands for demo
  const handleEditorCmd = (cmd: string) => {
    if (cmd === "bold") setNewContent(c => c + "<b>Bold</b> ");
    if (cmd === "italic") setNewContent(c => c + "<i>Italic</i> ");
    if (cmd === "underline") setNewContent(c => c + "<u>Underline</u> ");
    if (cmd === "strike") setNewContent(c => c + "<s>Strikethrough</s> ");
    if (cmd.startsWith("heading")) setNewContent(c => c + `<h${cmd.at(-1)}>${cmd.replace("heading", "Heading ")} </h${cmd.at(-1)}>`); 
    if (cmd === "ul") setNewContent(c => c + "<ul><li>Bulleted item</li></ul>");
    if (cmd === "ol") setNewContent(c => c + "<ol><li>Numbered item</li></ol>");
    if (cmd === "image") setNewContent(c => c + `<img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200" class='inline-block my-2 rounded border' alt='UserFile'/>`);
    if (cmd === "attach") setNewContent(c => c + "<p><a class='text-primary underline' href='#'>AttachedFile.pdf</a></p>");
  };

  // Filter logic
  const filteredNotes = notes
    .filter(note =>
      (!search || note.title.toLowerCase().includes(search.toLowerCase()) || note.content.toLowerCase().includes(search.toLowerCase())) &&
      (!selectedFolder || note.folderId === selectedFolder) &&
      (selectedTags.length === 0 || selectedTags.every(tag => note.tags.includes(tag))) &&
      (!pinnedOnly || note.pinned)
    )
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.id - a.id);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar: Folders & Filters */}
      <aside className="w-full md:w-60 flex-shrink-0 mb-6 md:mb-0">
        <div className="bg-card border shadow rounded-lg p-4 space-y-6">
          {/* Folders */}
          <div>
            <div className="flex items-center mb-2">
              <Folder className="mr-2 h-5 w-5" /><span className="font-semibold text-sm">Folders</span>
            </div>
            <ul className="space-y-1">
              {folders.map(f => (
                <li key={f.id}>
                  <Button
                    variant={selectedFolder === f.id ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedFolder(f.id === selectedFolder ? null : f.id)}
                  >
                    {f.name}
                  </Button>
                </li>
              ))}
              <li>
                <Button
                  variant={selectedFolder === null ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder(null)}
                >
                  All Notes
                </Button>
              </li>
            </ul>
          </div>
          {/* Tags */}
          <div>
            <div className="flex items-center mb-2">
              <Tag className="mr-2 h-5 w-5" /><span className="font-semibold text-sm">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  onClick={() => toggleTag(tag)}
                  className="cursor-pointer px-2 py-1 text-xs transition"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 min-w-0">
        {/* Top Bar: Search, Filters, New Note */}
        <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
          <div className="relative flex-1 w-full">
            <Input
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8"
            />
            <Search className="h-5 w-5 absolute left-2 top-2.5 text-muted-foreground" />
          </div>
          <Button
            variant={pinnedOnly ? "secondary" : "ghost"}
            size="sm"
            className="md:w-auto w-full"
            onClick={() => setPinnedOnly(v => !v)}
          >
            <Star className="mr-1 h-4 w-4" /> Starred
          </Button>
          <Button size="sm" className="md:w-auto w-full" onClick={() => openEditor(undefined)}>
            <Edit className="mr-2 h-4 w-4" /> New Note
          </Button>
        </div>

        {/* Notes List */}
        <div className="grid lg:grid-cols-2 gap-4">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className="bg-background border rounded-lg shadow group transition hover:ring-2 hover:ring-primary/40 cursor-pointer"
              onClick={() => openEditor(note)}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") openEditor(note);
              }}
              aria-label={`Edit note: ${note.title}`}
              role="button"
            >
              <div className="flex items-center px-4 pt-4">
                <button
                  aria-label="Pin"
                  className="mr-2"
                  tabIndex={-1}
                  onClick={e => {
                    e.stopPropagation();
                    setNotes(notes =>
                      notes.map(n =>
                        n.id === note.id ? { ...n, pinned: !n.pinned } : n
                      )
                    );
                  }}
                >
                  {note.pinned ? <StarFilled className="h-5 w-5 text-yellow-400 fill-yellow-200" /> : <Star className="h-5 w-5 text-muted-foreground" />}
                </button>
                <h3 className="text-base font-semibold truncate flex-1">{note.title}</h3>
                <span className="text-xs text-muted-foreground">{note.date}</span>
              </div>
              <div className="px-4 pb-4 pt-2">
                <div className="text-sm prose max-w-full">{formatContent(note.content)}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {note.tags.map((t, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="icon" variant="ghost" className="text-muted-foreground" aria-label="Copy"
                    tabIndex={-1}
                    onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(note.content); }}
                  ><Copy className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Archive" tabIndex={-1}
                    onClick={e => { e.stopPropagation(); setNotes(notes => notes.filter(n => n.id !== note.id)); /* pseudo-archive */ }}>
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" aria-label="Delete" tabIndex={-1}
                    onClick={e => { e.stopPropagation(); setNotes(notes => notes.filter(n => n.id !== note.id)); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredNotes.length === 0 && (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              <FileText className="mx-auto mb-2 h-8 w-8" />
              <div>No notes found. Try refining your filters.</div>
            </div>
          )}
        </div>
      </section>

      {/* Note Creation/Editor Drawer/Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" aria-modal="true">
          <div className="bg-background w-full max-w-lg rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-primary"
              onClick={closeEditor}
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="font-bold mb-4 text-lg flex items-center gap-2">
              <Edit className="h-5 w-5" /> {editNoteId ? "Edit Note" : "New Note"}
            </h2>
            <Input
              placeholder="Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="mb-3"
            />
            <EditorToolbar onCommand={handleEditorCmd} />
            <Textarea
              placeholder="Start typing your note..."
              rows={5}
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              className="mb-3"
            />
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs text-muted-foreground mr-2">Tags:</span>
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={editorTags.includes(tag) ? "default" : "outline"}
                  onClick={() => toggleEditorTag(tag)}
                  className="cursor-pointer px-2 py-1 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={closeEditor} variant="secondary">Cancel</Button>
              <Button onClick={handleSaveNote}>
                <CopyCheck className="mr-2 h-4 w-4"/> Save Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalNotes;

