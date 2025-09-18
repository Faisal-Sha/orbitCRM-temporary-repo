import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditableDetailItem } from './GeneralTab';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useStaffTypes } from '@/hooks/useStaffTypes';

interface UserDataSectionProps {
  personId?: string;
}

export const UserDataSection: React.FC<UserDataSectionProps> = ({ personId }) => {
  const { data, loading: profileLoading, updateUserRole, updateStaffType } = useUserProfile(personId);
  const { roles, loading: rolesLoading } = useUserRoles();
  const { staffTypes, loading: staffTypesLoading } = useStaffTypes();
  const [editingField, setEditingField] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current assigned values
  const assignedRole = data?.userRoles?.[0]?.role_name || '';
  const assignedStaffType = data?.staffTypes?.[0]?.staff_type || '';

  // Get options for dropdowns
  const roleOptions = (roles || []).map(r => r.role_name).filter(Boolean);
  const staffTypeOptions = (staffTypes || []).map(s => s.staff_type).filter(Boolean);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setEditingField(null);
      }
    };
    if (editingField) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingField]);

  const handleRoleChange = async (value: string) => {
    await updateUserRole(value);
    setEditingField(null);
  };

  const handleStaffTypeChange = async (value: string) => {
    await updateStaffType(value);
    setEditingField(null);
  };

  // Determine if staff type should be shown (only if user role is "staff")
  const shouldShowStaffType = assignedRole?.toLowerCase() === 'staff';

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
        <CardTitle>User Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" ref={containerRef}>
          <EditableDetailItem
            icon={ShieldCheck}
            label="User Role"
            value={assignedRole || 'Not assigned'}
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
              value={assignedStaffType || 'Not assigned'}
              options={staffTypeOptions}
              isEditing={editingField === 'staffType'}
              onEdit={() => setEditingField('staffType')}
              onChange={handleStaffTypeChange}
              iconColor="text-green-500"
              loading={staffTypesLoading}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};