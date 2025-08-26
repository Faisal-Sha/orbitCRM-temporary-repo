
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'input' | 'daterange';
  options?: { value: string; label: string }[];
}

interface AuditFiltersProps {
  filters: FilterOption[];
  onFilterChange: (filterKey: string, value: string) => void;
  onClearFilters: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const AuditFilters: React.FC<AuditFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  searchValue,
  onSearchChange
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters & Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                placeholder="Search logs..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Dynamic Filters */}
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-2">
              <Label htmlFor={filter.key}>{filter.label}</Label>
              {filter.type === 'select' && filter.options ? (
                <Select onValueChange={(value) => onFilterChange(filter.key, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${filter.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={filter.key}
                  placeholder={`Enter ${filter.label}`}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={onClearFilters} size="sm">
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuditFilters;
