
import React, { useState } from 'react';
import AuditTable from '@/components/audit/AuditTable';
import AuditFilters from '@/components/audit/AuditFilters';
import AuditDetailModal from '@/components/audit/AuditDetailModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { History } from 'lucide-react';

const DataModificationLog = () => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Dummy data for Data Modification Log
  const dataModificationData = [
    {
      timestamp: '2024-01-15 14:30:22',
      userId: 'USR001',
      userName: 'Dr. Sarah Johnson',
      userRole: 'Therapist',
      clientId: 'CLT001',
      entityType: 'Contact',
      entityId: 'CNT123',
      fieldName: 'Phone Number',
      oldValue: '(555) 123-4567',
      newValue: '(555) 987-6543',
      ipAddress: '192.168.1.100',
      modificationType: 'Manual'
    },
    {
      timestamp: '2024-01-15 14:25:10',
      userId: 'USR002',
      userName: 'Admin User',
      userRole: 'Administrator',
      clientId: 'CLT002',
      entityType: 'Appointment',
      entityId: 'APT456',
      fieldName: 'Status',
      oldValue: 'Scheduled',
      newValue: 'Completed',
      ipAddress: '192.168.1.105',
      modificationType: 'System'
    },
    {
      timestamp: '2024-01-15 14:20:33',
      userId: 'USR003',
      userName: 'John Smith',
      userRole: 'Case Manager',
      clientId: 'CLT003',
      entityType: 'Assessment',
      entityId: 'ASS789',
      fieldName: 'Risk Level',
      oldValue: 'Medium',
      newValue: 'Low',
      ipAddress: '192.168.1.102',
      modificationType: 'Manual'
    },
    {
      timestamp: '2024-01-15 14:15:44',
      userId: 'SYSTEM',
      userName: 'Automation System',
      userRole: 'System',
      clientId: 'CLT001',
      entityType: 'Task',
      entityId: 'TSK101',
      fieldName: 'Due Date',
      oldValue: '2024-01-20',
      newValue: '2024-01-25',
      ipAddress: 'N/A',
      modificationType: 'System'
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
        { value: 'USR003', label: 'John Smith' },
        { value: 'SYSTEM', label: 'Automation System' }
      ]
    },
    {
      key: 'entityType',
      label: 'Entity Type',
      type: 'select' as const,
      options: [
        { value: 'Contact', label: 'Contact' },
        { value: 'Appointment', label: 'Appointment' },
        { value: 'Assessment', label: 'Assessment' },
        { value: 'Task', label: 'Task' }
      ]
    },
    {
      key: 'client',
      label: 'Client',
      type: 'select' as const,
      options: [
        { value: 'CLT001', label: 'Mary Wilson' },
        { value: 'CLT002', label: 'Robert Davis' },
        { value: 'CLT003', label: 'Lisa Brown' }
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
      key: 'entityType', 
      label: 'Entity Type',
      render: (value: string) => <Badge variant="outline">{value}</Badge>
    },
    { key: 'fieldName', label: 'Field Changed', sortable: true },
    { key: 'oldValue', label: 'Old Value' },
    { key: 'newValue', label: 'New Value' },
    { 
      key: 'modificationType', 
      label: 'Type',
      render: (value: string) => (
        <Badge variant={value === 'System' ? 'secondary' : 'default'}>
          {value}
        </Badge>
      )
    }
  ];

  const handleRowClick = (row: any) => {
    setSelectedRow(row);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Data modification log is being exported to CSV format."
    });
  };

  const handleVersionHistory = (row: any) => {
    toast({
      title: "Version History",
      description: `Opening version history for ${row.entityType} ${row.entityId}`
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

  // Enhanced columns with version history action
  const enhancedColumns = [
    ...columns,
    {
      key: 'actions',
      label: 'Version History',
      render: (value: any, row: any) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleVersionHistory(row);
          }}
        >
          <History className="w-4 h-4" />
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
        title="Data Modification Log"
        columns={enhancedColumns}
        data={dataModificationData}
        onRowClick={handleRowClick}
        onExport={handleExport}
        exportLabel="Export Modification Log"
      />

      <AuditDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedRow}
        title="Data Modification Details"
      />
    </div>
  );
};

export default DataModificationLog;
