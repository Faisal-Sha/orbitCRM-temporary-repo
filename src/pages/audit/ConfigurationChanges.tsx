
import React, { useState } from 'react';
import AuditTable from '@/components/audit/AuditTable';
import AuditFilters from '@/components/audit/AuditFilters';
import AuditDetailModal from '@/components/audit/AuditDetailModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { FileText, Eye } from 'lucide-react';

const ConfigurationChanges = () => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Dummy data for Configuration Changes
  const configurationData = [
    {
      timestamp: '2024-01-15 14:30:22',
      userId: 'USR001',
      userName: 'Dr. Sarah Johnson',
      userRole: 'Administrator',
      configItem: 'Form Definition',
      itemName: 'Initial Assessment Form',
      action: 'Modified',
      details: 'Added new field: Emergency Contact',
      oldConfiguration: 'Fields: Name, DOB, Address, Phone',
      newConfiguration: 'Fields: Name, DOB, Address, Phone, Emergency Contact'
    },
    {
      timestamp: '2024-01-15 14:25:10',
      userId: 'USR002',
      userName: 'Admin User',
      userRole: 'System Admin',
      configItem: 'Automation Workflow',
      itemName: 'Appointment Reminders',
      action: 'Created',
      details: 'Created new automated reminder workflow',
      oldConfiguration: 'N/A',
      newConfiguration: 'Send email reminder 24 hours before appointment'
    },
    {
      timestamp: '2024-01-15 14:20:33',
      userId: 'USR003',
      userName: 'John Smith',
      userRole: 'Administrator',
      configItem: 'User Role',
      itemName: 'Therapist Role',
      action: 'Modified',
      details: 'Updated permissions for therapist role',
      oldConfiguration: 'Can view own clients only',
      newConfiguration: 'Can view own clients and team clients'
    },
    {
      timestamp: '2024-01-15 14:15:44',
      userId: 'USR001',
      userName: 'Dr. Sarah Johnson',
      userRole: 'Administrator',
      configItem: 'System Settings',
      itemName: 'Security Policy',
      action: 'Modified',
      details: 'Updated password requirements',
      oldConfiguration: 'Min 8 characters, 1 uppercase, 1 number',
      newConfiguration: 'Min 10 characters, 1 uppercase, 1 number, 1 special char'
    }
  ];

  const filters = [
    {
      key: 'user',
      label: 'User',
      type: 'select' as const,
      options: [
        { value: 'USR001', label: 'Dr. Sarah Johnson' },
        { value: 'USR002', label: 'Admin User' },
        { value: 'USR003', label: 'John Smith' }
      ]
    },
    {
      key: 'configItem',
      label: 'Configuration Item',
      type: 'select' as const,
      options: [
        { value: 'Form Definition', label: 'Form Definition' },
        { value: 'Automation Workflow', label: 'Automation Workflow' },
        { value: 'User Role', label: 'User Role' },
        { value: 'System Settings', label: 'System Settings' }
      ]
    },
    {
      key: 'action',
      label: 'Action',
      type: 'select' as const,
      options: [
        { value: 'Created', label: 'Created' },
        { value: 'Modified', label: 'Modified' },
        { value: 'Deleted', label: 'Deleted' }
      ]
    },
    {
      key: 'dateRange',
      label: 'Date Range',
      type: 'input' as const
    }
  ];

  const columns = [
    { key: 'timestamp', label: 'Timestamp', sortable: true },
    { key: 'userName', label: 'User', sortable: true },
    { key: 'userRole', label: 'Role', sortable: true },
    { 
      key: 'configItem', 
      label: 'Config Item',
      render: (value: string) => <Badge variant="outline">{value}</Badge>
    },
    { key: 'itemName', label: 'Item Name', sortable: true },
    { 
      key: 'action', 
      label: 'Action',
      render: (value: string) => {
        const variant = value === 'Created' ? 'default' : 
                      value === 'Modified' ? 'secondary' : 'destructive';
        return <Badge variant={variant}>{value}</Badge>;
      }
    }
  ];

  const handleRowClick = (row: any) => {
    setSelectedRow(row);
    setIsDetailModalOpen(true);
  };

  const handleCompareClick = (row: any) => {
    setSelectedRow(row);
    setIsCompareModalOpen(true);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Configuration changes log is being exported to CSV format."
    });
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    console.log(`Filter ${filterKey} changed to: ${value}`);
  };

  const handleClearFilters = () => {
    setSearchValue('');
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset."
    });
  };

  // Enhanced columns with compare action
  const enhancedColumns = [
    ...columns,
    {
      key: 'compare',
      label: 'Compare',
      render: (value: any, row: any) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleCompareClick(row);
          }}
          disabled={row.action === 'Created'}
        >
          <FileText className="w-4 h-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AuditFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      
      <AuditTable
        title="Configuration Changes"
        columns={enhancedColumns}
        data={configurationData}
        onRowClick={handleRowClick}
        onExport={handleExport}
        exportLabel="Export Configuration Changes"
      />

      <AuditDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedRow}
        title="Configuration Change Details"
      />

      {/* Compare Modal */}
      <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Configuration Comparison</DialogTitle>
          </DialogHeader>
          {selectedRow && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Before</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <pre className="text-sm text-red-800 whitespace-pre-wrap">
                      {selectedRow.oldConfiguration}
                    </pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">After</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <pre className="text-sm text-green-800 whitespace-pre-wrap">
                      {selectedRow.newConfiguration}
                    </pre>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p><strong>Change made by:</strong> {selectedRow.userName}</p>
                <p><strong>Date:</strong> {selectedRow.timestamp}</p>
                <p><strong>Details:</strong> {selectedRow.details}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfigurationChanges;
