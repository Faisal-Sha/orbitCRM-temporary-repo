
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useFileManager } from '@/hooks/useFileManager';
import FileUpload from '@/components/files/FileUpload';
import FileTable from '@/components/files/FileTable';
import FileFiltersComponent from '@/components/files/FileFilters';
import BulkActions from '@/components/files/BulkActions';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Active = () => {
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();
  const {
    files,
    selectedFiles,
    setSelectedFiles,
    filters,
    setFilters,
    archiveFiles,
    deleteFiles,
    renameFile,
    addFile
  } = useFileManager();

  // Filter only active files
  const activeFiles = files.filter(file => file.status === 'active');

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedFiles(selected ? activeFiles.map(f => f.id) : []);
  };

  const handleUpload = (fileList: FileList) => {
    Array.from(fileList).forEach(file => {
      const newFile = {
        name: file.name,
        type: file.name.split('.').pop() || 'unknown',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        uploader: 'Current User',
        tags: [],
        status: 'active' as const
      };
      addFile(newFile);
    });
    
    setShowUpload(false);
    toast({
      title: "Files uploaded successfully",
      description: `${fileList.length} file(s) have been uploaded.`,
    });
  };

  const handleDownload = (fileId: string) => {
    const file = activeFiles.find(f => f.id === fileId);
    toast({
      title: "Download started",
      description: `Downloading ${file?.name}...`,
    });
  };

  const handlePreview = (fileId: string) => {
    const file = activeFiles.find(f => f.id === fileId);
    toast({
      title: "Preview opened",
      description: `Opening preview for ${file?.name}...`,
    });
  };

  const handleArchive = (fileId: string) => {
    archiveFiles([fileId]);
    toast({
      title: "File archived",
      description: "File has been moved to archived files.",
    });
  };

  const handleDelete = (fileId: string) => {
    if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      deleteFiles([fileId]);
      toast({
        title: "File deleted",
        description: "File has been permanently deleted.",
      });
    }
  };

  const handleRename = (fileId: string) => {
    const file = activeFiles.find(f => f.id === fileId);
    const newName = prompt('Enter new file name:', file?.name);
    if (newName && newName !== file?.name) {
      renameFile(fileId, newName);
      toast({
        title: "File renamed",
        description: `File renamed to ${newName}`,
      });
    }
  };

  const handleBulkDownload = () => {
    toast({
      title: "Bulk download started",
      description: `Downloading ${selectedFiles.length} selected files...`,
    });
  };

  const handleBulkArchive = () => {
    archiveFiles(selectedFiles);
    toast({
      title: "Files archived",
      description: `${selectedFiles.length} files have been archived.`,
    });
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedFiles.length} selected files? This action cannot be undone.`)) {
      deleteFiles(selectedFiles);
      toast({
        title: "Files deleted",
        description: `${selectedFiles.length} files have been permanently deleted.`,
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      uploader: '',
      dateRange: { start: '', end: '' },
      tags: [],
      client: ''
    });
  };

  return (
    <div className="app-card space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Active Files</h3>
          <p className="text-gray-500 text-sm">Manage your active files and documents</p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {showUpload && (
        <FileUpload onUpload={handleUpload} />
      )}

      <FileFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      <BulkActions
        selectedCount={selectedFiles.length}
        onBulkDownload={handleBulkDownload}
        onBulkArchive={handleBulkArchive}
        onBulkDelete={handleBulkDelete}
        showArchived={false}
      />

      <FileTable
        files={activeFiles}
        selectedFiles={selectedFiles}
        onSelectFile={handleSelectFile}
        onSelectAll={handleSelectAll}
        onDownload={handleDownload}
        onPreview={handlePreview}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onRename={handleRename}
        showArchived={false}
      />
    </div>
  );
};

export default Active;
