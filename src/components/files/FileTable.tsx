
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileItem } from '@/types/files';
import { 
  FileText, 
  Download, 
  Archive, 
  Trash2, 
  Edit, 
  Eye, 
  MoreHorizontal,
  RotateCcw
} from 'lucide-react';

interface FileTableProps {
  files: FileItem[];
  selectedFiles: string[];
  onSelectFile: (fileId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onDownload: (fileId: string) => void;
  onPreview: (fileId: string) => void;
  onArchive?: (fileId: string) => void;
  onRestore?: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  onRename: (fileId: string) => void;
  showArchived?: boolean;
}

const getFileIcon = (type: string) => {
  const iconProps = { className: "h-4 w-4", color: getFileColor(type) };
  
  switch (type.toLowerCase()) {
    case 'pdf':
      return <FileText {...iconProps} />;
    case 'doc':
    case 'docx':
      return <FileText {...iconProps} />;
    case 'txt':
      return <FileText {...iconProps} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <FileText {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

const getFileColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return '#dc2626';
    case 'doc':
    case 'docx':
      return '#2563eb';
    case 'txt':
      return '#6b7280';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return '#059669';
    default:
      return '#6b7280';
  }
};

const FileTable: React.FC<FileTableProps> = ({
  files,
  selectedFiles,
  onSelectFile,
  onSelectAll,
  onDownload,
  onPreview,
  onArchive,
  onRestore,
  onDelete,
  onRename,
  showArchived = false
}) => {
  const allSelected = files.length > 0 && selectedFiles.length === files.length;
  const someSelected = selectedFiles.length > 0 && selectedFiles.length < files.length;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
                className={someSelected ? "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground opacity-50" : ""}
              />
            </TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Uploader</TableHead>
            <TableHead>Client/Record</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                {showArchived ? 'No archived files found' : 'No active files found'}
              </TableCell>
            </TableRow>
          ) : (
            files.map((file) => (
              <TableRow key={file.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    onCheckedChange={() => onSelectFile(file.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.type)}
                    <span className="font-medium">{file.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{file.type.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.uploadDate}</TableCell>
                <TableCell>{file.uploader}</TableCell>
                <TableCell>
                  {file.associatedClient && (
                    <div className="text-sm">
                      <div>{file.associatedClient}</div>
                      {file.associatedRecord && (
                        <div className="text-gray-500">{file.associatedRecord}</div>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {file.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onPreview(file.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownload(file.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRename(file.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      {showArchived ? (
                        <DropdownMenuItem onClick={() => onRestore?.(file.id)}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Restore
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onArchive?.(file.id)}>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onDelete(file.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FileTable;
