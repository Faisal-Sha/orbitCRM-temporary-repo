
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  onDateRangeChange: (from: Date | undefined, to: Date | undefined) => void;
}

// Helper function to normalize dates to midnight for proper comparison
const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const DateRangePicker = ({ onDateRangeChange }: DateRangePickerProps) => {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);

  const handleFromDateSelect = (date: Date | undefined) => {
    setFromDate(date);
    // If we have both dates after selecting from date, trigger callback
    if (date && toDate) {
      const normalizedFrom = normalizeDate(date);
      const normalizedTo = normalizeDate(toDate);
      
      // Always call callback with dates in chronological order
      if (normalizedFrom.getTime() <= normalizedTo.getTime()) {
        onDateRangeChange(date, toDate);
      } else {
        onDateRangeChange(toDate, date);
        setFromDate(toDate);
        setToDate(date);
      }
    }
  };

  const handleToDateSelect = (date: Date | undefined) => {
    setToDate(date);
    if (fromDate && date) {
      const normalizedFrom = normalizeDate(fromDate);
      const normalizedTo = normalizeDate(date);
      
      // Always call callback with dates in chronological order
      if (normalizedFrom.getTime() <= normalizedTo.getTime()) {
        onDateRangeChange(fromDate, date);
      } else {
        onDateRangeChange(date, fromDate);
        setFromDate(date);
        setToDate(fromDate);
      }
      
      // Always close the popover when both dates are selected
      setIsOpen(false);
    }
  };

  const clearDates = () => {
    setFromDate(undefined);
    setToDate(undefined);
    onDateRangeChange(undefined, undefined);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !fromDate && !toDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {fromDate && toDate ? (
            `${format(fromDate, "MMM dd, yyyy")} - ${format(toDate, "MMM dd, yyyy")}`
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <div className="p-3">
            <div className="text-sm font-medium mb-2">From</div>
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={handleFromDateSelect}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </div>
          <div className="p-3 border-l">
            <div className="text-sm font-medium mb-2">To</div>
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={handleToDateSelect}
              disabled={(date) => {
                if (!fromDate) return false;
                const normalizedFrom = normalizeDate(fromDate);
                const normalizedDate = normalizeDate(date);
                return normalizedDate.getTime() < normalizedFrom.getTime();
              }}
              className={cn("p-3 pointer-events-auto")}
            />
          </div>
        </div>
        <div className="p-3 border-t flex justify-between">
          <Button variant="outline" size="sm" onClick={clearDates}>
            Clear
          </Button>
          <Button size="sm" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
