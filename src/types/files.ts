
export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  lastModified: string;
  uploader: string;
  associatedClient?: string;
  associatedRecord?: string;
  tags: string[];
  status: 'active' | 'archived';
  url?: string;
}

export interface FileFilters {
  search: string;
  type: string;
  uploader: string;
  dateRange: {
    start: string;
    end: string;
  };
  tags: string[];
  client: string;
}
