
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Eye, Copy, Share, Archive, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  id: string;
  title: string;
  lastModified: string;
  author: string;
  status: 'Draft' | 'Published';
  submissions: number;
  archived: boolean;
}

const dummyForms: FormData[] = [
  { id: '1', title: 'Customer Feedback Survey', lastModified: '2024-01-15', author: 'John Doe', status: 'Published', submissions: 245, archived: false },
  { id: '2', title: 'Employee Onboarding Form', lastModified: '2024-01-14', author: 'Jane Smith', status: 'Draft', submissions: 12, archived: false },
  { id: '3', title: 'Product Registration', lastModified: '2024-01-13', author: 'Mike Johnson', status: 'Published', submissions: 89, archived: false },
  { id: '4', title: 'Event Registration 2024', lastModified: '2024-01-12', author: 'Sarah Wilson', status: 'Published', submissions: 156, archived: false },
  { id: '5', title: 'Contact Us Form', lastModified: '2024-01-11', author: 'David Brown', status: 'Draft', submissions: 34, archived: false },
  { id: '6', title: 'Newsletter Signup', lastModified: '2024-01-10', author: 'Lisa Davis', status: 'Published', submissions: 678, archived: false },
  { id: '7', title: 'Bug Report Form', lastModified: '2024-01-09', author: 'Tom Anderson', status: 'Draft', submissions: 23, archived: false },
  { id: '8', title: 'Job Application Form', lastModified: '2024-01-08', author: 'Emily Taylor', status: 'Published', submissions: 67, archived: false },
  { id: '9', title: 'Quiz: Product Knowledge', lastModified: '2024-01-07', author: 'Robert Lee', status: 'Published', submissions: 123, archived: false },
  { id: '10', title: 'Customer Support Ticket', lastModified: '2024-01-06', author: 'Anna White', status: 'Draft', submissions: 45, archived: false },
  { id: '11', title: 'Training Evaluation', lastModified: '2023-12-15', author: 'Chris Green', status: 'Published', submissions: 234, archived: true },
  { id: '12', title: 'Old Survey Form', lastModified: '2023-12-10', author: 'Mark Thompson', status: 'Published', submissions: 567, archived: true },
  { id: '13', title: 'Deprecated Contact Form', lastModified: '2023-12-05', author: 'Rachel Adams', status: 'Draft', submissions: 12, archived: true },
  { id: '14', title: 'Legacy Registration', lastModified: '2023-11-20', author: 'Kevin Miller', status: 'Published', submissions: 89, archived: true },
  { id: '15', title: 'Old Feedback Form', lastModified: '2023-11-15', author: 'Jessica Clark', status: 'Draft', submissions: 34, archived: true },
  { id: '16', title: 'Partnership Application', lastModified: '2024-01-05', author: 'Michael Scott', status: 'Published', submissions: 78, archived: false },
  { id: '17', title: 'Volunteer Registration', lastModified: '2024-01-04', author: 'Pam Beesly', status: 'Draft', submissions: 19, archived: false },
  { id: '18', title: 'Workshop Feedback', lastModified: '2024-01-03', author: 'Jim Halpert', status: 'Published', submissions: 145, archived: false },
  { id: '19', title: 'Course Enrollment', lastModified: '2024-01-02', author: 'Dwight Schrute', status: 'Published', submissions: 267, archived: false },
  { id: '20', title: 'Maintenance Request', lastModified: '2024-01-01', author: 'Stanley Hudson', status: 'Draft', submissions: 8, archived: false },
  { id: '21', title: 'Health Assessment', lastModified: '2023-12-30', author: 'Phyllis Vance', status: 'Published', submissions: 189, archived: false },
  { id: '22', title: 'Equipment Checkout', lastModified: '2023-12-29', author: 'Oscar Martinez', status: 'Draft', submissions: 56, archived: false },
  { id: '23', title: 'Travel Request Form', lastModified: '2023-12-28', author: 'Angela Martin', status: 'Published', submissions: 123, archived: false },
  { id: '24', title: 'Performance Review', lastModified: '2023-12-27', author: 'Toby Flenderson', status: 'Draft', submissions: 34, archived: false },
  { id: '25', title: 'Project Proposal', lastModified: '2023-12-26', author: 'Ryan Howard', status: 'Published', submissions: 67, archived: false },
];

