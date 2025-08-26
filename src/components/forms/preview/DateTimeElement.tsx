
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { formatDateTime } from '@/utils/dateTimeFormatter';
import { BaseElementProps } from './types';
import { getWidthClass } from './utils';

interface DateTimeElementProps extends BaseElementProps {}

export const DateTimeElement: React.FC<DateTimeElementProps> = ({
  element,
  value,
  updateFormValue,
  isDisabled,
  isRequired,
  error,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        const timeString = format(time, 'h:mm a');
        slots.push(timeString);
      }
    }
    return slots;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      if (element.dateType === 'datetime') {
        updateFormValue(element.id, date.toISOString());
      } else {
        updateFormValue(element.id, date.toISOString());
        setCalendarOpen(false);
      }
    }
  };

  return (
    <div className={`space-y-2 ${getWidthClass(element.width)}`}>
      {element.showLabel && (
        <label className="block text-sm font-medium">
          {element.label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {element.dateType === 'date' || element.dateType === 'datetime' ? (
        <div className="space-y-2">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? formatDateTime(value, element.dateFormat, element.dateType) : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {element.dateType === 'datetime' ? (
                <div className="flex">
                  <Calendar
                    mode="single"
                    selected={value ? new Date(value) : undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="pointer-events-auto"
                  />
                  <div className="w-48 p-3 border-l">
                    <label className="block text-sm font-medium mb-2">Select Time:</label>
                    <div className="grid grid-cols-2 gap-1 max-h-60 overflow-y-auto">
                      {generateTimeSlots().map((timeSlot) => (
                        <Button
                          key={timeSlot}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            const selectedDate = value ? new Date(value) : new Date();
                            const [time, period] = timeSlot.split(' ');
                            const [hour, minute] = time.split(':');
                            let adjustedHour = parseInt(hour);
                            if (period === 'PM' && adjustedHour !== 12) adjustedHour += 12;
                            if (period === 'AM' && adjustedHour === 12) adjustedHour = 0;
                            
                            selectedDate.setHours(adjustedHour, parseInt(minute), 0, 0);
                            updateFormValue(element.id, selectedDate.toISOString());
                            setCalendarOpen(false);
                          }}
                        >
                          {timeSlot}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="pointer-events-auto"
                />
              )}
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <Input
          type="time"
          value={value}
          onChange={(e) => updateFormValue(element.id, e.target.value)}
          disabled={isDisabled}
        />
      )}
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );
};
