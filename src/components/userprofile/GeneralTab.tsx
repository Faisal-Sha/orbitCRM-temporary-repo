import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Mail, Phone, MapPin, Facebook, Instagram, Pencil, X, User, Calendar, Briefcase, ShieldCheck,
  Home, Users, Heart, Languages, Plus, ExternalLink, Linkedin
} from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
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

// Debounce hook for autosave
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Enhanced Contact Information Section Component
const ContactInformationSection: React.FC<{ personId?: string }> = ({ personId }) => {
  const { 
    data,
    loading,
    updateContactField,
    updateContactAddress,
    deleteContactField,
    getAvailableContactFields,
    getCurrentContactFields 
  } = useUserProfile(personId);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [showAddField, setShowAddField] = useState(false);

  const handleEditField = (fieldKey: string) => {
    setEditingField(fieldKey);
  };

  const handleSaveField = async (fieldKey: string, value: string) => {
    if (fieldKey === 'address') {
      // Handle address as special case - need to parse components
      const addressParts = value.split(',').map(part => part.trim());
      const result = await updateContactAddress({
        address_line_1: addressParts[0] || '',
        address_line_2: addressParts[1] || '',
        city: addressParts[2] || '',
        state: addressParts[3] || '',
        zip_code: addressParts[4] || ''
      });
      if (result) setEditingField(null);
      return result;
    } else {
      const result = await updateContactField(fieldKey, value);
      if (result) setEditingField(null);
      return result;
    }
  };

  const handleDeleteField = async (fieldKey: string) => {
    const result = await deleteContactField(fieldKey);
    if (result) setEditingField(null);
    return result;
  };

  const handleAddField = (fieldKey: string) => {
    setShowAddField(false);
    setEditingField(fieldKey);
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading contact information...</div>;
  }

  const currentFields = getCurrentContactFields();
  const availableFields = getAvailableContactFields();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Contact Details</span>
        {availableFields.length > 0 && (
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAddField(!showAddField)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
            {showAddField && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border rounded-md shadow-md z-50">
                {availableFields.map((field) => (
                  <button
                    key={field.key}
                    className="w-full px-3 py-2 text-left hover:bg-muted text-sm"
                    onClick={() => handleAddField(field.key)}
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {currentFields.map((field) => (
          <EditableContactField
            key={field.key}
            field={field}
            isEditing={editingField === field.key}
            onEdit={() => handleEditField(field.key)}
            onSave={(value) => handleSaveField(field.key, value)}
            onDelete={() => handleDeleteField(field.key)}
          />
        ))}
        
        {/* Show empty field for new additions */}
        {editingField && !currentFields.find(f => f.key === editingField) && (
          <EditableContactField
            key={`new-${editingField}`}
            field={{
              key: editingField,
              label: availableFields.find(f => f.key === editingField)?.label || 'New Field',
              value: '',
              type: editingField.startsWith('url_') ? 'url' : 'text'
            }}
            isEditing={true}
            onEdit={() => {}}
            onSave={(value) => handleSaveField(editingField, value)}
            onDelete={() => handleDeleteField(editingField)}
          />
        )}
        
        {currentFields.length === 0 && !editingField && (
          <p className="text-sm text-muted-foreground py-4">No contact information available. Click "Add Field" to get started.</p>
        )}
      </div>
    </div>
  );
};

// Editable Contact Field Component
interface ContactFieldType {
  key: string;
  label: string;
  value: string;
  type: 'text' | 'url';
}

interface EditableContactFieldProps {
  field: ContactFieldType;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: string) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
}

const EditableContactField: React.FC<EditableContactFieldProps> = ({ 
  field, 
  isEditing, 
  onEdit, 
  onSave, 
  onDelete 
}) => {
  const [localValue, setLocalValue] = useState(field.value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebounce(localValue, 1000);
  
  useEffect(() => {
    setLocalValue(field.value);
  }, [field.value]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Auto-save when debounced value changes and we're editing
  useEffect(() => {
    if (isEditing && debouncedValue !== field.value && debouncedValue.trim() !== '') {
      handleSave(debouncedValue);
    }
  }, [debouncedValue, isEditing, field.value]);

  const handleSave = async (valueToSave: string) => {
    if (isSaving) return;
    
    setIsSaving(true);
    if (valueToSave.trim() === '') {
      await onDelete();
    } else {
      await onSave(valueToSave.trim());
    }
    setIsSaving(false);
  };

  const handleBlur = () => {
    if (localValue.trim() === '') {
      handleSave('');
    } else if (localValue !== field.value) {
      handleSave(localValue);
    }
  };

  const getSocialIcon = (key: string) => {
    switch (key) {
      case 'url_facebook': return <Facebook className="h-4 w-4" />;
      case 'url_instagram': return <Instagram className="h-4 w-4" />;
      case 'url_linkedin': return <Linkedin className="h-4 w-4" />;
      case 'url_tiktok': return <FaTiktok className="h-4 w-4" />;
      default: return null;
    }
  };

  const truncateUrl = (url: string, maxLength = 30) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="flex items-center gap-3 group py-2 px-3 rounded-lg hover:bg-muted/50">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{field.label}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {field.type === 'url' && field.value && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={() => openUrl(field.value)}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
                {getSocialIcon(field.key) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => openUrl(field.value)}
                  >
                    {getSocialIcon(field.key)}
                  </Button>
                )}
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={onEdit}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {isEditing ? (
          <Input
            ref={inputRef}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            className="mt-1"
            disabled={isSaving}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        ) : (
          <div className="mt-1 text-sm">
            {field.type === 'url' && field.value ? (
              <span 
                className="text-primary cursor-pointer hover:underline"
                onClick={() => openUrl(field.value)}
              >
                {truncateUrl(field.value)}
              </span>
            ) : (
              field.value
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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

        {/* Contact Information - Enhanced Dynamic Section */}
        <SectionCard title="Contact Information">
          <ContactInformationSection personId={personId} />
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