export const FormManagementList: React.FC = () => {
  const [forms, setForms] = useState<FormData[]>(dummyForms);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('active');
  const [shareFormId, setShareFormId] = useState<string | null>(null);
  const [deleteFormId, setDeleteFormId] = useState<string | null>(null);

  const itemsPerPage = 20;

  const filteredForms = forms.filter(form => {
    const matchesArchived = activeTab === 'active' ? !form.archived : form.archived;
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || form.status.toLowerCase() === statusFilter;
    const matchesDate = (!dateFilter.start || form.lastModified >= dateFilter.start) &&
                       (!dateFilter.end || form.lastModified <= dateFilter.end);
    
    return matchesArchived && matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedForms = filteredForms.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusToggle = (formId: string) => {
    setForms(forms.map(form => 
      form.id === formId 
        ? { ...form, status: form.status === 'Published' ? 'Draft' : 'Published' as 'Draft' | 'Published' }
        : form
    ));
    toast.success('Form status updated successfully!');
  };

  const handleDuplicate = (formId: string) => {
    const originalForm = forms.find(f => f.id === formId);
    if (originalForm) {
      const newForm: FormData = {
        ...originalForm,
        id: (forms.length + 1).toString(),
        title: `${originalForm.title} (Copy)`,
        status: 'Draft',
        submissions: 0,
        lastModified: new Date().toISOString().split('T')[0],
        archived: false
      };
      setForms([...forms, newForm]);
      toast.success('Form duplicated successfully!');
    }
  };

  const handleArchive = (formId: string) => {
    setForms(forms.map(form => 
      form.id === formId ? { ...form, archived: !form.archived } : form
    ));
    toast.success(`Form ${forms.find(f => f.id === formId)?.archived ? 'unarchived' : 'archived'} successfully!`);
  };

  const handleDelete = () => {
    if (deleteFormId) {
      setForms(forms.filter(form => form.id !== deleteFormId));
      setDeleteFormId(null);
      toast.success('Form deleted successfully!');
    }
  };

  const generateShareUrl = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    return `${window.location.origin}/forms/preview/${form?.title.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const generateEmbedCode = (formId: string) => {
    return `<iframe src="${generateShareUrl(formId)}" width="100%" height="600" frameborder="0"></iframe>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'Published' ? 'default' : 'secondary'}>
        {status}
      </Badge>
    );
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
                placeholder="Search forms by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
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

          {/* Forms Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedForms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.title}</TableCell>
                    <TableCell>{form.lastModified}</TableCell>
                    <TableCell>{form.author}</TableCell>
                    <TableCell>{getStatusBadge(form.status)}</TableCell>
                    <TableCell>{form.submissions}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => window.open('/forms/create', '_blank')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => window.open('/forms/submissions', '_blank')}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => window.open('/forms/preview', '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleStatusToggle(form.id)}
                          className={form.status === 'Published' ? 'text-orange-600' : 'text-green-600'}
                        >
                          {form.status === 'Published' ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDuplicate(form.id)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setShareFormId(form.id)}>
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleArchive(form.id)}>
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setDeleteFormId(form.id)}
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

      {/* Share Modal */}
      <Dialog open={!!shareFormId} onOpenChange={() => setShareFormId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL Link</Label>
              <div className="flex space-x-2">
                <Input
                  value={shareFormId ? generateShareUrl(shareFormId) : ''}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareFormId && copyToClipboard(generateShareUrl(shareFormId))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>HTML Embed Code</Label>
              <div className="flex space-x-2">
                <Textarea
                  value={shareFormId ? generateEmbedCode(shareFormId) : ''}
                  readOnly
                  rows={3}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareFormId && copyToClipboard(generateEmbedCode(shareFormId))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteFormId} onOpenChange={() => setDeleteFormId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to permanently delete this form? This action cannot be undone.</p>
            <p className="text-sm text-muted-foreground">
              Form: <strong>{forms.find(f => f.id === deleteFormId)?.title}</strong>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteFormId(null)}>
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
