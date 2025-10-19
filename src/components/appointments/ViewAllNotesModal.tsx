import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AttendeeNote } from "@/hooks/useAttendeeNotesHistory";
import { MessageSquare, StickyNote, Calendar, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ViewAllNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: AttendeeNote[];
  noteType: 'attendee' | 'assessor' | 'provider' | 'reschedule' | 'cancellation';
  attendeeName: string;
}

const getIconAndColor = (noteType: string) => {
  switch (noteType) {
    case 'attendee':
      return { Icon: MessageSquare, color: 'text-blue-600', bgColor: 'bg-blue-50' };
    case 'assessor':
    case 'provider':
      return { Icon: StickyNote, color: 'text-blue-600', bgColor: 'bg-blue-50' };
    case 'reschedule':
      return { Icon: Calendar, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    case 'cancellation':
      return { Icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' };
    default:
      return { Icon: StickyNote, color: 'text-gray-600', bgColor: 'bg-gray-50' };
  }
};

const getNoteTypeTitle = (noteType: string) => {
  switch (noteType) {
    case 'attendee':
      return 'Attendee Notes';
    case 'assessor':
      return 'Assessor Notes';
    case 'provider':
      return 'Provider Notes';
    case 'reschedule':
      return 'Reschedule Reasons';
    case 'cancellation':
      return 'Cancellation Reasons';
    default:
      return 'Notes';
  }
};

export const ViewAllNotesModal = ({
  isOpen,
  onClose,
  notes,
  noteType,
  attendeeName,
}: ViewAllNotesModalProps) => {
  const { Icon, color, bgColor } = getIconAndColor(noteType);
  const title = getNoteTypeTitle(noteType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${color}`} />
            {title} - {attendeeName}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`rounded-lg border border-gray-200 p-4 space-y-2 ${
                  note.isCurrentAppointment ? 'bg-blue-50/30 border-blue-200' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">
                      {note.appointmentDate} at {note.appointmentTime}
                    </span>
                    {note.isCurrentAppointment && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-900 leading-relaxed">{note.noteText}</p>
              </div>
            ))}
            {notes.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-8">
                No {title.toLowerCase()} found
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
