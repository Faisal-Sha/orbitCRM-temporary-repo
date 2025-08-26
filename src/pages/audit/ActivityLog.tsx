
import React, { useState } from 'react';
import AuditTable from '@/components/audit/AuditTable';
import AuditFilters from '@/components/audit/AuditFilters';
import AuditDetailModal from '@/components/audit/AuditDetailModal';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const ActivityLog = () => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Dummy data for Activity Log
  const activityData = [
    {
      timestamp: '2024-01-15 14:30:22',
      userId: 'USR001',
      userName: 'Dr. Sarah Johnson',
      userRole: 'Therapist',
      actionType: 'Task Created',
      entityId: 'TSK123',
      entityName: 'Follow-up Call',
      ipAddress: '192.168.1.100',
      deviceBrowser: 'Chrome 120.0 / Windows 10',
      actionMode: 'Manual',
      details: 'Created new follow-up task for client assessment'
    },
    {
      timestamp: '2024-01-15 14:25:10',
      userId: 'USR002',
      userName: 'Admin User',
      userRole: 'Administrator',
      actionType: 'Email Sent',
      entityId: 'EML456',
      entityName: 'Appointment Reminder',
      ipAddress: '192.168.1.105',
      deviceBrowser: 'Firefox 121.0 / macOS',
      actionMode: 'Automated',
      details: 'Automated appointment reminder sent to client'
    },
    {
      timestamp: '2024-01-15 14:20:33',
      userId: 'USR003',
      userName: 'John Smith',
      userRole: 'Case Manager',
      actionType: 'Client Record Updated',
      entityId: 'CLT789',
      entityName: 'Mary Wilson',
      ipAddress: '192.168.1.102',
      deviceBrowser: 'Chrome 120.0 / Windows 11',
      actionMode: 'Manual',
      details: 'Updated client contact information'
    },
    {
      timestamp: '2024-01-15 14:15:44',
      userId: 'USR001',
      userName: 'Dr. Sarah Johnson',
      userRole: 'Therapist',
      actionType: 'Progress Note Created',
      entityId: 'PN001',
      entityName: 'Session Notes - Week 3',
      ipAddress: '192.168.1.100',
      deviceBrowser: 'Chrome 120.0 / Windows 10',
      actionMode: 'Manual',
      details: 'Created progress note for therapy session'
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
      key: 'actionType',
      label: 'Action Type',
      type: 'select' as const,
      options: [
        { value: 'Task Created', label: 'Task Created' },
        { value: 'Email Sent', label: 'Email Sent' },
        { value: 'Client Record Updated', label: 'Client Record Updated' },
        { value: 'Progress Note Created', label: 'Progress Note Created' }
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
      key: 'actionType', 
      label: 'Action Type', 
      sortable: true,
      render: (value: string) => <Badge variant="outline">{value}</Badge>
    },
    { key: 'entityName', label: 'Entity', sortable: true },
    { key: 'ipAddress', label: 'IP Address' },
    { 
      key: 'actionMode', 
      label: 'Mode',
      render: (value: string) => (
        <Badge variant={value === 'Automated' ? 'secondary' : 'default'}>
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
      description: "Activity log is being exported to CSV format."
    });
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    // Implement filter logic here
    console.log(`Filter ${filterKey} changed to: ${value}`);
  };

  const handleClearFilters = () => {
    setSearchValue('');
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset."
    });
  };

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
        title="Activity Log"
        columns={columns}
        data={activityData}
        onRowClick={handleRowClick}
        onExport={handleExport}
        exportLabel="Export Activity Log"
      />

      <AuditDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedRow}
        title="Activity Log Details"
      />
    </div>
  );
};

export default ActivityLog;
