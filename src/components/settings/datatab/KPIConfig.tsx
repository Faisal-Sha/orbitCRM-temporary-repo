
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, Trash2, X } from "lucide-react";

interface TargetValue {
  id: string;
  name: string;
  value: number;
}

interface KPI {
  id: string;
  name: string;
  category: string;
  targetType: 'percentage' | 'number' | 'scale' | 'duration';
  unit: string;
  targetValues: TargetValue[];
}

const KPIConfig = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingKPI, setEditingKPI] = useState<KPI | null>(null);
  const [deletingKPI, setDeletingKPI] = useState<KPI | null>(null);
  const [newKPI, setNewKPI] = useState<Omit<KPI, 'id'>>({
    name: '',
    category: '',
    targetType: 'percentage',
    unit: '',
    targetValues: [{ id: 'temp-1', name: 'Target', value: 0 }]
  });

  const handleEdit = (kpi: KPI) => {
    setEditingKPI({ ...kpi });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editingKPI) {
      setKpis(kpis.map(k => 
        k.id === editingKPI.id ? editingKPI : k
      ));
      setIsEditModalOpen(false);
      setEditingKPI(null);
    }
  };

  const handleAdd = () => {
    const id = (kpis.length + 1).toString();
    const newKPIWithId = { 
      ...newKPI, 
      id,
      targetValues: newKPI.targetValues.map((tv, index) => ({
        ...tv,
        id: `${id}-${index + 1}`
      }))
    };
    setKpis([...kpis, newKPIWithId]);
    setNewKPI({
      name: '',
      category: '',
      targetType: 'percentage',
      unit: '',
      targetValues: [{ id: 'temp-1', name: 'Target', value: 0 }]
    });
    setIsAddModalOpen(false);
  };

  const handleDeleteClick = (kpi: KPI) => {
    setDeletingKPI(kpi);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingKPI) {
      setKpis(kpis.filter(k => k.id !== deletingKPI.id));
      setIsDeleteModalOpen(false);
      setDeletingKPI(null);
    }
  };

  const addTargetValue = (kpi: KPI | Omit<KPI, 'id'>, isEditing: boolean) => {
    const newTargetValue: TargetValue = {
      id: `temp-${Date.now()}`,
      name: '',
      value: 0
    };

    if (isEditing && editingKPI) {
      setEditingKPI({
        ...editingKPI,
        targetValues: [...editingKPI.targetValues, newTargetValue]
      });
    } else {
      setNewKPI({
        ...newKPI,
        targetValues: [...newKPI.targetValues, newTargetValue]
      });
    }
  };

  const removeTargetValue = (targetValueId: string, isEditing: boolean) => {
    if (isEditing && editingKPI) {
      if (editingKPI.targetValues.length > 1) {
        setEditingKPI({
          ...editingKPI,
          targetValues: editingKPI.targetValues.filter(tv => tv.id !== targetValueId)
        });
      }
    } else {
      if (newKPI.targetValues.length > 1) {
        setNewKPI({
          ...newKPI,
          targetValues: newKPI.targetValues.filter(tv => tv.id !== targetValueId)
        });
      }
    }
  };

  const updateTargetValue = (targetValueId: string, field: 'name' | 'value', value: string | number, isEditing: boolean) => {
    if (isEditing && editingKPI) {
      setEditingKPI({
        ...editingKPI,
        targetValues: editingKPI.targetValues.map(tv => 
          tv.id === targetValueId ? { ...tv, [field]: value } : tv
        )
      });
    } else {
      setNewKPI({
        ...newKPI,
        targetValues: newKPI.targetValues.map(tv => 
          tv.id === targetValueId ? { ...tv, [field]: value } : tv
        )
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {kpis.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No KPIs configured yet.</p>
        ) : (
          kpis.map((kpi) => (
            <div key={kpi.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">{kpi.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{kpi.category}</Badge>
                  <Badge variant="outline">{kpi.targetType}</Badge>
                  <div className="flex gap-1">
                    {kpi.targetValues.map((tv) => (
                      <span key={tv.id} className="text-sm text-gray-500">
                        {tv.name}: {tv.value}{kpi.unit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(kpi)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(kpi)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Button onClick={() => setIsAddModalOpen(true)} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add KPI
      </Button>

      {/* Edit KPI Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit KPI</DialogTitle>
          </DialogHeader>
          {editingKPI && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-kpi-name">KPI Name</Label>
                <Input
                  id="edit-kpi-name"
                  value={editingKPI.name}
                  onChange={(e) => setEditingKPI({
                    ...editingKPI,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="edit-kpi-category">KPI Category</Label>
                <Input
                  id="edit-kpi-category"
                  value={editingKPI.category}
                  onChange={(e) => setEditingKPI({
                    ...editingKPI,
                    category: e.target.value
                  })}
                />
              </div>
              <div>
                <Label>KPI Target Type</Label>
                <Select 
                  value={editingKPI.targetType} 
                  onValueChange={(value: 'percentage' | 'number' | 'scale' | 'duration') => 
                    setEditingKPI({ ...editingKPI, targetType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="scale">Scale</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-kpi-unit">KPI Unit</Label>
                <Input
                  id="edit-kpi-unit"
                  value={editingKPI.unit}
                  onChange={(e) => setEditingKPI({
                    ...editingKPI,
                    unit: e.target.value
                  })}
                  placeholder="e.g., %, sessions, points"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Target Values</Label>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={() => addTargetValue(editingKPI, true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Target
                  </Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {editingKPI.targetValues.map((targetValue) => (
                    <div key={targetValue.id} className="flex items-center gap-2 p-2 border rounded">
                      <Input
                        placeholder="Target name"
                        value={targetValue.name}
                        onChange={(e) => updateTargetValue(targetValue.id, 'name', e.target.value, true)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Value"
                        value={targetValue.value}
                        onChange={(e) => updateTargetValue(targetValue.id, 'value', parseFloat(e.target.value) || 0, true)}
                        className="w-24"
                      />
                      {editingKPI.targetValues.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTargetValue(targetValue.id, true)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add KPI Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add KPI</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-kpi-name">KPI Name</Label>
              <Input
                id="new-kpi-name"
                value={newKPI.name}
                onChange={(e) => setNewKPI({ ...newKPI, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="new-kpi-category">KPI Category</Label>
              <Input
                id="new-kpi-category"
                value={newKPI.category}
                onChange={(e) => setNewKPI({ ...newKPI, category: e.target.value })}
              />
            </div>
            <div>
              <Label>KPI Target Type</Label>
              <Select 
                value={newKPI.targetType} 
                onValueChange={(value: 'percentage' | 'number' | 'scale' | 'duration') => 
                  setNewKPI({ ...newKPI, targetType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-kpi-unit">KPI Unit</Label>
              <Input
                id="new-kpi-unit"
                value={newKPI.unit}
                onChange={(e) => setNewKPI({ ...newKPI, unit: e.target.value })}
                placeholder="e.g., %, sessions, points"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Target Values</Label>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => addTargetValue(newKPI, false)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Target
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {newKPI.targetValues.map((targetValue) => (
                  <div key={targetValue.id} className="flex items-center gap-2 p-2 border rounded">
                    <Input
                      placeholder="Target name"
                      value={targetValue.name}
                      onChange={(e) => updateTargetValue(targetValue.id, 'name', e.target.value, false)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Value"
                      value={targetValue.value}
                      onChange={(e) => updateTargetValue(targetValue.id, 'value', parseFloat(e.target.value) || 0, false)}
                      className="w-24"
                    />
                    {newKPI.targetValues.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTargetValue(targetValue.id, false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add KPI</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete KPI</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete the KPI "{deletingKPI?.name}"? This action cannot be undone.</p>
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

export default KPIConfig;
