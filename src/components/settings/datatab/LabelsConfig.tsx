
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LabelItem {
  id: string;
  name: string;
  category: string;
  color: string;
  textColor: 'black' | 'white';
  fontWeight: 'normal' | 'bold';
}

interface ApiResponse {
  success: boolean;
  message: string;
  label_id?: string;
}

const LabelsConfig = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<LabelItem | null>(null);
  const [deletingLabel, setDeletingLabel] = useState<LabelItem | null>(null);
  const [newLabel, setNewLabel] = useState({ 
    name: '', 
    category: '', 
    color: '#3b82f6',
    textColor: 'white' as 'black' | 'white',
    fontWeight: 'normal' as 'normal' | 'bold'
  });
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Fetch labels from backend
  const { data: labels, isLoading, error } = useQuery({
    queryKey: ['data-labels'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_data_labels');
      if (error) throw error;
      return (data as unknown as LabelItem[]) || [];
    }
  });

  // Add label mutation
  const addLabelMutation = useMutation({
    mutationFn: async (newLabelData: typeof newLabel) => {
      const { data, error } = await supabase.rpc('add_data_label', {
        p_label_name: newLabelData.name,
        p_label_category: newLabelData.category,
        p_label_color: newLabelData.color,
        p_text_color: newLabelData.textColor,
        p_font_weight: newLabelData.fontWeight
      });
      if (error) throw error;
      const response = data as unknown as ApiResponse;
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-labels'] });
      toast.success('Label added successfully');
      setNewLabel({ 
        name: '', 
        category: '', 
        color: '#3b82f6',
        textColor: 'white' as 'black' | 'white',
        fontWeight: 'normal' as 'normal' | 'bold'
      });
      setShowCustomPicker(false);
      setIsAddModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add label');
    }
  });

  // Update label mutation
  const updateLabelMutation = useMutation({
    mutationFn: async (labelData: LabelItem) => {
      const { data, error } = await supabase.rpc('update_data_label', {
        p_label_id: labelData.id,
        p_label_name: labelData.name,
        p_label_category: labelData.category,
        p_label_color: labelData.color,
        p_text_color: labelData.textColor,
        p_font_weight: labelData.fontWeight
      });
      if (error) throw error;
      const response = data as unknown as ApiResponse;
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-labels'] });
      toast.success('Label updated successfully');
      setIsModalOpen(false);
      setEditingLabel(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update label');
    }
  });

  // Delete label mutation
  const deleteLabelMutation = useMutation({
    mutationFn: async (labelId: string) => {
      const { data, error } = await supabase.rpc('delete_data_label', {
        p_label_id: labelId
      });
      if (error) throw error;
      const response = data as unknown as ApiResponse;
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-labels'] });
      toast.success('Label deleted successfully');
      setIsDeleteModalOpen(false);
      setDeletingLabel(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete label');
    }
  });

  const colorPalette = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
    '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
  ];

  // Brighter variations of existing colors
  const brighterColorPalette = [
    '#ff6b6b', '#ff8a5c', '#ffc947', '#a3e635', '#4ade80',
    '#34d399', '#22d3ee', '#60a5fa', '#a78bfa', '#f472b6'
  ];

  const handleEdit = (label: LabelItem) => {
    setEditingLabel({ ...label });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingLabel) {
      updateLabelMutation.mutate(editingLabel);
    }
  };

  const handleAdd = () => {
    if (!newLabel.name.trim()) {
      toast.error('Label name is required');
      return;
    }
    addLabelMutation.mutate(newLabel);
  };

  const handleDeleteClick = (label: LabelItem) => {
    setDeletingLabel(label);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingLabel) {
      deleteLabelMutation.mutate(deletingLabel.id);
    }
  };

  const getLabelStyle = (color: string, textColor: 'black' | 'white' = 'white', fontWeight: 'normal' | 'bold' = 'normal') => ({
    backgroundColor: color,
    color: textColor,
    fontWeight: fontWeight
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Loading labels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-sm text-destructive">Failed to load labels. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {labels.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No labels configured yet.</p>
        ) : (
          labels.map((label) => (
            <div key={label.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <Badge 
                  style={getLabelStyle(label.color, label.textColor, label.fontWeight)}
                  className="border-0"
                >
                  {label.name}
                </Badge>
                <span className="text-sm text-gray-500">{label.category}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(label)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(label)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Button onClick={() => setIsAddModalOpen(true)} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Label
      </Button>

      {/* Add Label Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Label</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="label-name">Label Name</Label>
              <Input
                id="label-name"
                value={newLabel.name}
                onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newLabel.category}
                onChange={(e) => setNewLabel({ ...newLabel, category: e.target.value })}
                placeholder="e.g., Priority, Status"
              />
            </div>
            <div>
              <Label>Label Color</Label>
              <div className="space-y-3 mt-2">
                <div>
                  <p className="text-sm font-medium mb-2">Standard Colors</p>
                  <div className="grid grid-cols-5 gap-2">
                    {colorPalette.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          newLabel.color === color ? 'border-gray-900' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewLabel({ ...newLabel, color })}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Bright Colors</p>
                  <div className="grid grid-cols-5 gap-2">
                    {brighterColorPalette.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          newLabel.color === color ? 'border-gray-900' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewLabel({ ...newLabel, color })}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={showCustomPicker ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowCustomPicker(!showCustomPicker)}
                    >
                      Custom Color
                    </Button>
                    {showCustomPicker && (
                      <input
                        type="color"
                        value={newLabel.color}
                        onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })}
                        className="w-10 h-8 border rounded cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Label>Text Options</Label>
              <div className="flex gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium mb-2">Text Color</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={newLabel.textColor === 'white' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewLabel({ ...newLabel, textColor: 'white' })}
                    >
                      White
                    </Button>
                    <Button
                      type="button"
                      variant={newLabel.textColor === 'black' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewLabel({ ...newLabel, textColor: 'black' })}
                    >
                      Black
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Font Weight</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={newLabel.fontWeight === 'normal' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewLabel({ ...newLabel, fontWeight: 'normal' })}
                    >
                      Normal
                    </Button>
                    <Button
                      type="button"
                      variant={newLabel.fontWeight === 'bold' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewLabel({ ...newLabel, fontWeight: 'bold' })}
                    >
                      Bold
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Label>Sample Label</Label>
              <div className="mt-2">
                <Badge 
                  style={getLabelStyle(newLabel.color, newLabel.textColor, newLabel.fontWeight)}
                  className="border-0"
                >
                  {newLabel.name || 'Label Name'}
                </Badge>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add Label</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Label Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Label</DialogTitle>
          </DialogHeader>
          {editingLabel && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-label-name">Label Name</Label>
                <Input
                  id="edit-label-name"
                  value={editingLabel.name}
                  onChange={(e) => setEditingLabel({
                    ...editingLabel,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={editingLabel.category}
                  onChange={(e) => setEditingLabel({
                    ...editingLabel,
                    category: e.target.value
                  })}
                />
              </div>
              <div>
                <Label>Label Color</Label>
                <div className="space-y-3 mt-2">
                  <div>
                    <p className="text-sm font-medium mb-2">Standard Colors</p>
                    <div className="grid grid-cols-5 gap-2">
                      {colorPalette.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            editingLabel.color === color ? 'border-gray-900' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setEditingLabel({ ...editingLabel, color })}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Bright Colors</p>
                    <div className="grid grid-cols-5 gap-2">
                      {brighterColorPalette.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            editingLabel.color === color ? 'border-gray-900' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setEditingLabel({ ...editingLabel, color })}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={showCustomPicker ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowCustomPicker(!showCustomPicker)}
                      >
                        Custom Color
                      </Button>
                      {showCustomPicker && (
                        <input
                          type="color"
                          value={editingLabel.color}
                          onChange={(e) => setEditingLabel({ ...editingLabel, color: e.target.value })}
                          className="w-10 h-8 border rounded cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label>Text Options</Label>
                <div className="flex gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium mb-2">Text Color</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={editingLabel.textColor === 'white' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditingLabel({ ...editingLabel, textColor: 'white' })}
                      >
                        White
                      </Button>
                      <Button
                        type="button"
                        variant={editingLabel.textColor === 'black' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditingLabel({ ...editingLabel, textColor: 'black' })}
                      >
                        Black
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Font Weight</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={editingLabel.fontWeight === 'normal' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditingLabel({ ...editingLabel, fontWeight: 'normal' })}
                      >
                        Normal
                      </Button>
                      <Button
                        type="button"
                        variant={editingLabel.fontWeight === 'bold' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditingLabel({ ...editingLabel, fontWeight: 'bold' })}
                      >
                        Bold
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label>Sample Label</Label>
                <div className="mt-2">
                  <Badge 
                    style={getLabelStyle(editingLabel.color, editingLabel.textColor, editingLabel.fontWeight)}
                    className="border-0"
                  >
                    {editingLabel.name}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Label</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete the label "{deletingLabel?.name}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabelsConfig;
