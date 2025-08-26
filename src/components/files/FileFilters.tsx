
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileFilters } from '@/types/files';
import { Search, Filter, X } from 'lucide-react';

interface FileFiltersProps {
  filters: FileFilters;
  onFiltersChange: (filters: FileFilters) => void;
  onClearFilters: () => void;
}

const FileFiltersComponent: React.FC<FileFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const hasActiveFilters = filters.search || filters.type || filters.uploader || filters.client;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search files by name, client, or tags..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters} size="sm">
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <Select
          value={filters.type || "all"}
          onValueChange={(value) => onFiltersChange({ ...filters, type: value === "all" ? "" : value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="File Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="docx">Word</SelectItem>
            <SelectItem value="txt">Text</SelectItem>
            <SelectItem value="jpg">Image</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.uploader || "all"}
          onValueChange={(value) => onFiltersChange({ ...filters, uploader: value === "all" ? "" : value })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Uploader" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Uploaders</SelectItem>
            <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
            <SelectItem value="Dr. Michael Davis">Dr. Michael Davis</SelectItem>
            <SelectItem value="Admin Staff">Admin Staff</SelectItem>
            <SelectItem value="Reception">Reception</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.client || "all"}
          onValueChange={(value) => onFiltersChange({ ...filters, client: value === "all" ? "" : value })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            <SelectItem value="John Smith">John Smith</SelectItem>
            <SelectItem value="Jane Doe">Jane Doe</SelectItem>
            <SelectItem value="Robert Wilson">Robert Wilson</SelectItem>
            <SelectItem value="Emma Thompson">Emma Thompson</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FileFiltersComponent;
