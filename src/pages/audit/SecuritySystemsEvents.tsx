
import React, { useState } from 'react';
import AuditTable from '@/components/audit/AuditTable';
import AuditFilters from '@/components/audit/AuditFilters';
import AuditDetailModal from '@/components/audit/AuditDetailModal';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, Shield } from 'lucide-react';

const SecuritySystemsEvents = () => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Dummy data for Security & Systems Events
  const securityEventsData = [
    {
      timestamp: '2024-01-15 14:30:22',
      eventType: 'Login Success',
      userId: 'USR001',
      userName: 'Dr. Sarah Johnson',
      ipAddress: '192.168.1.100',
      details: 'Successful login from Chrome browser',
      riskLevel: 'Low',
      location: 'New York, NY'
    },
    {
      timestamp: '2024-01-15 14:25:10',
      eventType: 'Login Failed',
      userId: 'USR999',
      userName: 'Unknown User',
      ipAddress: '192.168.1.999',
      details: 'Failed login attempt - Invalid credentials',
      riskLevel: 'High',
      location: 'Unknown'
    },
    {
      timestamp: '2024-01-15 14:20:33',
      eventType: 'Password Change',
      userId: 'USR002',
      userName: 'Admin User',
      ipAddress: '192.168.1.105',
      details: 'Password successfully changed',
      riskLevel: 'Low',
      location: 'Los Angeles, CA'
    },
    {
      timestamp: '2024-01-15 14:15:44',
      eventType: 'Multiple Failed Logins',
      userId: 'USR003',
      userName: 'John Smith',
      ipAddress: '192.168.1.102',
      details: 'Account locked due to multiple failed login attempts',
      riskLevel: 'High',
      location: 'Chicago, IL'
    },
    {
      timestamp: '2024-01-15 14:10:55',
      eventType: 'Session Timeout',
      userId: 'USR004',
      userName: 'Jane Doe',
      ipAddress: '192.168.1.103',
      details: 'User session expired due to inactivity',
      riskLevel: 'Medium',
      location: 'Miami, FL'
    }
  ];

  const filters = [
    {
      key: 'eventType',
      label: 'Event Type',
      type: 'select' as const,
      options: [
        { value: 'Login Success', label: 'Login Success' },
        { value: 'Login Failed', label: 'Login Failed' },
        { value: 'Password Change', label: 'Password Change' },
        { value: 'Multiple Failed Logins', label: 'Multiple Failed Logins' },
        { value: 'Session Timeout', label: 'Session Timeout' }
      ]
    },
    {
      key: 'user',
      label: 'User',
      type: 'select' as const,
      options: [
        { value: 'USR001', label: 'Dr. Sarah Johnson' },
        { value: 'USR002', label: 'Admin User' },
        { value: 'USR003', label: 'John Smith' },
        { value: 'USR004', label: 'Jane Doe' }
      ]
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      type: 'select' as const,
      options: [
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' }
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
    { 
      key: 'eventType', 
      label: 'Event Type',
      render: (value: string) => {
        const variant = value.includes('Failed') || value.includes('Multiple') ? 'destructive' : 
                      value.includes('Success') ? 'default' : 'secondary';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    { key: 'userName', label: 'User', sortable: true },
    { key: 'ipAddress', label: 'IP Address' },
    { key: 'location', label: 'Location' },
    { 
      key: 'riskLevel', 
      label: 'Risk Level',
      render: (value: string) => {
        const variant = value === 'High' ? 'destructive' : 
                      value === 'Medium' ? 'secondary' : 'default';
        return <Badge variant={variant}>{value}</Badge>;
      }
    }
  ];

  const handleRowClick = (row: any) => {
    setSelectedRow(row);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Security events log is being exported to CSV format."
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

  // Count high-risk events for alert
  const highRiskEvents = securityEventsData.filter(event => event.riskLevel === 'High').length;

  return (
    <div className="space-y-6">
      {highRiskEvents > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Alert:</strong> {highRiskEvents} high-risk security events detected. 
            Please review immediately.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Security Monitoring
        </h3>
        <p className="text-sm text-blue-700">
          This log monitors all security-related events and system operations. 
          Anomalies are automatically flagged for review.
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
        title="Security & Systems Events"
        columns={columns}
        data={securityEventsData}
        onRowClick={handleRowClick}
        onExport={handleExport}
        exportLabel="Export Security Events"
      />

      <AuditDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedRow}
        title="Security Event Details"
      />
    </div>
  );
};

export default SecuritySystemsEvents;
