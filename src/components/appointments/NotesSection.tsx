import { useState } from "react";
import { Appointment } from "./listview/types";
import { useAttendeeNotesHistory, AttendeeNote } from "@/hooks/useAttendeeNotesHistory";
import { NoteTypeSection } from "./NoteTypeSection";
import { ViewAllNotesModal } from "./ViewAllNotesModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, StickyNote, Loader2 } from "lucide-react";
import { useAppointmentNotes } from "@/hooks/useAppointmentNotes";

interface NotesSectionProps {
  appointment: Appointment;
  attendeeEmail: string;
  attendeePhone: string;
  agencyId: string | null;
  isNoteEditable: boolean;
  appointmentType: 'intakes' | 'clients';
  currentPersonId: string | null;
}

export const NotesSection = ({
  appointment,
  attendeeEmail,
  attendeePhone,
  agencyId,
  isNoteEditable,
  appointmentType,
  currentPersonId,
}: NotesSectionProps) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteValue, setEditingNoteValue] = useState("");
  const [viewAllModalOpen, setViewAllModalOpen] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState<AttendeeNote['noteType']>('attendee');

  const { updateNote } = useAppointmentNotes();

  const { data: allNotes = [], isLoading } = useAttendeeNotesHistory({
    appointmentId: appointment.id,
    attendeeEmail,
    attendeePhone,
    agencyId,
    enabled: true,
  });

  // Separate current appointment notes from previous
  const currentNotes = allNotes.filter(n => n.isCurrentAppointment);
  const previousNotes = allNotes.filter(n => !n.isCurrentAppointment);

  // Group by note type
  const groupByType = (notes: AttendeeNote[]) => ({
    attendee: notes.filter(n => n.noteType === 'attendee'),
    assessor: notes.filter(n => n.noteType === 'assessor' || n.noteType === 'provider'),
    reschedule: notes.filter(n => n.noteType === 'reschedule'),
    cancellation: notes.filter(n => n.noteType === 'cancellation'),
  });

  const currentGrouped = groupByType(currentNotes);
  const previousGrouped = groupByType(previousNotes);

  const handleViewAll = (noteType: AttendeeNote['noteType']) => {
    setSelectedNoteType(noteType);
    setViewAllModalOpen(true);
  };

  const startNoteEdit = (noteValue: string) => {
    setEditingNoteId(appointment.id);
    setEditingNoteValue(noteValue);
  };

  const saveNoteEdit = () => {
    if (currentPersonId) {
      updateNote({
        appointmentId: appointment.id,
        personId: currentPersonId,
        note: editingNoteValue || null,
      });
    }
    setEditingNoteId(null);
    setEditingNoteValue("");
  };

  const cancelNoteEdit = () => {
    setEditingNoteId(null);
    setEditingNoteValue("");
  };

  const assessorLabel = appointmentType === 'intakes' ? 'Assessor' : 'Provider';

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-5 uppercase tracking-wide">
          Notes
        </h4>

        {/* Current Appointment Notes */}
        <div className="bg-blue-50/30 rounded-lg border-l-4 border-blue-500 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded uppercase tracking-wide">
              Current Appointment
            </span>
          </div>

          <div className="space-y-5">
            {/* Current Attendee Note */}
            {currentGrouped.attendee.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Attendee Note
                  </h5>
                </div>
                <div className="bg-white rounded-md border border-blue-200 p-3">
                  <p className="text-sm text-gray-900">{currentGrouped.attendee[0].noteText}</p>
                </div>
              </div>
            )}

            {/* Current Assessor/Provider Note (Editable) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-blue-600" />
                <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  {assessorLabel} Note
                </h5>
              </div>
              <div className="bg-white rounded-md border border-blue-200 p-3">
                {appointment.outcome === "Canceled" ? (
                  appointment.cancellationReason ? (
                    <p className="text-sm text-gray-900">{appointment.cancellationReason}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No cancellation reason provided</p>
                  )
                ) : !isNoteEditable ? (
                  appointment.note ? (
                    <p className="text-sm text-gray-900">{appointment.note}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No note</p>
                  )
                ) : editingNoteId === appointment.id ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      value={editingNoteValue}
                      onChange={(e) => setEditingNoteValue(e.target.value)}
                      className="text-sm"
                      placeholder={`Add ${assessorLabel.toLowerCase()} note...`}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveNoteEdit();
                        else if (e.key === "Escape") cancelNoteEdit();
                      }}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveNoteEdit} className="text-xs h-7">
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelNoteEdit} className="text-xs h-7">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : appointment.note === undefined || appointment.note === "" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 w-fit"
                    onClick={() => startNoteEdit("")}
                  >
                    + Add Note
                  </Button>
                ) : (
                  <div
                    className="text-sm text-gray-900 cursor-pointer px-2 py-1.5 rounded hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
                    onClick={() => startNoteEdit(appointment.note || "")}
                  >
                    {appointment.note}
                  </div>
                )}
              </div>
            </div>

            {/* Current Reschedule/Cancellation Notes */}
            {currentGrouped.reschedule.length > 0 && (
              <NoteTypeSection
                title="Reschedule Reason"
                noteType="reschedule"
                notes={currentGrouped.reschedule}
                onViewAll={() => handleViewAll('reschedule')}
                maxDisplay={1}
              />
            )}
            {currentGrouped.cancellation.length > 0 && appointment.outcome === "Canceled" && (
              <NoteTypeSection
                title="Cancellation Reason"
                noteType="cancellation"
                notes={currentGrouped.cancellation}
                onViewAll={() => handleViewAll('cancellation')}
                maxDisplay={1}
              />
            )}
          </div>
        </div>

        {/* Previous Appointments Notes */}
        {previousNotes.length > 0 && (
          <div className="bg-gray-50 rounded-lg border-l-4 border-gray-300 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2.5 py-1 rounded uppercase tracking-wide">
                Previous Appointments
              </span>
            </div>

            <div className="space-y-5">
              <NoteTypeSection
                title="Attendee Notes"
                noteType="attendee"
                notes={previousGrouped.attendee}
                onViewAll={() => handleViewAll('attendee')}
              />
              <NoteTypeSection
                title={`${assessorLabel} Notes`}
                noteType={appointmentType === 'intakes' ? 'assessor' : 'provider'}
                notes={previousGrouped.assessor}
                onViewAll={() => handleViewAll('assessor')}
              />
              <NoteTypeSection
                title="Reschedule Reasons"
                noteType="reschedule"
                notes={previousGrouped.reschedule}
                onViewAll={() => handleViewAll('reschedule')}
              />
              <NoteTypeSection
                title="Cancellation Reasons"
                noteType="cancellation"
                notes={previousGrouped.cancellation}
                onViewAll={() => handleViewAll('cancellation')}
              />
            </div>

            {previousNotes.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-4">
                No previous notes for this attendee
              </p>
            )}
          </div>
        )}
      </div>

      <ViewAllNotesModal
        isOpen={viewAllModalOpen}
        onClose={() => setViewAllModalOpen(false)}
        notes={allNotes.filter(n => n.noteType === selectedNoteType)}
        noteType={selectedNoteType}
        attendeeName={appointment.clientFullName}
      />
    </>
  );
};
