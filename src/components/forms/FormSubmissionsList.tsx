
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Trash2, Archive, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface SubmissionData {
  id: string;
  formName: string;
  submissionDate: string;
  submitterEmail: string;
  submitterName: string;
  archived: boolean;
  data: Record<string, any>;
  metadata: {
    ipAddress: string;
    browser: string;
    device: string;
    source: string;
  };
  quizScore?: number;
  quizResult?: string;
  pdfUrl?: string;
}

const dummySubmissions: SubmissionData[] = [
  {
    id: 'SUB-001',
    formName: 'Customer Feedback Survey',
    submissionDate: '2024-01-15 14:30:22',
    submitterEmail: 'john.doe@email.com',
    submitterName: 'John Doe',
    archived: false,
    data: {
      rating: '5',
      feedback: 'Excellent service!',
      recommend: 'Yes',
      signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAADIC...'
    },
    metadata: {
      ipAddress: '192.168.1.100',
      browser: 'Chrome 120.0',
      device: 'Desktop',
      source: 'Direct Link'
    }
  },
  {
    id: 'SUB-002',
    formName: 'Employee Onboarding Form',
    submissionDate: '2024-01-14 09:15:45',
    submitterEmail: 'jane.smith@company.com',
    submitterName: 'Jane Smith',
    archived: false,
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      department: 'Marketing',
      startDate: '2024-01-20',
      documents: ['resume.pdf', 'id-copy.jpg']
    },
    metadata: {
      ipAddress: '10.0.0.15',
      browser: 'Safari 17.1',
      device: 'MacBook',
      source: 'Email Link'
    }
  },
  {
    id: 'SUB-003',
    formName: 'Quiz: Product Knowledge',
    submissionDate: '2024-01-13 16:45:12',
    submitterEmail: 'mike.johnson@test.com',
    submitterName: 'Mike Johnson',
    archived: false,
    data: {
      question1: 'Option A',
      question2: 'Option B',
      question3: 'Option C'
    },
    metadata: {
      ipAddress: '203.0.113.42',
      browser: 'Firefox 121.0',
      device: 'Mobile',
      source: 'Embedded Widget'
    },
    quizScore: 85,
    quizResult: 'Excellent knowledge!',
    pdfUrl: '/dummy-certificate.pdf'
  },
  // Add more dummy submissions...
  ...Array.from({ length: 22 }, (_, i) => ({
    id: `SUB-${String(i + 4).padStart(3, '0')}`,
    formName: ['Contact Us Form', 'Newsletter Signup', 'Bug Report Form', 'Job Application Form'][i % 4],
    submissionDate: `2024-01-${String(13 - Math.floor(i / 2)).padStart(2, '0')} ${String(10 + i % 14).padStart(2, '0')}:${String(15 + i % 45).padStart(2, '0')}:${String(10 + i % 50).padStart(2, '0')}`,
    submitterEmail: `user${i + 4}@example.com`,
    submitterName: `User ${i + 4}`,
    archived: i > 20,
    data: {
      field1: `Sample data ${i + 4}`,
      field2: `More data ${i + 4}`,
      field3: i % 2 === 0 ? 'Yes' : 'No'
    },
    metadata: {
      ipAddress: `192.168.1.${100 + i}`,
      browser: ['Chrome', 'Safari', 'Firefox', 'Edge'][i % 4] + ' 120.0',
      device: ['Desktop', 'Mobile', 'Tablet'][i % 3],
      source: ['Direct Link', 'Email Link', 'Embedded Widget'][i % 3]
    }
  }))
];

