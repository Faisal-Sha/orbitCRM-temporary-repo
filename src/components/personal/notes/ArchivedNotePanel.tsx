import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NoteAttachment {
  name: string;
  url: string;
}
interface NoteComment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
}
interface ArchivedNote {
  id: string;
  title: string;
  content: string;
  snippet?: string;
  createdAt: Date;
  modifiedAt: Date;
  archivedAt: Date;
  tags: string[];
  attachments?: NoteAttachment[];
  comments?: NoteComment[];
}

interface ArchivedNotePanelProps {
  note: ArchivedNote;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  open: boolean;
}

const ArchivedNotePanel: React.FC<ArchivedNotePanelProps> = ({
  note,
  onRestore,
  onDelete,
  onClose,
  open,
}) => {
  if (!note) return null;
  return (
    <SheetContent
      className="w-[50vw] max-w-none min-w-0 p-0 border-l animate-slide-in-right bg-white"
      side="right"
      // keeps exactly 50% of viewport width, always, like ArchivedTaskPanel
      style={{ width: "50vw", minWidth: "0", maxWidth: "none" }}
    >
      <ScrollArea className="h-full w-full">
        <div className="p-6 text-gray-900">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-1 mb-4">
            <h3 className="font-bold text-2xl flex-1 truncate">{note.title}</h3>
            <div className="flex flex-wrap gap-1">
              {note.tags?.map(tag => (
                <Badge key={tag} className="bg-gray-200 text-gray-700 px-2 py-0.5">{tag}</Badge>
              ))}
            </div>
          </div>
          <div className="mb-2 text-base whitespace-pre-line break-words text-gray-800">{note.content}</div>
          <Separator className="my-3"/>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div>
              <span className="font-semibold">Created:</span>{" "}
              {format(note.createdAt, "MMM dd, yyyy, HH:mm")}
            </div>
            <div>
              <span className="font-semibold">Last Modified:</span>{" "}
              {format(note.modifiedAt, "MMM dd, yyyy, HH:mm")}
            </div>
            <div>
              <span className="font-semibold">Archived:</span>{" "}
              {format(note.archivedAt, "MMM dd, yyyy, HH:mm")}
            </div>
          </div>
          {/* Attachments */}
          {note.attachments && note.attachments.length > 0 && (
            <div className="mt-4">
              <span className="font-semibold block mb-2">Attachments:</span>
              <ul className="ml-2 list-disc space-y-1">
                {note.attachments.map((att, i) =>
                  <li key={att.name + i}>
                    <a href={att.url} className="underline text-primary" target="_blank" rel="noopener noreferrer">{att.name}</a>
                  </li>
                )}
              </ul>
            </div>
          )}
          {/* Comments */}
          {note.comments && note.comments.length > 0 && (
            <div className="mt-5">
              <span className="font-semibold block mb-2">Comments:</span>
              <div className="space-y-2">
                {note.comments.map(c => (
                  <div key={c.id} className="p-2 rounded-md bg-gray-50 border text-sm">
                    <span className="font-medium">{c.author}:</span>{" "}
                    <span>{c.text}</span>
                    <span className="float-right text-xs text-gray-400 ml-2">
                      {format(c.timestamp, "MMM dd, yyyy, HH:mm")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Separator className="my-4"/>
          <div className="flex justify-between gap-3 mt-3">
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
              onClick={() => onRestore(note.id)}
            >
              <ArchiveRestore className="h-4 w-4 mr-2" />
              Unarchive / Restore
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => onDelete(note.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </ScrollArea>
    </SheetContent>
  );
};

export default ArchivedNotePanel;
