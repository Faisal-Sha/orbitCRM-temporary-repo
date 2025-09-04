
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, Trash2, X } from "lucide-react";

interface Program {
  id: string;
  name: string;
  goals: string[];
}

const ProgramsGoalsConfig = () => {
  const [programs, setPrograms] = useState<Program[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);
  const [newProgram, setNewProgram] = useState({ name: '', goals: [''] });
  const [newGoal, setNewGoal] = useState('');

  const handleEdit = (program: Program) => {
    setEditingProgram({ ...program });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editingProgram) {
      setPrograms(programs.map(p => 
        p.id === editingProgram.id ? editingProgram : p
      ));
      setIsEditModalOpen(false);
      setEditingProgram(null);
    }
  };

  const handleAdd = () => {
    const id = (programs.length + 1).toString();
    const validGoals = newProgram.goals.filter(goal => goal.trim() !== '');
    setPrograms([...programs, {
      id,
      name: newProgram.name,
      goals: validGoals
    }]);
    
    setNewProgram({ name: '', goals: [''] });
    setIsAddModalOpen(false);
  };

  const handleDeleteClick = (program: Program) => {
    setDeletingProgram(program);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingProgram) {
      setPrograms(programs.filter(p => p.id !== deletingProgram.id));
      setIsDeleteModalOpen(false);
      setDeletingProgram(null);
    }
  };

  const addGoalToEditingProgram = () => {
    if (editingProgram && newGoal.trim()) {
      setEditingProgram({
        ...editingProgram,
        goals: [...editingProgram.goals, newGoal.trim()]
      });
      setNewGoal('');
    }
  };

  const removeGoalFromEditingProgram = (index: number) => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        goals: editingProgram.goals.filter((_, i) => i !== index)
      });
    }
  };

  const addGoalToNewProgram = () => {
    if (newGoal.trim()) {
      setNewProgram({
        ...newProgram,
        goals: [...newProgram.goals.filter(g => g.trim() !== ''), newGoal.trim(), '']
      });
      setNewGoal('');
    }
  };

  const removeGoalFromNewProgram = (index: number) => {
    const updatedGoals = newProgram.goals.filter((_, i) => i !== index);
    if (updatedGoals.length === 0) {
      updatedGoals.push('');
    }
    setNewProgram({
      ...newProgram,
      goals: updatedGoals
    });
  };

  const updateNewProgramGoal = (index: number, value: string) => {
    const updatedGoals = [...newProgram.goals];
    updatedGoals[index] = value;
    setNewProgram({
      ...newProgram,
      goals: updatedGoals
    });
  };

  return (
    <div className="space-y-4">
      {programs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No programs & goals configured yet.</p>
      ) : (
        programs.map((program) => (
          <div key={program.id} className="p-3 border rounded">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">{program.name}</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(program)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(program)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {program.goals.map((goal, index) => (
                <Badge key={index} variant="outline">{goal}</Badge>
              ))}
            </div>
          </div>
        ))
      )}
      
      <Button onClick={() => setIsAddModalOpen(true)} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Program
      </Button>

      {/* Edit Program Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
          </DialogHeader>
          {editingProgram && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-program-name">Program Name</Label>
                <Input
                  id="edit-program-name"
                  value={editingProgram.name}
                  onChange={(e) => setEditingProgram({
                    ...editingProgram,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label>Goals</Label>
                <div className="space-y-2">
                  {editingProgram.goals.map((goal, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline" className="flex-1 justify-between">
                        {goal}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGoalFromEditingProgram(index)}
                          className="h-auto p-1 ml-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new goal"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addGoalToEditingProgram()}
                    />
                    <Button onClick={addGoalToEditingProgram} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
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

      {/* Add Program Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-program-name">Program Name</Label>
              <Input
                id="new-program-name"
                value={newProgram.name}
                onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Goals</Label>
              <div className="space-y-2">
                {newProgram.goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Goal name"
                      value={goal}
                      onChange={(e) => updateNewProgramGoal(index, e.target.value)}
                    />
                    {newProgram.goals.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGoalFromNewProgram(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new goal"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addGoalToNewProgram()}
                  />
                  <Button onClick={addGoalToNewProgram} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add Program</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete the program "{deletingProgram?.name}"? This action cannot be undone.</p>
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

export default ProgramsGoalsConfig;
