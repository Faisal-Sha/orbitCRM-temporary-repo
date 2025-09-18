import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Mail, Phone, MapPin, Facebook, Instagram, Pencil, X, User, Calendar, Briefcase, ShieldCheck,
  Home, Users, Heart, Languages, Plus, ExternalLink, Linkedin, Shield, FileText, CreditCard,
  Globe, UserPlus, Edit2, Loader2, Smartphone, Copy, Check
} from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useStaffTypes } from '@/hooks/useStaffTypes';
import { useOrganizationCountry } from '@/hooks/useOrganizationCountry';
import { validateEmail, validatePhoneNumber, getEmailValidationError, getPhoneValidationError } from '@/utils/validation';
import { formatPhoneNumber, getFormattedPhoneDisplay } from '@/utils/phoneFormatting';
import { supabase } from '@/integrations/supabase/client';
import { EmergencyContactSection } from './EmergencyContactSection';
import { UserDataSection } from './UserDataSection';

// Format date nicely
const formatDateNice = (iso?: string | null) => {
  if (!iso) return 'Not provided';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Not provided';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

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
// Additional Information Section Component
const AdditionalInformationSection: React.FC<{ personId?: string }> = ({ personId }) => {
  const { 
    getCurrentAdditionalFields, 
    getAvailableAdditionalFields, 
    updateAdditionalField, 
    deleteAdditionalField,
    loading,
    data 
  } = useUserProfile(personId);
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showAddField, setShowAddField] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentFields = getCurrentAdditionalFields();
  const availableFields = getAvailableAdditionalFields().filter(field => field.key !== 'referred_by_name');

  // Add click-outside behavior for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddField(false);
      }
    };
    
    if (showAddField) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAddField]);

  const handleAddField = (fieldKey: string) => {
    setEditingField(fieldKey);
    setShowAddField(false);
  };

  if (loading) {
    return (
      <SectionCard title="Additional Information">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Additional Information">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentFields.map((field) => (
            <EditableAdditionalField
              key={field.key}
              field={field}
              isEditing={editingField === field.key}
              onEdit={() => setEditingField(field.key)}
              onSave={async (value: string) => {
                if (!value.trim()) {
                  const success = await deleteAdditionalField(field.key);
                  if (success) setEditingField(null);
                  return success;
                } else {
                  const success = await updateAdditionalField(field.key, value);
                  if (success) setEditingField(null);
                  return success;
                }
              }}
              onDelete={async () => {
                const success = await deleteAdditionalField(field.key);
                if (success) setEditingField(null);
                return success;
              }}
            />
          ))}
          
          {/* Add Field for new additional field */}
          {editingField && !currentFields.find(f => f.key === editingField) && (
            <EditableAdditionalField
              key={editingField}
              field={{
                key: editingField,
                label: availableFields.find(f => f.key === editingField)?.label || editingField,
                value: '',
                type: availableFields.find(f => f.key === editingField)?.type || 'text'
              }}
              isEditing={true}
              onEdit={() => {}}
              onSave={async (value: string) => {
                if (!value.trim()) {
                  setEditingField(null);
                  return true;
                }
                const success = await updateAdditionalField(editingField, value);
                if (success) setEditingField(null);
                return success;
              }}
              onDelete={async () => {
                setEditingField(null);
                return true;
              }}
            />
          )}
        </div>

        {/* Add Field Button and Dropdown */}
        {availableFields.length > 0 && !editingField && (
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              onClick={() => setShowAddField(!showAddField)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
            
            {showAddField && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-md shadow-lg z-50">
                <div className="p-2">
                  {availableFields.map((field) => (
                    <button
                      key={field.key}
                      onClick={() => handleAddField(field.key)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-sm"
                    >
                      {field.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Show Referred By field as read-only if data exists */}
        <ReferredByField personId={personId} />
      </div>
    </SectionCard>
  );
};

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add click-outside behavior for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddField(false);
      }
    };
    
    if (showAddField) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAddField]);

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
    return (
      <SectionCard title="Contact Information">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </SectionCard>
    );
  }

  const currentFields = getCurrentContactFields();
  const availableFields = getAvailableContactFields().filter(field => field.key !== 'referred_by_name');

  return (
    <SectionCard title="Contact Information">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Add Field Button and Dropdown */}
        {availableFields.length > 0 && !editingField && (
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              onClick={() => setShowAddField(!showAddField)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
            
            {showAddField && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-md shadow-lg z-50">
                <div className="p-2">
                  {availableFields.map((field) => (
                    <button
                      key={field.key}
                      onClick={() => handleAddField(field.key)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-sm"
                    >
                      {field.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentFields.length === 0 && !editingField && (
          <p className="text-sm text-muted-foreground py-4">No contact information available. Click "Add Field" to get started.</p>
        )}
      </div>
    </SectionCard>
  );
};

// Editable Contact Field Component
export interface ContactFieldType {
  key: string;
  label: string;
  value: string;
  type: 'text' | 'url' | 'select';
}

export interface EditableContactFieldProps {
  field: ContactFieldType;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: string) => Promise<boolean>;
  onDelete?: () => Promise<boolean>;
  onCancel?: () => void;
  country?: string;
}

// Additional Information Field Component
const EditableAdditionalField: React.FC<{
  field: { key: string; label: string; value: string; type: 'text' | 'date' | 'select' };
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: string) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
}> = ({ field, isEditing, onEdit, onSave, onDelete }) => {
  const [value, setValue] = useState(field.value);
  const [loading, setLoading] = useState(false);
  const [originalValue] = useState(field.value);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setValue(field.value);
  }, [field.value]);

  useEffect(() => {
    if (isEditing && (inputRef.current || selectRef.current)) {
      if (inputRef.current) inputRef.current.focus();
      if (selectRef.current) selectRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async (saveValue: string) => {
    setLoading(true);
    await onSave(saveValue);
    setLoading(false);
  };

  const handleBlur = () => {
    // Only save if value has actually changed
    if (value !== originalValue) {
      handleSave(value);
    } else {
      // If no changes were made, just exit editing mode without saving
      onEdit(); // This will close the editing mode
    }
  };

  const formatDisplayValue = (val: string, type: string) => {
    if (!val || val === 'N/A') return val;
    
    // SSN Masking
    if (field.key === 'ssn_number' && val.length >= 4) {
      return `***-**-${val.slice(-4)}`;
    }
    
    // NPI Number Masking
    if (field.key === 'npi_number' && val.length >= 4) {
      return `****-****-${val.slice(-4)}`;
    }
    
    // Insurance Number Masking
    if (field.key === 'insurance_number' && val.length >= 4) {
      return `****-****-${val.slice(-4)}`;
    }
    
    // Date formatting
    if (type === 'date') {
      return formatDateNice(val);
    }
    
    return val;
  };

  const getFieldIcon = (key: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      date_of_birth: Calendar,
      ssn_number: Shield,
      npi_number: FileText,
      insurance_provider: CreditCard,
      insurance_number: CreditCard,
      insurance_expiration_date: CreditCard,
      gender_identity: User,
      ethnicity_identity: Users,
      marital_status: Heart,
      living_situation: Home,
      preferred_language: Globe,
      referred_by_name: UserPlus,
    };
    return iconMap[key] || FileText;
  };

  const getSelectOptions = (key: string): string[] => {
    const optionsMap: { [key: string]: string[] } = {
      gender_identity: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],
      ethnicity_identity: ['White', 'Black or African American', 'Hispanic or Latino', 'Asian', 'Native American', 'Pacific Islander', 'Other', 'Prefer not to say'],
      marital_status: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Domestic Partnership'],
      living_situation: ['Independent', 'With Family', 'Assisted Living', 'Nursing Home', 'Group Home', 'Other'],
      preferred_language: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Other'],
    };
    return optionsMap[key] || [];
  };

  const IconComponent = getFieldIcon(field.key);
  const iconColor = 'text-primary';

  // Copy to clipboard functionality
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Check if tooltip should be shown (exclude sensitive fields)
  const shouldShowTooltip = !['ssn_number', 'npi_number', 'insurance_number'].includes(field.key);

  if (!isEditing) {
    const displayValue = formatDisplayValue(field.value, field.type);
    
    return (
      <TooltipProvider>
        <div className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <div className={`p-2 rounded-full bg-muted`}>
            <IconComponent className={`w-4 h-4 ${iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{field.label}</p>
            {shouldShowTooltip ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-muted-foreground truncate cursor-pointer">
                    {displayValue}
                  </p>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black border border-gray-200 shadow-lg max-w-xs p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="break-all">{field.value}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                      onClick={() => handleCopy(field.value)}
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <p className="text-sm text-muted-foreground truncate">
                {displayValue}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 hover:bg-muted"
            onClick={onEdit}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
      <div className={`p-2 rounded-full bg-muted`}>
        <IconComponent className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground mb-1">{field.label}</p>
        {field.type === 'select' ? (
          <select
            ref={selectRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            className="w-full px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
            disabled={loading}
          >
            <option value="">Select {field.label}</option>
            {getSelectOptions(field.key).map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            ref={inputRef}
            type={field.type === 'date' ? 'date' : 'text'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            className="w-full px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled={loading}
          />
        )}
      </div>
      {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
    </div>
  );
};

const EditableContactField: React.FC<EditableContactFieldProps> = ({
  field, 
  isEditing, 
  onEdit, 
  onSave, 
  onDelete 
}) => {
  const [localValue, setLocalValue] = useState(field.value);
  const [isSaving, setIsSaving] = useState(false);
  const [originalValue] = useState(field.value);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { country } = useOrganizationCountry();
  
  // Address component states for multi-field editing
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  useEffect(() => {
    setLocalValue(field.value);
    
    // Parse address fields if this is an address field
    if (field.key === 'address' && field.value && field.value !== 'Not provided') {
      const parts = field.value.split(', ').map(part => part.trim());
      setAddressLine1(parts[0] || '');
      setAddressLine2(parts[1] || '');
      setCity(parts[2] || '');
      setState(parts[3] || '');
      setZipCode(parts[4] || '');
    }
  }, [field.value, field.key]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Validation on blur only - don't validate while typing

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

  const handleAddressSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    // Combine address parts
    const addressParts = [addressLine1, addressLine2, city, state, zipCode]
      .map(part => part.trim())
      .filter(Boolean);
    
    if (addressParts.length === 0) {
      await onDelete();
    } else {
      await onSave(addressParts.join(', '));
    }
    setIsSaving(false);
  };

  const handleBlur = () => {
    // Validate on blur
    let error = null;
    if (localValue && localValue.trim()) {
      if (field.key === 'email' || field.key === 'work_email') {
        error = getEmailValidationError(localValue);
      } else if (field.key === 'phone' || field.key === 'phone_home') {
        error = getPhoneValidationError(localValue, country);
      }
    }
    
    setValidationError(error);
    
    // Only save if value has actually changed and there are no validation errors
    if (localValue !== originalValue && !error) {
      handleSave(localValue);
    } else if (localValue === originalValue) {
      // If no changes were made, just exit editing mode without saving
      setValidationError(null);
      onEdit(); // Close editing mode
    }
  };

  const handleAddressBlur = () => {
    // Save address when any address field loses focus
    const newAddress = [addressLine1, addressLine2, city, state, zipCode]
      .map(part => part.trim())
      .filter(Boolean)
      .join(', ');
    
    const originalAddress = field.value === 'Not provided' ? '' : field.value;
    
    if (newAddress !== originalAddress) {
      handleAddressSave();
    }
  };

  const handlePhoneChange = (value: string) => {
    // Auto-format phone number as user types
    if (field.key === 'phone' || field.key === 'phone_home') {
      const formatted = formatPhoneNumber(value, country);
      setLocalValue(formatted);
    } else {
      setLocalValue(value);
    }
  };

  const getContactIcon = (key: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      email: Mail,
      work_email: Mail,
      phone: Phone,
      phone_home: Smartphone,
      address: MapPin,
      url_facebook: Facebook,
      url_instagram: Instagram,
      url_linkedin: Linkedin,
      url_tiktok: FaTiktok,
    };
    return iconMap[key] || Mail;
  };

  const truncateUrl = (url: string, maxLength = 30) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const IconComponent = getContactIcon(field.key);
  const iconColor = 'text-primary';

  // Copy to clipboard functionality
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!isEditing) {
    const displayValue = field.type === 'url' && field.value ? truncateUrl(field.value) : 
                        field.key === 'phone' || field.key === 'phone_home' ? getFormattedPhoneDisplay(field.value, country) : 
                        field.value;
    
    return (
      <TooltipProvider>
        <div className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <div className={`p-2 rounded-full bg-muted`}>
            <IconComponent className={`w-4 h-4 ${iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{field.label}</p>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-muted-foreground truncate flex-1 cursor-pointer">
                    {displayValue}
                  </p>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black border border-gray-200 shadow-lg max-w-xs p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="break-all">{field.value}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                      onClick={() => handleCopy(field.value)}
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
              {field.type === 'url' && field.value && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 p-0 hover:bg-muted flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    openUrl(field.value);
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 hover:bg-muted flex-shrink-0"
            onClick={onEdit}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </TooltipProvider>
    );
  }

  // Address field editing mode with multiple inputs
  if (field.key === 'address') {
    return (
      <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
        <div className={`p-2 rounded-full bg-muted`}>
          <IconComponent className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-sm font-medium text-foreground mb-1">{field.label}</p>
          <div className="space-y-2">
            <Input
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              onBlur={handleAddressBlur}
              placeholder="Address Line 1"
              className="text-sm"
              disabled={isSaving}
            />
            <Input
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              onBlur={handleAddressBlur}
              placeholder="Address Line 2 (optional)"
              className="text-sm"
              disabled={isSaving}
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={handleAddressBlur}
                placeholder="City"
                className="text-sm"
                disabled={isSaving}
              />
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                onBlur={handleAddressBlur}
                placeholder="State"
                className="text-sm"
                disabled={isSaving}
              />
              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                onBlur={handleAddressBlur}
                placeholder="Zip Code"
                className="text-sm"
                disabled={isSaving}
              />
            </div>
          </div>
        </div>
        {isSaving && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
      <div className={`p-2 rounded-full bg-muted`}>
        <IconComponent className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground mb-1">{field.label}</p>
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => {
            if (field.key === 'phone' || field.key === 'phone_home') {
              handlePhoneChange(e.target.value);
            } else {
              setLocalValue(e.target.value);
            }
          }}
          onBlur={handleBlur}
          className={`w-full px-2 py-1 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            validationError ? 'border-red-500' : 'border-border'
          }`}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          disabled={isSaving}
        />
        {validationError && (
          <p className="text-xs text-red-500 mt-1">{validationError}</p>
        )}
      </div>
      {isSaving && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
    </div>
  );
};

const ReferredByField: React.FC<{ personId?: string }> = ({ personId }) => {
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrerInfo = async () => {
      if (!personId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First, get the referral record for this person
        const { data: referralData, error: referralError } = await supabase
          .from('people_referrals')
          .select('referred_by_id, referred_by_name')
          .eq('person_id', personId)
          .eq('is_deleted', false)
          .single();

        if (referralError || !referralData) {
          setReferrerName(null);
          return;
        }

        // If there's a referred_by_id, fetch the person's name
        if (referralData.referred_by_id) {
          const { data: personData, error: personError } = await supabase
            .from('people')
            .select('first_name, last_name')
            .eq('id', referralData.referred_by_id)
            .eq('is_deleted', false)
            .single();

          if (personError || !personData) {
            // Fall back to referred_by_name if available
            setReferrerName(referralData.referred_by_name || null);
          } else {
            setReferrerName(`${personData.first_name} ${personData.last_name}`);
          }
        } else if (referralData.referred_by_name) {
          // Use referred_by_name as fallback
          setReferrerName(referralData.referred_by_name);
        } else {
          setReferrerName(null);
        }
      } catch (err) {
        console.error('Error fetching referrer info:', err);
        setReferrerName(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrerInfo();
  }, [personId]);

  if (loading || !referrerName) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
      <div className="p-2 rounded-full bg-muted">
        <UserPlus className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">Referred By</p>
        <p className="text-sm text-muted-foreground">{referrerName}</p>
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

  // Profile aggregate (assigned values)
  const { data, loading: profileLoading, error } = useUserProfile(personId);

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
        <ContactInformationSection personId={personId} />

        {/* Additional Information */}
        <AdditionalInformationSection personId={personId} />

        {/* Emergency Contact */}
        <EmergencyContactSection personId={personId} />

        {/* User Data */}
        <UserDataSection personId={personId} />
      </div>
    </ScrollArea>
  );
};

export default GeneralTab;

// Export components for use in other modules
export { EditableDetailItem, EditableContactField };
