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
  Home, Users, Heart, Languages, Plus, ExternalLink, Linkedin, Shield, FileText, CreditCard,
  Globe, UserPlus, Edit, Loader2, Smartphone, MessageCircle, Send, Camera, PinIcon, Video, Youtube, Twitter, UserCheck
} from 'lucide-react';
import { useUserProfile } from "@/hooks/useUserProfile";
import { useOrganizationCountry } from "@/hooks/useOrganizationCountry";
import { validateEmail, validatePhoneNumber } from "@/utils/validation";
import { formatPhoneNumber } from "@/utils/phoneFormatting";

// Format date nicely
const formatDateNice = (iso?: string | null) => {
  if (!iso) return 'Not provided';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Not provided';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="w-5 h-5 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">{value}</p>
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
  icon: React.ReactNode;
  label: string;
  value: string;
  options: string[];
  isEditing: boolean;
  onEdit: () => void;
  onChange: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

const EditableDetailItem: React.FC<EditableDetailItemProps> = ({
  icon,
  label,
  value,
  options,
  isEditing,
  onEdit,
  onChange,
  disabled = false,
  loading = false,
}) => (
  <div className="flex items-start space-x-3 group">
    <div className="w-5 h-5 flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium">{label}</p>
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
          <p className="text-sm text-muted-foreground">{value || 'Not provided'}</p>
          <button
            onClick={onEdit}
            className="p-1 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
            disabled={disabled}
          >
            <Edit className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  </div>
);

// Custom hook for click outside detection
const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
};

interface ValidationState {
  isValid: boolean;
  error: string;
}

interface EditableAdditionalFieldProps {
  field: { key: string; label: string; value: string; type: string; options?: string[] };
  personId: string;
  onUpdate: () => void;
  onDelete: () => void;
}

