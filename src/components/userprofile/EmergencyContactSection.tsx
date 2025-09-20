import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [showAddField, setShowAddField] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentFields = getCurrentEmergencyFields();
  const availableFields = getAvailableEmergencyFields();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setEditingField(null);
        setShowAddField(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddField = (fieldKey: string) => {
    setEditingField(fieldKey);
    setShowAddField(false);
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
        <CardTitle className="text-lg font-semibold">Emergency Contact</CardTitle>
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
              onCancel={() => setEditingField(null)}
            />
          ))}

          {/* Add editing field if it's a new field */}
          {editingField && !currentFields.find(f => f.key === editingField) && (
            <EditableContactField
              key={`new-${editingField}`}
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
              onCancel={() => setEditingField(null)}
            />
          )}

          {/* Add Field Button and Dropdown - mirror Additional Information styling */}
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