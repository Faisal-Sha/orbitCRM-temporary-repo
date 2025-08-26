
import React from 'react';
import { useFileManager } from '@/hooks/useFileManager';
import FileTable from '@/components/files/FileTable';
import FileFiltersComponent from '@/components/files/FileFilters';
import BulkActions from '@/components/files/BulkActions';
import { useToast } from '@/hooks/use-toast';

const Archived = () => {
  const { toast } = useToast();
  const {
    files,
    selectedFiles,
    setSelectedFiles,
    filters,
    setFilters,
    restoreFiles,
    deleteFiles,
    renameFile
  } = useFileManager();

  // Filter only archived files
  const archivedFiles = files.filter(file => file.status === 'archived');

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedFiles(selected ? archivedFiles.map(f => f.id) : []);
  };

  const handleDownload = (fileId: string) => {
    const file = archivedFiles.find(f => f.id === fileId);
    toast({
      title: "Download started",
      description: `Downloading ${file?.name}...`,
    });
  };

  const handlePreview = (fileId: string) => {
    const file = archivedFiles.find(f => f.id === fileId);
    toast({
      title: "Preview opened",
      description: `Opening preview for ${file?.name}...`,
    });
  };

  const handleRestore = (fileId: string) => {
    restoreFiles([fileId]);
    toast({
      title: "File restored",
      description: "File has been moved back to active files.",
    });
  };

  const handleDelete = (fileId: string) => {
    if (confirm('Are you sure you want to permanently delete this archived file? This action cannot be undone.')) {
      deleteFiles([fileId]);
      toast({
        title: "File deleted",
        description: "Archived file has been permanently deleted.",
      });
    }
  };

  const handleRename = (fileId: string) => {
    const file = archivedFiles.find(f => f.id === fileId);
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

  const handleBulkRestore = () => {
    restoreFiles(selectedFiles);
    toast({
      title: "Files restored",
      description: `${selectedFiles.length} files have been restored to active files.`,
    });
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to permanently delete ${selectedFiles.length} selected archived files? This action cannot be undone.`)) {
      deleteFiles(selectedFiles);
      toast({
        title: "Files deleted",
        description: `${selectedFiles.length} archived files have been permanently deleted.`,
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
          <h3 className="text-lg font-medium text-gray-900">Archived Files</h3>
          <p className="text-gray-500 text-sm">View and manage your archived files</p>
        </div>
      </div>

      <FileFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      <BulkActions
        selectedCount={selectedFiles.length}
        onBulkDownload={handleBulkDownload}
        onBulkRestore={handleBulkRestore}
        onBulkDelete={handleBulkDelete}
        showArchived={true}
      />

      <FileTable
        files={archivedFiles}
        selectedFiles={selectedFiles}
        onSelectFile={handleSelectFile}
        onSelectAll={handleSelectAll}
        onDownload={handleDownload}
        onPreview={handlePreview}
        onRestore={handleRestore}
        onDelete={handleDelete}
        onRename={handleRename}
        showArchived={true}
      />
    </div>
  );
};

export default Archived;