const EditableAdditionalField = ({ field, personId, onUpdate, onDelete }: EditableAdditionalFieldProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(field.value || '');
  const [originalValue, setOriginalValue] = useState(field.value || '');
  const [validation, setValidation] = useState<ValidationState>({ isValid: true, error: '' });

  const { updateAdditionalField, deleteAdditionalField } = useUserProfile(personId);

  useEffect(() => {
    setValue(field.value || '');
    setOriginalValue(field.value || '');
  }, [field.value]);

  const validateField = (val: string): ValidationState => {
    if (!val.trim() && originalValue.trim()) {
      return { isValid: false, error: 'Field cannot be empty' };
    }
    return { isValid: true, error: '' };
  };

  const handleEdit = () => {
    setEditing(true);
    setOriginalValue(value);
  };

  const handleBlur = async () => {
    if (!editing) return;
    
    const validationResult = validateField(value);
    setValidation(validationResult);
    
    if (!validationResult.isValid) {
      return;
    }

    // Only save if value actually changed
    if (value !== originalValue) {
      try {
        await updateAdditionalField(field.key, value);
        onUpdate();
      } catch (error) {
        console.error('Failed to save field:', error);
      }
    }
    
    setEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteAdditionalField(field.key);
      onDelete();
    } catch (error) {
      console.error('Failed to delete field:', error);
    }
  };

  return (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-5 h-5 flex items-center justify-center">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-medium">{field.label}</span>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              {editing ? (
                <div className="flex flex-col">
                  {field.type === 'select' && field.options ? (
                    <select
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onBlur={handleBlur}
                      className="text-sm text-muted-foreground bg-transparent border-b border-border focus:outline-none focus:border-primary"
                      autoFocus
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'date' ? 'date' : 'text'}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onBlur={handleBlur}
                      className="text-sm text-muted-foreground bg-transparent border-b border-border focus:outline-none focus:border-primary"
                      autoFocus
                    />
                  )}
                  {!validation.isValid && (
                    <span className="text-xs text-destructive mt-1">{validation.error}</span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {field.type === 'date' && field.value 
                    ? formatDateNice(field.value)
                    : field.value || `Add ${field.label.toLowerCase()}`
                  }
                </span>
              )}
            </div>
            <button
              onClick={handleEdit}
              className="p-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Edit className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDelete}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const AdditionalInformationSection = ({ personId }: { personId: string }) => {
  const { getAvailableAdditionalFields, getCurrentAdditionalFields, refetch } = useUserProfile(personId);
  const [availableFields, setAvailableFields] = useState<any[]>([]);
  const [currentFields, setCurrentFields] = useState<any[]>([]);
  const [showAddField, setShowAddField] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setShowAddField(false));

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    const available = await getAvailableAdditionalFields();
    const current = await getCurrentAdditionalFields();
    
    // Filter out "referred_by_name" from available fields
    const filteredAvailable = (available || []).filter(field => field.key !== 'referred_by_name');
    
    setAvailableFields(filteredAvailable);
    setCurrentFields(current || []);
  };

  const handleAddField = async (field: any) => {
    setShowAddField(false);
    // Add field with empty value to trigger editing
    await refetch();
    loadFields();
  };

  return (
    <div className="space-y-4">
      {currentFields.map((field, index) => (
        <EditableAdditionalField
          key={field.key}
          field={field}
          personId={personId}
          onUpdate={loadFields}
          onDelete={loadFields}
        />
      ))}
      
      {availableFields.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowAddField(!showAddField)}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Field
          </button>
          
          {showAddField && (
            <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 min-w-[200px]">
              {availableFields.map(field => (
                <div
                  key={field.key}
                  onClick={() => handleAddField(field)}
                  className="px-3 py-2 text-sm hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                >
                  {field.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface EditableContactFieldProps {
  field: { key: string; label: string; value: string; type: string };
  personId: string;
  onUpdate: () => void;
  onDelete: () => void;
}

interface AddressEditingState {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipcode: string;
}

const EditableContactField = ({ field, personId, onUpdate, onDelete }: EditableContactFieldProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(field.value || '');
  const [originalValue, setOriginalValue] = useState(field.value || '');
  const [validation, setValidation] = useState<ValidationState>({ isValid: true, error: '' });
  const [addressData, setAddressData] = useState<AddressEditingState>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipcode: ''
  });

  const { updateContactField, updateContactAddress, deleteContactField } = useUserProfile(personId);
  const { country } = useOrganizationCountry();

  useEffect(() => {
    setValue(field.value || '');
    setOriginalValue(field.value || '');
    
    // Parse address if it's an address field
    if (field.key === 'address' && field.value) {
      parseAddressValue(field.value);
    }
  }, [field.value, field.key]);

  const parseAddressValue = (addressValue: string) => {
    // Simple parsing - split by commas and assign to fields
    const parts = addressValue.split(',').map(part => part.trim());
    setAddressData({
      addressLine1: parts[0] || '',
      addressLine2: parts[1] || '',
      city: parts[2] || '',
      state: parts[3] || '',
      zipcode: parts[4] || ''
    });
  };

  const validateField = (val: string): ValidationState => {
    if (field.key === 'email' || field.key === 'work_email') {
      if (val.trim() && !validateEmail(val)) {
        return { isValid: false, error: 'Please enter a valid email address' };
      }
    }
    
    if (field.key === 'phone' || field.key === 'phone_home') {
      if (val.trim() && !validatePhoneNumber(val, country)) {
        return { isValid: false, error: `Please enter a valid ${country} phone number` };
      }
    }
    
    return { isValid: true, error: '' };
  };

  const handleEdit = () => {
    setEditing(true);
    setOriginalValue(value);
  };

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    
    // Format phone numbers as user types
    if (field.key === 'phone' || field.key === 'phone_home') {
      const formatted = formatPhoneNumber(newValue, country);
      if (formatted !== newValue) {
        setValue(formatted);
        return;
      }
    }
  };

  const handleBlur = async () => {
    if (!editing) return;
    
    const validationResult = validateField(value);
    setValidation(validationResult);
    
    if (!validationResult.isValid) {
      return;
    }

    // Only save if value actually changed
    if (value !== originalValue) {
      try {
        if (field.key === 'address') {
          await handleAddressSave();
        } else {
          await updateContactField(field.key, value);
          onUpdate();
        }
      } catch (error) {
        console.error('Failed to save field:', error);
      }
    }
    
    setEditing(false);
  };

  const handleAddressBlur = async () => {
    if (!editing) return;
    
    try {
      await updateContactAddress({
        address_line_1: addressData.addressLine1,
        address_line_2: addressData.addressLine2,
        city: addressData.city,
        state: addressData.state,
        zip_code: addressData.zipcode
      });
      onUpdate();
      setEditing(false);
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleAddressSave = async () => {
    try {
      await updateContactAddress({
        address_line_1: addressData.addressLine1,
        address_line_2: addressData.addressLine2,
        city: addressData.city,
        state: addressData.state,
        zip_code: addressData.zipcode
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContactField(field.key);
      onDelete();
    } catch (error) {
      console.error('Failed to delete field:', error);
    }
  };

  const getIconForContactType = (key: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      email: <Mail className="w-4 h-4 text-muted-foreground" />,
      work_email: <Mail className="w-4 h-4 text-muted-foreground" />,
      phone: <Phone className="w-4 h-4 text-muted-foreground" />,
      phone_home: <Phone className="w-4 h-4 text-muted-foreground" />,
      address: <MapPin className="w-4 h-4 text-muted-foreground" />,
      facebook: <Facebook className="w-4 h-4 text-muted-foreground" />,
      instagram: <Instagram className="w-4 h-4 text-muted-foreground" />,
      linkedin: <Linkedin className="w-4 h-4 text-muted-foreground" />,
      website: <Globe className="w-4 h-4 text-muted-foreground" />
    };
    return iconMap[key] || <Mail className="w-4 h-4 text-muted-foreground" />;
  };

  const handleUrlClick = (url: string) => {
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      window.open(`https://${url}`, '_blank');
    } else if (url) {
      window.open(url, '_blank');
    }
  };

  const displayValue = field.type === 'url' && field.value && field.value.length > 30
    ? `${field.value.substring(0, 30)}...`
    : field.value;

  return (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-5 h-5 flex items-center justify-center">
          {getIconForContactType(field.key)}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-medium">{field.label}</span>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              {editing ? (
                <div className="flex flex-col">
                  {field.key === 'address' ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        value={addressData.addressLine1}
                        onChange={(e) => setAddressData({...addressData, addressLine1: e.target.value})}
                        onBlur={handleAddressBlur}
                        className="text-sm text-muted-foreground bg-transparent border-b border-border focus:outline-none focus:border-primary w-full"
                        autoFocus
                      />
                      <input
                        type="text"
                        placeholder="Address Line 2"
                        value={addressData.addressLine2}
                        onChange={(e) => setAddressData({...addressData, addressLine2: e.target.value})}
                        onBlur={handleAddressBlur}
                        className="text-sm text-muted-foreground bg-transparent border-b border-border focus:outline-none focus:border-primary w-full"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          value={addressData.city}
                          onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                          onBlur={handleAddressBlur}
                          className="text-sm text-muted-foreground bg-transparent border-b border-border focus:outline-none focus:border-primary flex-1"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={addressData.state}
                          onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                          onBlur={handleAddressBlur}
                          className="text-sm text-muted-foreground bg-transparent border-b border-border focus:outline-none focus:border-primary flex-1"
                        />
                        <input
                          type="text"
                          placeholder="Zip"
                          value={addressData.zipcode}
                          onChange={(e) => setAddressData({...addressData, zipcode: e.target.value})}
                          onBlur={handleAddressBlur}
                          className="text-sm text-muted-foreground bg-transparent border-b border-border focus:outline-none focus:border-primary flex-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={value}
                      onChange={(e) => handleValueChange(e.target.value)}
                      onBlur={handleBlur}
                      className="text-sm text-muted-foreground bg-transparent border-b border-border focus:outline-none focus:border-primary"
                      autoFocus
                    />
                  )}
                  {!validation.isValid && (
                    <span className="text-xs text-destructive mt-1">{validation.error}</span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {displayValue || `Add ${field.label.toLowerCase()}`}
                </span>
              )}
            </div>
            <button
              onClick={handleEdit}
              className="p-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Edit className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {field.type === 'url' && field.value && (
          <button
            onClick={() => handleUrlClick(field.value)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
        {field.type !== 'url' && field.value && (
          <button
            onClick={() => handleUrlClick(field.value)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <FileText className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ContactInformationSection = ({ personId }: { personId: string }) => {
  const { getAvailableContactFields, getCurrentContactFields, refetch } = useUserProfile(personId);
  const [availableFields, setAvailableFields] = useState<any[]>([]);
  const [currentFields, setCurrentFields] = useState<any[]>([]);
  const [showAddField, setShowAddField] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setShowAddField(false));

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    const available = await getAvailableContactFields();
    const current = await getCurrentContactFields();
    
    setAvailableFields(available || []);
    setCurrentFields(current || []);
  };

  const handleAddField = async (field: any) => {
    setShowAddField(false);
    // Add field with empty value to trigger editing
    await refetch();
    loadFields();
  };

  return (
    <div className="space-y-4">
      {currentFields.map((field, index) => (
        <EditableContactField
          key={field.key}
          field={field}
          personId={personId}
          onUpdate={loadFields}
          onDelete={loadFields}
        />
      ))}
      
      {availableFields.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowAddField(!showAddField)}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Field
          </button>
          
          {showAddField && (
            <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 min-w-[200px]">
              {availableFields.map(field => (
                <div
                  key={field.key}
                  onClick={() => handleAddField(field)}
                  className="px-3 py-2 text-sm hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                >
                  {field.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface GeneralTabProps {
  personId?: string;
  hideUpcomingAppointments?: boolean;
  showApplicationInfo?: boolean;
}

const GeneralTab = ({ personId, hideUpcomingAppointments = false }: GeneralTabProps) => {
  const { data, loading, error } = useUserProfile(personId);
  const [editing, setEditing] = useState<{[key: string]: boolean}>({});
  const [selectedValues, setSelectedValues] = useState<{[key: string]: any}>({});

  // Check if referral data exists
  const hasReferralData = data?.referralInfo?.referred_by_name;

  if (loading) {
    return (
      <ScrollArea className="h-full">
        <SectionCard title="Loading Profile">
          <p className="text-sm text-muted-foreground">Fetching user profile…</p>
        </SectionCard>
      </ScrollArea>
    );
  }

  if (error) {
    return (
      <ScrollArea className="h-full">
        <SectionCard title="Error">
          <p className="text-sm text-destructive">{error}</p>
        </SectionCard>
      </ScrollArea>
    );
  }

  const dummyAppointments = [
    { date: "Jun 18, 2025", time: "11:00 AM", clinician: "Dr. Emily Clark" },
    { date: "Jun 22, 2025", time: "3:30 PM", clinician: "Dr. Mike Evans" },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        {/* Upcoming Appointments */}
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
                        <Edit className="h-4 w-4 text-blue-500" />
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
          <ContactInformationSection personId={personId} />
        </SectionCard>

        {/* Additional Information */}
        <SectionCard title="Additional Information">
          <AdditionalInformationSection personId={personId} />
        </SectionCard>

        {/* Referral Information - Only show if data exists */}
        {hasReferralData && (
          <SectionCard title="Referral Information">
            <DetailItem
              icon={<UserCheck className="w-4 h-4 text-muted-foreground" />}
              label="Referred By"
              value={data.referralInfo.referred_by_name}
            />
          </SectionCard>
        )}

        {/* Emergency Contact */}
        <SectionCard title="Emergency Contact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <DetailItem 
              icon={<User className="w-4 h-4 text-muted-foreground" />} 
              label="Name" 
              value={data?.emergencyContact?.full_name || 'Not provided'} 
            />
            <DetailItem 
              icon={<Mail className="w-4 h-4 text-muted-foreground" />} 
              label="Email" 
              value={data?.emergencyContact?.email || 'Not provided'} 
            />
            <DetailItem 
              icon={<Phone className="w-4 h-4 text-muted-foreground" />} 
              label="Phone" 
              value={data?.emergencyContact?.phone_number || 'Not provided'} 
            />
            <DetailItem 
              icon={<Users className="w-4 h-4 text-muted-foreground" />} 
              label="Relationship" 
              value={data?.emergencyContact?.relationship || 'Not provided'} 
            />
          </div>
        </SectionCard>

        {/* User Data */}
        <SectionCard title="User Data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <DetailItem 
              icon={<ShieldCheck className="w-4 h-4 text-blue-500" />} 
              label="User Role" 
              value={data?.userRoles?.[0]?.role_name || 'Not provided'} 
            />
            <DetailItem 
              icon={<Briefcase className="w-4 h-4 text-green-500" />} 
              label="Staff Type" 
              value={data?.staffTypes?.[0]?.staff_type || 'Not provided'} 
            />
          </div>
        </SectionCard>
      </div>
    </ScrollArea>
  );
};

export default GeneralTab;