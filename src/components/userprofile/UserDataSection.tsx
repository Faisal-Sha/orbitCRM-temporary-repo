import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ShieldCheck, Briefcase, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditableDetailItem } from './GeneralTab';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useStaffTypes } from '@/hooks/useStaffTypes';

interface UserDataSectionProps {
  personId?: string;
}

const DEFAULT_STATUS_OPTIONS = ['Active', 'Inactive'];

const ROLE_STATUS_OPTIONS: Record<string, string[]> = {
  owner: ['Active', 'Inactive'],
  admin: ['Active', 'Inactive'],
  general: ['Active', 'Inactive'],
  lead: ['Unqualified', 'Unsubscribed', 'Doubtful'],
  client: ['Active', 'On Hold', 'Discharged', 'Deceased'],
  staff: ['Active', 'On Leave', 'Terminated'],
};

// Helper function to validate if a string is a valid UUID
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const UserDataSection: React.FC<UserDataSectionProps> = ({ personId }) => {
  // Only call useUserProfile if personId is a valid UUID
  const shouldFetchProfile = personId && isValidUUID(personId);
  const { data, loading: profileLoading, updateUserRole, updateStaffType, updateStatus } = useUserProfile(shouldFetchProfile ? personId : undefined);
  const { roles, loading: rolesLoading } = useUserRoles();
  const { staffTypes, loading: staffTypesLoading } = useStaffTypes();
  const [editingField, setEditingField] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current assigned values
  const assignedRole = data?.userRoles?.[0]?.role_name || '';
  const assignedStaffType = data?.staffTypes?.[0]?.staff_type || '';
  const currentStatus = data?.personalInfo?.status || '';

  // Get options for dropdowns
  const roleOptions = (roles || []).map(r => r.role_name).filter(Boolean);
  const staffTypeOptions = (staffTypes || []).map(s => s.staff_type).filter(Boolean);

  const normalizedRole = assignedRole?.toLowerCase() || '';
  const statusOptions = useMemo(() => {
    const baseOptions = ROLE_STATUS_OPTIONS[normalizedRole] || DEFAULT_STATUS_OPTIONS;
    const deduped = Array.from(new Set(baseOptions));

    if (currentStatus && !deduped.some(option => option.toLowerCase() === currentStatus.toLowerCase())) {
      return [currentStatus, ...deduped];
    }

    return deduped;
  }, [normalizedRole, currentStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Ignore clicks inside Radix Select portal/content so selection works
      if (
        target.closest('[data-radix-popper-content-wrapper]') ||
        target.closest('[role="listbox"]')
      ) {
        return;
      }

      if (containerRef.current && !containerRef.current.contains(target)) {
        setEditingField(null);
      }
    };
    if (editingField) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingField]);

  const handleRoleChange = async (value: string) => {
    if (!shouldFetchProfile) return; // Don't attempt updates for dummy data
    try {
      const success = await updateUserRole(value);
      if (success) {
        setEditingField(null);
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
      // Don't close edit mode if update failed
    }
  };

  const handleStaffTypeChange = async (value: string) => {
    if (!shouldFetchProfile) return; // Don't attempt updates for dummy data
    try {
      const success = await updateStaffType(value);
      if (success) {
        setEditingField(null);
      }
    } catch (error) {
      console.error('Failed to update staff type:', error);
      // Don't close edit mode if update failed
    }
  };

  const handleStatusChange = async (value: string) => {
    if (!shouldFetchProfile) return; // Don't attempt updates for dummy data
    try {
      const success = await updateStatus(value);
      if (success) {
        setEditingField(null);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      // Don't close edit mode if update failed
    }
  };

  // Determine if staff type should be shown (only if user role is "staff")
  const shouldShowStaffType = assignedRole?.toLowerCase() === 'staff';
  // Status should be shown if a user role is assigned
  const shouldShowStatus = !!assignedRole;

  // Handle dummy data or invalid UUID
  if (!shouldFetchProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">User Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">User Role</p>
                <p className="text-sm text-muted-foreground">Preview mode - no data available</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <UserCheck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-sm text-muted-foreground">Preview mode - no data available</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (profileLoading && !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading user data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">User Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" ref={containerRef}>
          <EditableDetailItem
            icon={ShieldCheck}
            label="User Role"
            value={assignedRole || ''}
            displayValue={assignedRole || 'Not assigned'}
            options={roleOptions}
            isEditing={editingField === 'userRole'}
            onEdit={() => setEditingField('userRole')}
            onChange={handleRoleChange}
            iconColor="text-blue-500"
            loading={rolesLoading}
          />
          
          {shouldShowStaffType && (
            <EditableDetailItem
              icon={Briefcase}
              label="Staff Type"
              value={assignedStaffType || ''}
              displayValue={assignedStaffType || 'Not assigned'}
              options={staffTypeOptions}
              isEditing={editingField === 'staffType'}
              onEdit={() => setEditingField('staffType')}
              onChange={handleStaffTypeChange}
              iconColor="text-green-500"
              loading={staffTypesLoading}
            />
          )}

          {shouldShowStatus && (
            <EditableDetailItem
              icon={UserCheck}
              label="Status"
              value={currentStatus || ''}
              displayValue={currentStatus || 'Not assigned'}
              options={statusOptions}
              isEditing={editingField === 'status'}
              onEdit={() => setEditingField('status')}
              onChange={handleStatusChange}
              iconColor="text-purple-500"
              loading={profileLoading}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
