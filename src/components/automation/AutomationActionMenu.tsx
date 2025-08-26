
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Edit, 
  Play, 
  Pause, 
  Copy, 
  Archive, 
  Trash2,
  ExternalLink
} from 'lucide-react';

interface Automation {
  id: string;
  title: string;
  status: 'Draft' | 'Published' | 'Archived';
  author: string;
  lastModified: Date;
  totalSteps: number;
  createdDate: Date;
}

interface AutomationActionMenuProps {
  automation: Automation;
  onEdit: (automation: Automation) => void;
  onToggleStatus: (automation: Automation) => void;
  onDuplicate: (automation: Automation) => void;
  onArchive?: (automation: Automation) => void;
  onDelete: (automation: Automation) => void;
}

export const AutomationActionMenu: React.FC<AutomationActionMenuProps> = ({
  automation,
  onEdit,
  onToggleStatus,
  onDuplicate,
  onArchive,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white">
        <DropdownMenuItem onClick={() => onEdit(automation)} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          Edit/Design
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onToggleStatus(automation)} className="cursor-pointer">
          {automation.status === 'Published' ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Unpublish
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Publish
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onDuplicate(automation)} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {onArchive && (
          <DropdownMenuItem onClick={() => onArchive(automation)} className="cursor-pointer">
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={() => onDelete(automation)} 
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
