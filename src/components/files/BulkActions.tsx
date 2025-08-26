
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Archive, Download, Trash2, RotateCcw, ChevronDown } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onBulkDownload: () => void;
  onBulkArchive?: () => void;
  onBulkRestore?: () => void;
  onBulkDelete: () => void;
  showArchived?: boolean;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onBulkDownload,
  onBulkArchive,
  onBulkRestore,
  onBulkDelete,
  showArchived = false
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <span className="text-sm font-medium">
        {selectedCount} file{selectedCount > 1 ? 's' : ''} selected
      </span>
      
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" onClick={onBulkDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Actions
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {showArchived ? (
              <DropdownMenuItem onClick={onBulkRestore}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore Selected
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={onBulkArchive}>
                <Archive className="h-4 w-4 mr-2" />
                Archive Selected
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onBulkDelete} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default BulkActions;
