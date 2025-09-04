
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Program {
  id: string;
  name: string;
  goals: string[];
}

const ProgramsGoalsConfig = () => {
  const queryClient = useQueryClient();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);
  const [newProgram, setNewProgram] = useState({ name: '', goals: [''] });
  const [newGoal, setNewGoal] = useState('');

  // Fetch programs with goals
  const { data: programs = [], isLoading, error } = useQuery({
    queryKey: ['programs-goals'],
    queryFn: async (): Promise<Program[]> => {
      const { data, error } = await supabase.rpc('get_programs_with_goals');
      if (error) throw error;
      
      // Type assertion since we know the structure from the database function
      return (data as unknown as Program[]) || [];
    },
  });

  // Create program mutation
  const createProgramMutation = useMutation({
    mutationFn: async (program: { name: string; goals: string[] }) => {
      const goalsArray = program.goals
        .filter(goal => goal.trim() !== '')
        .map(goal => ({ name: goal.trim() }));
      
      const { data, error } = await supabase.rpc('add_program_with_goals', {
        p_program_name: program.name,
        p_goals: goalsArray
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs-goals'] });
      toast.success('Program created successfully');
      setNewProgram({ name: '', goals: [''] });
      setIsAddModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create program');
    },
  });

  // Update program mutation
  const updateProgramMutation = useMutation({
    mutationFn: async (program: Program) => {
      const goalsArray = program.goals
        .filter(goal => goal.trim() !== '')
        .map(goal => ({ name: goal.trim() }));
      
      const { data, error } = await supabase.rpc('update_program_with_goals', {
        p_program_id: program.id,
        p_program_name: program.name,
        p_goals: goalsArray
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs-goals'] });
      toast.success('Program updated successfully');
      setIsEditModalOpen(false);
      setEditingProgram(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update program');
    },
  });

  // Delete program mutation
  const deleteProgramMutation = useMutation({
    mutationFn: async (programId: string) => {
      const { data, error } = await supabase.rpc('delete_program_with_goals', {
        p_program_id: programId
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs-goals'] });
      toast.success('Program deleted successfully');
      setIsDeleteModalOpen(false);
      setDeletingProgram(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete program');
    },
  });

  const handleEdit = (program: Program) => {
    setEditingProgram({ ...program });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editingProgram) {
      updateProgramMutation.mutate(editingProgram);
    }
  };

  const handleAdd = () => {
    const validGoals = newProgram.goals.filter(goal => goal.trim() !== '');
    createProgramMutation.mutate({
      name: newProgram.name,
      goals: validGoals
    });
  };

  const handleDeleteClick = (program: Program) => {
    setDeletingProgram(program);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingProgram) {
      deleteProgramMutation.mutate(deletingProgram.id);
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center py-8">Loading programs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive text-center py-8">Failed to load programs. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!Array.isArray(programs) || programs.length === 0 ? (
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
                <Button 
                  onClick={handleSave}
                  disabled={updateProgramMutation.isPending}
                >
                  {updateProgramMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
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
              <Button 
                onClick={handleAdd}
                disabled={createProgramMutation.isPending}
              >
                {createProgramMutation.isPending ? 'Adding...' : 'Add Program'}
              </Button>
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
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteProgramMutation.isPending}
              >
                {deleteProgramMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgramsGoalsConfig;
