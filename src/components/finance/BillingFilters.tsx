
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ChevronDown, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import DateRangePicker from "@/components/finance/DateRangePicker";

interface BillingFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  serviceFilter: string;
  setServiceFilter: (value: string) => void;
  providerFilterState: string;
  setProviderFilterState: (value: string) => void;
  dateRangeFilter: string;
  setDateRangeFilter: (value: string) => void;
  providerSearchOpen: boolean;
  setProviderSearchOpen: (value: boolean) => void;
  providerSearchValue: string;
  setProviderSearchValue: (value: string) => void;
  allProviders: string[];
  handleCustomDateRangeChange: (from: Date | undefined, to: Date | undefined) => void;
  clearAllFilters: () => void;
}

const BillingFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  serviceFilter,
  setServiceFilter,
  providerFilterState,
  setProviderFilterState,
  dateRangeFilter,
  setDateRangeFilter,
  providerSearchOpen,
  setProviderSearchOpen,
  providerSearchValue,
  setProviderSearchValue,
  allProviders,
  handleCustomDateRangeChange,
  clearAllFilters
}: BillingFiltersProps) => {
  const filteredProviders = allProviders.filter(provider =>
    provider.toLowerCase().includes(providerSearchValue.toLowerCase())
  );

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <div className="relative flex-1 min-w-[200px]">
        <Input
          placeholder="Search charges..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={clearAllFilters}>
            Clear All Filters
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>By Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("unbilled")}>Unbilled</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("approved")}>Approved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("paid")}>Paid</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>Rejected</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>By Service</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setServiceFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setServiceFilter("Individual Therapy Session")}>Individual Therapy Session</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setServiceFilter("Group Therapy Session")}>Group Therapy Session</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setServiceFilter("Assessment Consultation")}>Assessment Consultation</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setServiceFilter("Family Therapy Session")}>Family Therapy Session</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setServiceFilter("Psychological Testing")}>Psychological Testing</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover open={providerSearchOpen} onOpenChange={setProviderSearchOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={providerSearchOpen}
            className="w-[200px] justify-between"
          >
            <Users className="w-4 h-4 mr-2" />
            {providerFilterState !== "all" ? providerFilterState : "Select provider..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[300px] p-0 bg-white border border-gray-200 shadow-lg z-50" 
          align="start"
          side="bottom"
          sideOffset={8}
          alignOffset={0}
          avoidCollisions={true}
          collisionPadding={16}
        >
          <Command shouldFilter={false}>
            <div className="px-3 py-2 border-b bg-white">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 opacity-50" />
                <input
                  placeholder="Search providers..."
                  value={providerSearchValue}
                  onChange={(e) => setProviderSearchValue(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                  onMouseDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-[200px] overflow-y-auto bg-white">
              <CommandList className="max-h-none overflow-visible">
                <CommandEmpty>No provider found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      setProviderFilterState("all");
                      setProviderSearchValue("");
                      setProviderSearchOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    All Providers
                  </CommandItem>
                  {filteredProviders.map((provider) => (
                    <CommandItem
                      key={provider}
                      value={provider}
                      onSelect={(currentValue) => {
                        setProviderFilterState(currentValue);
                        setProviderSearchOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      {provider}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-time">All Time</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="last-month">Last Month</SelectItem>
          <SelectItem value="this-quarter">This Quarter</SelectItem>
          <SelectItem value="last-quarter">Last Quarter</SelectItem>
          <SelectItem value="this-year">This Year</SelectItem>
          <SelectItem value="last-year">Last Year</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      
      {dateRangeFilter === "custom" && (
        <div className="flex-shrink-0">
          <DateRangePicker onDateRangeChange={handleCustomDateRangeChange} />
        </div>
      )}
    </div>
  );
};

export default BillingFilters;
