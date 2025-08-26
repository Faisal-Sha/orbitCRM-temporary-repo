
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, Trash2 } from "lucide-react";

interface LabelItem {
  id: string;
  name: string;
  category: string;
  color: string;
}

const LabelsConfig = () => {
  const [labels, setLabels] = useState<LabelItem[]>([
    { id: '1', name: 'High Priority', category: 'Priority', color: '#ef4444' },
    { id: '2', name: 'In Progress', category: 'Status', color: '#3b82f6' },
    { id: '3', name: 'Urgent', category: 'Priority', color: '#f59e0b' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<LabelItem | null>(null);
  const [deletingLabel, setDeletingLabel] = useState<LabelItem | null>(null);
  const [newLabel, setNewLabel] = useState({ name: '', category: '', color: '#3b82f6' });

  const colorPalette = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
    '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
  ];

  const handleEdit = (label: LabelItem) => {
    setEditingLabel({ ...label });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingLabel) {
      setLabels(labels.map(l => 
        l.id === editingLabel.id ? editingLabel : l
      ));
      setIsModalOpen(false);
      setEditingLabel(null);
    }
  };

  const handleAdd = () => {
    const id = (labels.length + 1).toString();
    setLabels([...labels, {
      id,
      name: newLabel.name,
      category: newLabel.category,
      color: newLabel.color
    }]);
    
    setNewLabel({ name: '', category: '', color: '#3b82f6' });
    setIsAddModalOpen(false);
  };

  const handleDeleteClick = (label: LabelItem) => {
    setDeletingLabel(label);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingLabel) {
      setLabels(labels.filter(l => l.id !== deletingLabel.id));
      setIsDeleteModalOpen(false);
      setDeletingLabel(null);
    }
  };

  const getLabelStyle = (color: string) => ({
    backgroundColor: color,
    color: 'white'
  });

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {labels.map((label) => (
          <div key={label.id} className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-3">
              <Badge 
                style={getLabelStyle(label.color)}
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
        ))}
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
              <div className="grid grid-cols-5 gap-2 mt-2">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newLabel.color === color ? 'border-gray-900' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewLabel({ ...newLabel, color })}
                  />
                ))}
              </div>
              <div className="mt-3">
                <Badge 
                  style={getLabelStyle(newLabel.color)}
                  className="border-0"
                >
                  Preview: {newLabel.name || 'Label Name'}
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
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        editingLabel.color === color ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditingLabel({ ...editingLabel, color })}
                    />
                  ))}
                </div>
                <div className="mt-3">
                  <Badge 
                    style={getLabelStyle(editingLabel.color)}
                    className="border-0"
                  >
                    Preview: {editingLabel.name}
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
