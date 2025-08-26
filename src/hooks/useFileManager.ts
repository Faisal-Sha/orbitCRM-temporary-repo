
import { useState, useMemo } from 'react';
import { FileItem, FileFilters } from '@/types/files';

// Mock data for demonstration
const MOCK_FILES: FileItem[] = [
  {
    id: '1',
    name: 'Patient_Assessment_Form.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    lastModified: '2024-01-15',
    uploader: 'Dr. Sarah Johnson',
    associatedClient: 'John Smith',
    associatedRecord: 'Assessment-001',
    tags: ['assessment', 'intake'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Treatment_Plan_Draft.docx',
    type: 'docx',
    size: '1.2 MB',
    uploadDate: '2024-01-14',
    lastModified: '2024-01-16',
    uploader: 'Dr. Michael Davis',
    associatedClient: 'Jane Doe',
    tags: ['treatment-plan', 'draft'],
    status: 'active'
  },
  {
    id: '3',
    name: 'Insurance_Documentation.pdf',
    type: 'pdf',
    size: '854 KB',
    uploadDate: '2024-01-10',
    lastModified: '2024-01-10',
    uploader: 'Admin Staff',
    associatedClient: 'Robert Wilson',
    tags: ['insurance', 'billing'],
    status: 'archived'
  },
  {
    id: '4',
    name: 'Session_Notes_Template.txt',
    type: 'txt',
    size: '12 KB',
    uploadDate: '2024-01-12',
    lastModified: '2024-01-13',
    uploader: 'Dr. Sarah Johnson',
    tags: ['template', 'notes'],
    status: 'active'
  },
  {
    id: '5',
    name: 'Client_Photo.jpg',
    type: 'jpg',
    size: '345 KB',
    uploadDate: '2024-01-08',
    lastModified: '2024-01-08',
    uploader: 'Reception',
    associatedClient: 'Emma Thompson',
    tags: ['photo', 'identification'],
    status: 'archived'
  }
];

export const useFileManager = () => {
  const [files, setFiles] = useState<FileItem[]>(MOCK_FILES);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [filters, setFilters] = useState<FileFilters>({
    search: '',
    type: '',
    uploader: '',
    dateRange: { start: '', end: '' },
    tags: [],
    client: ''
  });

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = !filters.search || 
        file.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        file.associatedClient?.toLowerCase().includes(filters.search.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesType = !filters.type || file.type === filters.type;
      const matchesUploader = !filters.uploader || file.uploader === filters.uploader;
      const matchesClient = !filters.client || file.associatedClient === filters.client;
      
      return matchesSearch && matchesType && matchesUploader && matchesClient;
    });
  }, [files, filters]);

  const archiveFiles = (fileIds: string[]) => {
    setFiles(prev => prev.map(file => 
      fileIds.includes(file.id) ? { ...file, status: 'archived' } : file
    ));
    setSelectedFiles([]);
  };

  const restoreFiles = (fileIds: string[]) => {
    setFiles(prev => prev.map(file => 
      fileIds.includes(file.id) ? { ...file, status: 'active' } : file
    ));
    setSelectedFiles([]);
  };

  const deleteFiles = (fileIds: string[]) => {
    setFiles(prev => prev.filter(file => !fileIds.includes(file.id)));
    setSelectedFiles([]);
  };

  const renameFile = (fileId: string, newName: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, name: newName } : file
    ));
  };

  const addFile = (newFile: Omit<FileItem, 'id'>) => {
    const file: FileItem = {
      ...newFile,
      id: Date.now().toString(),
    };
    setFiles(prev => [file, ...prev]);
  };

  return {
    files: filteredFiles,
    selectedFiles,
    setSelectedFiles,
    filters,
    setFilters,
    archiveFiles,
    restoreFiles,
    deleteFiles,
    renameFile,
    addFile
  };
};