export const FormSubmissionsList: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionData[]>(dummySubmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('active');
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [deleteSubmissionId, setDeleteSubmissionId] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<string>('csv');

  const itemsPerPage = 20;

  const filteredSubmissions = submissions.filter(submission => {
    const matchesArchived = activeTab === 'active' ? !submission.archived : submission.archived;
    const matchesSearch = 
      submission.formName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.submitterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.submitterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(submission.data).some(value => 
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesDate = (!dateFilter.start || submission.submissionDate >= dateFilter.start) &&
                       (!dateFilter.end || submission.submissionDate <= dateFilter.end);
    
    return matchesArchived && matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectSubmission = (submissionId: string) => {
    setSelectedSubmissions(prev => 
      prev.includes(submissionId) 
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubmissions.length === paginatedSubmissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(paginatedSubmissions.map(s => s.id));
    }
  };

  const handleArchive = (submissionId: string) => {
    setSubmissions(submissions.map(submission => 
      submission.id === submissionId ? { ...submission, archived: !submission.archived } : submission
    ));
    toast.success(`Submission ${submissions.find(s => s.id === submissionId)?.archived ? 'unarchived' : 'archived'} successfully!`);
  };

  const handleDelete = () => {
    if (deleteSubmissionId) {
      setSubmissions(submissions.filter(submission => submission.id !== deleteSubmissionId));
      setDeleteSubmissionId(null);
      toast.success('Submission deleted successfully!');
    }
  };

  const handleBulkDelete = () => {
    setSubmissions(submissions.filter(submission => !selectedSubmissions.includes(submission.id)));
    setSelectedSubmissions([]);
    toast.success(`${selectedSubmissions.length} submissions deleted successfully!`);
  };

  const handleExport = () => {
    const dataToExport = selectedSubmissions.length > 0 
      ? submissions.filter(s => selectedSubmissions.includes(s.id))
      : filteredSubmissions;
    
    console.log(`Exporting ${dataToExport.length} submissions as ${exportFormat.toUpperCase()}`);
    toast.success(`Export initiated for ${dataToExport.length} submissions!`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="Start date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                className="w-40"
              />
              <Input
                type="date"
                placeholder="End date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                className="w-40"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {selectedSubmissions.length > 0 && (
                <>
                  <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                    Delete Selected ({selectedSubmissions.length})
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport}>Export Data</Button>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedSubmissions.length === paginatedSubmissions.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Form Name</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Submitter</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedSubmissions.includes(submission.id)}
                        onCheckedChange={() => handleSelectSubmission(submission.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{submission.id}</TableCell>
                    <TableCell className="font-medium">{submission.formName}</TableCell>
                    <TableCell>{formatDate(submission.submissionDate)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{submission.submitterName}</div>
                        <div className="text-sm text-muted-foreground">{submission.submitterEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleArchive(submission.id)}>
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setDeleteSubmissionId(submission.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>
      </Tabs>

      {/* Detailed Submission View Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details - {selectedSubmission?.id}</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Form Name</h4>
                  <p>{selectedSubmission.formName}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Submission Date</h4>
                  <p>{formatDate(selectedSubmission.submissionDate)}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Submitter Name</h4>
                  <p>{selectedSubmission.submitterName}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p>{selectedSubmission.submitterEmail}</p>
                </div>
              </div>

              {/* Quiz Results */}
              {selectedSubmission.quizScore !== undefined && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Quiz Results</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <p className="font-medium">{selectedSubmission.quizScore}/100</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Result:</span>
                      <p className="font-medium">{selectedSubmission.quizResult}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF Access */}
              {selectedSubmission.pdfUrl && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Generated PDF</h4>
                  <Button variant="outline" onClick={() => window.open(selectedSubmission.pdfUrl, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View/Download PDF
                  </Button>
                </div>
              )}

              {/* Form Data */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4">Form Data</h4>
                <div className="space-y-3">
                  {Object.entries(selectedSubmission.data).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-4">
                      <div className="font-medium text-sm text-muted-foreground">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </div>
                      <div className="col-span-2">
                        {key === 'signature' && typeof value === 'string' && value.startsWith('data:image/') ? (
                          <img 
                            src={value} 
                            alt="Signature" 
                            className="max-w-xs max-h-24 border rounded"
                          />
                        ) : Array.isArray(value) ? (
                          <div className="flex flex-wrap gap-1">
                            {value.map((item, idx) => (
                              <Badge key={idx} variant="secondary">{item}</Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="break-words">{String(value)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4">Submission Metadata</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">IP Address:</span>
                    <p className="font-mono text-sm">{selectedSubmission.metadata.ipAddress}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Browser:</span>
                    <p className="text-sm">{selectedSubmission.metadata.browser}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Device:</span>
                    <p className="text-sm">{selectedSubmission.metadata.device}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Source:</span>
                    <p className="text-sm">{selectedSubmission.metadata.source}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteSubmissionId} onOpenChange={() => setDeleteSubmissionId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to permanently delete this submission? This action cannot be undone.</p>
            <p className="text-sm text-muted-foreground">
              Submission ID: <strong>{deleteSubmissionId}</strong>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteSubmissionId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
