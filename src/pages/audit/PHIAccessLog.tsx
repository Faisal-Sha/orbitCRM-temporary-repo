
import React, { useState } from 'react';
import AuditTable from '@/components/audit/AuditTable';
import AuditFilters from '@/components/audit/AuditFilters';
import AuditDetailModal from '@/components/audit/AuditDetailModal';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const PHIAccessLog = () => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Dummy data for PHI Access Log
  const phiAccessData = [
    {
      timestamp: '2024-01-15 14:30:22',
      userId: 'USR001',
      userName: 'Dr. Sarah Johnson',
      userRole: 'Therapist',
      clientId: 'CLT001',
      clientName: 'Mary Wilson',
      phiAccessed: 'Progress Note ID 123',
      reasonForAccess: 'Regular therapy session review',
      phiType: 'Assessment',
      accessResult: 'Success',
      ipAddress: '192.168.1.100'
    },
    {
      timestamp: '2024-01-15 14:25:10',
      userId: 'USR003',
      userName: 'John Smith',
      userRole: 'Case Manager',
      clientId: 'CLT002',
      clientName: 'Robert Davis',
      phiAccessed: 'Client Profile View',
      reasonForAccess: 'Case management update',
      phiType: 'Contact Information',
      accessResult: 'Success',
      ipAddress: '192.168.1.102'
    },
    {
      timestamp: '2024-01-15 14:20:33',
      userId: 'USR004',
      userName: 'Jane Doe',
      userRole: 'Billing Staff',
      clientId: 'CLT003',
      clientName: 'Lisa Brown',
      phiAccessed: 'Insurance Information',
      reasonForAccess: 'Billing inquiry',
      phiType: 'Financial Record',
      accessResult: 'Success',
      ipAddress: '192.168.1.103'
    },
    {
      timestamp: '2024-01-15 14:15:44',
      userId: 'USR005',
      userName: 'Unauthorized User',
      userRole: 'Guest',
      clientId: 'CLT001',
      clientName: 'Mary Wilson',
      phiAccessed: 'Assessment Records',
      reasonForAccess: 'Unauthorized access attempt',
      phiType: 'Assessment',
      accessResult: 'Failed - Insufficient Permissions',
      ipAddress: '192.168.1.999'
    }
  ];

  const filters = [
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
      key: 'user',
      label: 'User',
      type: 'select' as const,
      options: [
        { value: 'USR001', label: 'Dr. Sarah Johnson' },
        { value: 'USR003', label: 'John Smith' },
        { value: 'USR004', label: 'Jane Doe' }
      ]
    },
    {
      key: 'phiType',
      label: 'PHI Type',
      type: 'select' as const,
      options: [
        { value: 'Assessment', label: 'Assessment' },
        { value: 'Contact Information', label: 'Contact Information' },
        { value: 'Financial Record', label: 'Financial Record' }
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
    { key: 'clientName', label: 'Client', sortable: true },
    { key: 'phiAccessed', label: 'PHI Accessed', sortable: true },
    { 
      key: 'phiType', 
      label: 'PHI Type',
      render: (value: string) => <Badge variant="outline">{value}</Badge>
    },
    { 
      key: 'accessResult', 
      label: 'Result',
      render: (value: string) => (
        <Badge variant={value.includes('Success') ? 'default' : 'destructive'}>
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
      description: "PHI Access log is being exported to CSV format."
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

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">HIPAA Compliance Notice</h3>
        <p className="text-sm text-yellow-700">
          This log tracks all Protected Health Information (PHI) access events. 
          All entries are immutable and maintained for compliance purposes.
        </p>
      </div>

      <AuditFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      
      <AuditTable
        title="PHI Access Log"
        columns={columns}
        data={phiAccessData}
        onRowClick={handleRowClick}
        onExport={handleExport}
        exportLabel="Export PHI Access Log"
      />

      <AuditDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedRow}
        title="PHI Access Log Details"
      />
    </div>
  );
};

export default PHIAccessLog;
