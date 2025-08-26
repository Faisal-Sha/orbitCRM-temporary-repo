
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TaskFilterProps {
  onSearch: (term: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
}

const TasksFilter = ({ onSearch, onFilterChange }: TaskFilterProps) => {
  const handleReset = () => {
    onFilterChange("category", "all");
    onFilterChange("priority", "all");
    onFilterChange("status", "all");
    onSearch("");
  };

  const inputClasses = "pl-8 h-9 text-sm"; // Reduced height
  const selectTriggerClasses = "h-9 text-sm"; // Reduced height
  const labelClasses = "block text-gray-700 text-[13px] mb-1"; // Smaller font, more spacing
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          className={inputClasses}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Filter Tasks</h4>
              <Separator />
            </div>
            
            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label htmlFor="category" className={labelClasses}>Category</Label>
                <Select onValueChange={(value) => onFilterChange("category", value)}>
                  <SelectTrigger id="category" className={selectTriggerClasses}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Opportunity">Opportunity</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-1">
                <Label htmlFor="priority" className={labelClasses}>Priority</Label>
                <Select onValueChange={(value) => onFilterChange("priority", value)}>
                  <SelectTrigger id="priority" className={selectTriggerClasses}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-1">
                <Label htmlFor="status" className={labelClasses}>Status</Label>
                <Select onValueChange={(value) => onFilterChange("status", value)}>
                  <SelectTrigger id="status" className={selectTriggerClasses}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" className="border border-border px-3 py-0.5 rounded hover:bg-gray-100 hover:text-foreground"
                onClick={handleReset}
              >
                Reset filter
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TasksFilter;

