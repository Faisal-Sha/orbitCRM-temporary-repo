
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: FileList) => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, className = '' }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragOver 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-300 hover:border-gray-400'
      } ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-medium mb-2">Upload Files</h3>
      <p className="text-gray-500 mb-4">
        Drag and drop files here, or click to browse
      </p>
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button asChild>
          <span className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Browse Files
          </span>
        </Button>
      </label>
    </div>
  );
};

export default FileUpload;
