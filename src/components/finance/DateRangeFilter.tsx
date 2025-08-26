
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DateRangePicker from "./DateRangePicker";
import { DateRangeOption } from "@/hooks/useTransactionsData";

interface DateRangeFilterProps {
  value: DateRangeOption;
  onChange: (value: DateRangeOption) => void;
  onCustomRangeChange: (from: Date | undefined, to: Date | undefined) => void;
}

const DateRangeFilter = ({ value, onChange, onCustomRangeChange }: DateRangeFilterProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="min-w-[200px]">
        <Select value={value} onValueChange={(val) => onChange(val as DateRangeOption)}>
          <SelectTrigger>
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-time">All Time</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="this-quarter">This Quarter</SelectItem>
            <SelectItem value="last-quarter">Last Quarter</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
            <SelectItem value="last-year">Last Year</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {value === "custom" && (
        <DateRangePicker onDateRangeChange={onCustomRangeChange} />
      )}
    </div>
  );
};

export default DateRangeFilter;
