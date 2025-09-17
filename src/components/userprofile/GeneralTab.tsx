import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Mail, Phone, MapPin, Facebook, Instagram, Pencil, X, User, Calendar, Briefcase, ShieldCheck,
  Home, Users, Heart, Languages
} from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useStaffTypes } from '@/hooks/useStaffTypes';

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  iconColor?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value, iconColor = "text-muted-foreground" }) => (
  <div className="flex items-start space-x-3">
    <Icon className={`h-5 w-5 mt-0.5 ${iconColor}`} />
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-500">{value}</p>
    </div>
  </div>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <Card className={`mb-6 ${className}`}>
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

interface EditableDetailItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  options: string[];
  isEditing: boolean;
  onEdit: () => void;
  onChange: (value: string) => void;
  iconColor?: string;
  disabled?: boolean;
  loading?: boolean;
}

const EditableDetailItem: React.FC<EditableDetailItemProps> = ({
  icon: Icon,
  label,
  value,
  options,
  isEditing,
  onEdit,
  onChange,
  iconColor = "text-muted-foreground",
  disabled = false,
  loading = false,
}) => (
  <div className="flex items-start space-x-3 group">
    <Icon className={`h-5 w-5 mt-0.5 ${iconColor}`} />
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      {isEditing ? (
        <Select value={value} onValueChange={onChange} disabled={disabled || loading}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder={loading ? 'Loading…' : 'Select'} />
          </SelectTrigger>
          <SelectContent>
            {loading ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">Loading…</div>
            ) : options.length > 0 ? (
              options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-muted-foreground">No options</div>
            )}
          </SelectContent>
        </Select>
      ) : (
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">{value || 'Not provided'}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onEdit}
            disabled={disabled}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  </div>
);

interface GeneralTabProps {
  personId?: string;
  hideUpcomingAppointments?: boolean;
  showApplicationInfo?: boolean;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ personId, hideUpcomingAppointments = false }) => {

  console.log("personId", personId);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1) Profile aggregate (assigned values)
  const { data, loading: profileLoading, error } = useUserProfile(personId);

  // 2) Catalogs for dropdowns (full options)
  const { roles, loading: rolesLoading } = useUserRoles();
  const { staffTypes, loading: staffTypesLoading } = useStaffTypes();

  // Assigned (from aggregate)
  const assignedRole = data?.userRoles?.[0]?.role_name || '';
  const assignedStaffType = data?.staffTypes?.[0]?.staff_type || '';

  // Options (full catalogs)
  const roleOptions = (roles || []).map(r => r.role_name).filter(Boolean);
  const staffTypeOptions = (staffTypes || []).map(s => s.staff_type).filter(Boolean);

  // Local state; initialize from assigned or fallback to first available option
  const [userRole, setUserRole] = useState<string>(assignedRole || roleOptions[0] || 'Not provided');
  const [staffType, setStaffType] = useState<string>(assignedStaffType || staffTypeOptions[0] || 'Not provided');
  const [editingField, setEditingField] = useState<string | null>(null);

  // Sync when profile/catalogs change
  useEffect(() => {
    const newRole = assignedRole || roleOptions[0] || 'Not provided';
    const newStaff = assignedStaffType || staffTypeOptions[0] || 'Not provided';
    setUserRole(newRole);
    setStaffType(newStaff);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedRole, assignedStaffType, rolesLoading, staffTypesLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setEditingField(null);
      }
    };
    if (editingField) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingField]);

  const dummyAppointments = [
    { date: "Jun 18, 2025", time: "11:00 AM", clinician: "Dr. Emily Clark" },
    { date: "Jun 22, 2025", time: "3:30 PM", clinician: "Dr. Mike Evans" },
  ];

  const NA = (v?: string | null) => (v && String(v).trim()) || 'Not provided';
  const socialBadge = (url?: string | null) =>
    url ? <Badge variant="secondary">Connected</Badge> : <Badge variant="outline">Not connected</Badge>;

  return (
    <ScrollArea className="h-full">
      <div>
        {(profileLoading) && (
          <SectionCard title="Loading Profile">
            <p className="text-sm text-muted-foreground">Fetching user profile…</p>
          </SectionCard>
        )}
        {error && (
          <SectionCard title="Error">
            <p className="text-sm text-red-600">{error}</p>
          </SectionCard>
        )}

        {!hideUpcomingAppointments && (
          <SectionCard title="Upcoming Appointments">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Clinician</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyAppointments.map((appt, index) => (
                  <TableRow key={index}>
                    <TableCell>{appt.date}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.clinician}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" className="hover:bg-blue-100">
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-red-100">
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        )}

        {/* Contact Information */}
        <SectionCard title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <DetailItem icon={Mail} label="Email" value={NA(data?.contactInfo?.email)} iconColor="text-blue-500" />
            <DetailItem icon={Phone} label="Phone" value={NA(data?.contactInfo?.phone)} iconColor="text-green-500" />
            <DetailItem icon={MapPin} label="Address" value={NA(data?.contactInfo?.address)} iconColor="text-red-500" />
            <DetailItem icon={Facebook} label="Facebook" value={socialBadge(data?.contactInfo?.url_facebook)} iconColor="text-blue-600" />
            <DetailItem icon={Instagram} label="Instagram" value={socialBadge(data?.contactInfo?.url_instagram)} iconColor="text-pink-500" />
          </div>
        </SectionCard>

        {/* Additional Information */}
        <SectionCard title="Additional Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <DetailItem icon={Calendar} label="Date of Birth" value={NA(data?.additionalInfo?.dob_display)} />
            <DetailItem icon={Briefcase} label="Service" value="Therapy" />
            <DetailItem icon={User} label="SSN" value={NA(data?.additionalInfo?.ssn_masked)} />
            <DetailItem icon={Home} label="Living Situation" value={NA(data?.additionalInfo?.living_situation)} />
            <DetailItem icon={Users} label="Referred By" value={NA(data?.referralInfo?.referred_by_name)} />
            <DetailItem icon={User} label="Gender Identity" value={NA(data?.additionalInfo?.gender_identity)} />
            <DetailItem
              icon={ShieldCheck}
              label="Insurance ID"
              value={
                <>
                  {NA(data?.additionalInfo?.insurance_number)}
                  <span className="text-xs text-gray-400 ml-2">
                    (Exp: {NA(data?.additionalInfo?.insurance_expiry_display)})
                  </span>
                </>
              }
            />
            <DetailItem icon={Heart} label="Marital Status" value={NA(data?.additionalInfo?.marital_status)} />
            <DetailItem icon={Languages} label="Preferred Language" value={NA(data?.leadInfo?.preferred_language)} />
          </div>
        </SectionCard>

        {/* Emergency Contact */}
        <SectionCard title="Emergency Contact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <DetailItem icon={User} label="Name" value={NA(data?.emergencyContact?.full_name)} />
            <DetailItem icon={Mail} label="Email" value={NA(data?.emergencyContact?.email)} />
            <DetailItem icon={Phone} label="Phone" value={NA(data?.emergencyContact?.phone_number)} />
            <DetailItem icon={Users} label="Relationship" value={NA(data?.emergencyContact?.relationship)} />
          </div>
        </SectionCard>

        {/* User Data — options from full catalogs; selected from assigned values */}
        <SectionCard title="User Data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" ref={containerRef}>
            <EditableDetailItem
              icon={ShieldCheck}
              label="User Role"
              value={userRole}
              options={roleOptions}
              isEditing={editingField === 'userRole'}
              onEdit={() => setEditingField('userRole')}
              onChange={(value) => {
                setUserRole(value);
                setEditingField(null);
                // TODO (later step): persist to people_assign_user_role via RPC
              }}
              iconColor="text-blue-500"
              loading={rolesLoading}
            />
            <EditableDetailItem
              icon={Briefcase}
              label="Staff Type"
              value={staffType}
              options={staffTypeOptions}
              isEditing={editingField === 'staffType'}
              onEdit={() => setEditingField('staffType')}
              onChange={(value) => {
                setStaffType(value);
                setEditingField(null);
                // TODO (later step): persist to people_assign_staff_type via RPC
              }}
              iconColor="text-green-500"
              loading={staffTypesLoading}
            />
          </div>
        </SectionCard>
      </div>
    </ScrollArea>
  );
};

export default GeneralTab;
