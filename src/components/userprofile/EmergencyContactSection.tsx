import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditableContactField } from './GeneralTab';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useOrganizationCountry } from '@/hooks/useOrganizationCountry';

interface EmergencyContactSectionProps {
  personId?: string;
}

export const EmergencyContactSection: React.FC<EmergencyContactSectionProps> = ({ personId }) => {
  const { 
    data, 
    loading, 
    updateEmergencyField, 
    deleteEmergencyField, 
    getAvailableEmergencyFields, 
    getCurrentEmergencyFields 
  } = useUserProfile(personId);
  
  const { country } = useOrganizationCountry();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentFields = getCurrentEmergencyFields();
  const availableFields = getAvailableEmergencyFields();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setEditingField(null);
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddField = (fieldKey: string) => {
    setEditingField(fieldKey);
    setDropdownOpen(false);
  };

  const handleSave = async (fieldKey: string, value: string): Promise<boolean> => {
    if (!value.trim()) {
      return await deleteEmergencyField(fieldKey);
    } else {
      return await updateEmergencyField(fieldKey, value);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading emergency contact information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" ref={containerRef}>
          {currentFields.map((field) => (
            <EditableContactField
              key={field.key}
              field={field}
              isEditing={editingField === field.key}
              onEdit={() => setEditingField(field.key)}
              onSave={async (value) => {
                const success = await handleSave(field.key, value);
                if (success) setEditingField(null);
                return success;
              }}
              onDelete={async () => {
                const success = await deleteEmergencyField(field.key);
                if (success) setEditingField(null);
                return success;
              }}
              country={country || 'United States'}
            />
          ))}

          {/* Add editing field if it's a new field */}
          {editingField && !currentFields.find(f => f.key === editingField) && (
            <EditableContactField
              field={{
                key: editingField,
                label: availableFields.find(f => f.key === editingField)?.label || editingField,
                value: '',
                type: editingField === 'relationship' ? 'select' : 'text'
              }}
              isEditing={true}
              onEdit={() => {}}
              onSave={async (value) => {
                const success = await handleSave(editingField, value);
                if (success) setEditingField(null);
                return success;
              }}
              onDelete={async () => {
                setEditingField(null);
                return true;
              }}
              country={country || 'United States'}
            />
          )}

          {availableFields.length > 0 && (
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Field
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                {availableFields.map((field) => (
                  <DropdownMenuItem
                    key={field.key}
                    onClick={() => handleAddField(field.key)}
                    className="cursor-pointer"
                  >
                    {field.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {currentFields.length === 0 && availableFields.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No emergency contact information available.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};