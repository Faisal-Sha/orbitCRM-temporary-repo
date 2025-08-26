
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Edit, Trash2 } from "lucide-react";
import { Availability } from "./types";
import { ALL_DAYS } from "./constants";
import { HolidaysModal } from "./HolidaysModal";

interface AvailabilityCardProps {
  availability: Availability;
  index: number;
  onEdit: (availability: Availability) => void;
  onDelete: (id: string) => void;
  holidayModal: { open: boolean; holidays: string[]; availabilityName: string; index: number };
  setHolidayModal: (modal: { open: boolean; holidays: string[]; availabilityName: string; index: number }) => void;
  onRemoveHoliday: (availabilityIndex: number, holidayIndex: number) => void;
}

export const AvailabilityCard = ({
  availability,
  index,
  onEdit,
  onDelete,
  holidayModal,
  setHolidayModal,
  onRemoveHoliday
}: AvailabilityCardProps) => {
  return (
    <div className="border rounded-2xl shadow-sm bg-white p-5 flex flex-col gap-3 min-h-[170px]">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col">
          <span className="text-lg font-medium">{availability.name}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-muted max-w-fit">{availability.timezone}</span>
        </div>
        <div className="flex gap-1 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={() => onEdit(availability)} title="Edit">
                <Edit size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-black border border-gray-200 shadow">Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={() => onDelete(availability.id)} title="Delete">
                <Trash2 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-black border border-gray-200 shadow">Delete</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 justify-between mt-2">
        <div className="flex-1">
          <div className="font-medium text-xs mb-1">Weekday Time Slots</div>
          <div className="flex flex-col gap-2">
            {ALL_DAYS.map(day =>
              <div key={day} className="flex items-center">
                <span className="font-mono w-8">{day}:</span>
                <span className="ml-2 text-xs">
                  {availability.days[day] && availability.days[day].length > 0
                    ? availability.days[day]
                        .map((slot) => `${slot.from} - ${slot.to}`)
                        .join(", ")
                    : <span className="text-gray-400">—</span>}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-[140px]">
          <div className="font-medium text-xs mb-1 flex items-center gap-2">
            Holidays (calendar)
            {availability.holidays.length > 0 && (
              <Button
                size="sm"
                variant="secondary"
                className="ml-2"
                onClick={() =>
                  setHolidayModal({
                    open: true,
                    holidays: availability.holidays,
                    availabilityName: availability.name,
                    index: index
                  })
                }
              >
                Show holidays
              </Button>
            )}
          </div>
          <HolidaysModal
            open={holidayModal.open && holidayModal.index === index}
            holidays={holidayModal.holidays}
            availabilityIndex={index}
            onClose={() => setHolidayModal({ ...holidayModal, open: false })}
            onRemove={idx => onRemoveHoliday(index, idx)}
          />
          {availability.holidays.length === 0 && <span className="text-gray-400">None</span>}
        </div>
      </div>
    </div>
  );
};
