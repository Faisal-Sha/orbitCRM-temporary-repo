
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Edit, 
  Play, 
  Pause, 
  Copy, 
  Archive, 
  Trash2, 
  Calendar,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { AutomationActionMenu } from './AutomationActionMenu';
import { AutomationDeleteDialog } from './AutomationDeleteDialog';
import { format } from 'date-fns';

interface Automation {
  id: string;
  title: string;
  status: 'Draft' | 'Published' | 'Archived';
  author: string;
  lastModified: Date;
  totalSteps: number;
  createdDate: Date;
}

// Dummy data
const dummyAutomations: Automation[] = [
  {
    id: '1',
    title: 'Welcome Series Email Campaign',
    status: 'Published',
    author: 'John Smith',
    lastModified: new Date('2024-01-15'),
    totalSteps: 5,
    createdDate: new Date('2024-01-10')
  },
  {
    id: '2',
    title: 'Lead Nurturing SMS Sequence',
    status: 'Draft',
    author: 'Sarah Johnson',
    lastModified: new Date('2024-01-14'),
    totalSteps: 8,
    createdDate: new Date('2024-01-05')
  },
  {
    id: '3',
    title: 'Appointment Reminder System',
    status: 'Published',
    author: 'Mike Wilson',
    lastModified: new Date('2024-01-13'),
    totalSteps: 3,
    createdDate: new Date('2024-01-01')
  },
  {
    id: '4',
    title: 'Customer Onboarding Flow',
    status: 'Archived',
    author: 'Emily Davis',
    lastModified: new Date('2023-12-20'),
    totalSteps: 12,
    createdDate: new Date('2023-12-15')
  },
  {
    id: '5',
    title: 'Re-engagement Campaign',
    status: 'Published',
    author: 'Alex Brown',
    lastModified: new Date('2024-01-12'),
    totalSteps: 6,
    createdDate: new Date('2024-01-08')
  },
  // Add more dummy data
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 6}`,
    title: `Automation Workflow ${i + 6}`,
    status: ['Draft', 'Published', 'Archived'][Math.floor(Math.random() * 3)] as 'Draft' | 'Published' | 'Archived',
    author: ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'Alex Brown'][Math.floor(Math.random() * 5)],
    lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    totalSteps: Math.floor(Math.random() * 15) + 1,
    createdDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
  }))
];

export const AutomationManagementList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [automations, setAutomations] = useState<Automation[]>(dummyAutomations);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [automationToDelete, setAutomationToDelete] = useState<Automation | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const getActiveAutomations = () => automations.filter(a => a.status !== 'Archived');
  const getArchivedAutomations = () => automations.filter(a => a.status === 'Archived');

  const filterAutomations = (automationList: Automation[]) => {
    return automationList.filter(automation => {
      const matchesSearch = automation.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || automation.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const handleEdit = (automation: Automation) => {
    window.open('/automation/create', '_blank');
  };

  const handleToggleStatus = (automation: Automation) => {
    setAutomations(prev => prev.map(a => 
      a.id === automation.id 
        ? { ...a, status: a.status === 'Published' ? 'Draft' : 'Published' }
        : a
    ));
  };

  const handleDuplicate = (automation: Automation) => {
    const newAutomation: Automation = {
      ...automation,
      id: Date.now().toString(),
      title: `${automation.title} (Copy)`,
      status: 'Draft',
      lastModified: new Date(),
      createdDate: new Date()
    };
    setAutomations(prev => [newAutomation, ...prev]);
  };

  const handleArchive = (automation: Automation) => {
    setAutomations(prev => prev.map(a => 
      a.id === automation.id 
        ? { ...a, status: 'Archived' as const, lastModified: new Date() }
        : a
    ));
  };

  const handleDelete = (automation: Automation) => {
    setAutomationToDelete(automation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (automationToDelete) {
      setAutomations(prev => prev.filter(a => a.id !== automationToDelete.id));
      setDeleteDialogOpen(false);
      setAutomationToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Published': 'default',
      'Draft': 'secondary',
      'Archived': 'outline'
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {status}
      </Badge>
    );
  };

  const AutomationCard = ({ automation, showArchive = true }: { automation: Automation; showArchive?: boolean }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold">{automation.title}</h3>
              {getStatusBadge(automation.status)}
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>By {automation.author}</span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Modified {format(automation.lastModified, 'MMM d, yyyy')}
              </span>
              <span>{automation.totalSteps} steps</span>
            </div>
          </div>
          
          <AutomationActionMenu
            automation={automation}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onDuplicate={handleDuplicate}
            onArchive={showArchive ? handleArchive : undefined}
            onDelete={handleDelete}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search automations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active ({getActiveAutomations().length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({getArchivedAutomations().length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="space-y-4">
            {filterAutomations(getActiveAutomations()).length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No active automations found.</p>
                </CardContent>
              </Card>
            ) : (
              filterAutomations(getActiveAutomations()).map(automation => (
                <AutomationCard key={automation.id} automation={automation} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="archived" className="space-y-4">
          <div className="space-y-4">
            {filterAutomations(getArchivedAutomations()).length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No archived automations found.</p>
                </CardContent>
              </Card>
            ) : (
              filterAutomations(getArchivedAutomations()).map(automation => (
                <AutomationCard key={automation.id} automation={automation} showArchive={false} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AutomationDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        automationTitle={automationToDelete?.title || ''}
      />
    </div>
  );
};
