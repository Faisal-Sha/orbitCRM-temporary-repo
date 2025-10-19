import { AttendeeNote } from "@/hooks/useAttendeeNotesHistory";
import { MessageSquare, StickyNote, Calendar, XCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoteTypeSectionProps {
  title: string;
  noteType: 'attendee' | 'assessor' | 'provider' | 'reschedule' | 'cancellation';
  notes: AttendeeNote[];
  onViewAll: () => void;
  maxDisplay?: number;
}

const getIconAndColor = (noteType: string) => {
  switch (noteType) {
    case 'attendee':
      return { Icon: MessageSquare, color: 'text-blue-600' };
    case 'assessor':
    case 'provider':
      return { Icon: StickyNote, color: 'text-blue-600' };
    case 'reschedule':
      return { Icon: Calendar, color: 'text-yellow-600' };
    case 'cancellation':
      return { Icon: XCircle, color: 'text-red-600' };
    default:
      return { Icon: StickyNote, color: 'text-gray-600' };
  }
};

export const NoteTypeSection = ({
  title,
  noteType,
  notes,
  onViewAll,
  maxDisplay = 3,
}: NoteTypeSectionProps) => {
  if (notes.length === 0) return null;

  const { Icon, color } = getIconAndColor(noteType);
  const displayedNotes = notes.slice(0, maxDisplay);
  const hasMore = notes.length > maxDisplay;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          {title} ({notes.length})
        </h5>
      </div>
      <div className="space-y-2">
        {displayedNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-md border border-gray-200 p-3 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                {note.appointmentDate} at {note.appointmentTime}
              </span>
            </div>
            <p className="text-sm text-gray-900">{note.noteText}</p>
          </div>
        ))}
      </div>
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="text-xs text-primary hover:text-primary/80 p-0 h-auto font-medium"
        >
          View All ({notes.length})
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      )}
    </div>
  );
};
