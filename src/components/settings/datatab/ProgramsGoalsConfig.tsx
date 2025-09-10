import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, Trash2, X, Loader2 } from "lucide-react";
import { useProgramsGoals } from "@/hooks/useProgramsGoals";

const ProgramsGoalsConfig: React.FC = () => {
  const {
    programs,
    loading,
    saving,
    addProgram,
    updateProgram,
    deleteProgram,
  } = useProgramsGoals();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [editingGoals, setEditingGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState("");

  const [addName, setAddName] = useState("");
  const [addGoals, setAddGoals] = useState<string[]>([""]);
  const [addNewGoal, setAddNewGoal] = useState("");

  const [deletingProgramId, setDeletingProgramId] = useState<string | null>(null);
  const [deletingProgramName, setDeletingProgramName] = useState<string>("");

  // --- Edit flow
  const handleOpenEdit = (p: { id: string; name: string; goals: string[] }) => {
    setEditingId(p.id);
    setEditingName(p.name);
    setEditingGoals(p.goals.slice());
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

     // include any pending newGoal if the user didn't hit +
  const mergedGoals = [
    ...editingGoals.filter(g => g.trim() !== ""),
    ...(newGoal.trim() ? [newGoal.trim()] : []),
  ];
    const res = await updateProgram(editingId, editingName, mergedGoals);
    if (res.success) {
      setIsEditModalOpen(false);
      setEditingId(null);
      setEditingName("");
      setEditingGoals([]);
      setNewGoal("");
    }
  };

  const handleRemoveEditGoal = (index: number) => {
    setEditingGoals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddEditGoal = () => {
    if (!newGoal.trim()) return;
    setEditingGoals((prev) => [...prev.filter((g) => g.trim() !== ""), newGoal.trim()]);
    setNewGoal("");
  };

  // --- Add flow
  const handleOpenAdd = () => {
    setAddName("");
    setAddGoals([""]);
    setAddNewGoal("");
    setIsAddModalOpen(true);
  };

  const handleAddProgram = async () => {
    // const valid = addGoals.filter((g) => g.trim() !== "");
    const merged = [
      ...addGoals.filter(g => g.trim() !== ""),
      ...(addNewGoal.trim() ? [addNewGoal.trim()] : []),
    ];
    const res = await addProgram(addName, merged);
    if (res.success) {
      setIsAddModalOpen(false);
      setAddName("");
      setAddGoals([""]);
      setAddNewGoal("");
    }
  };

  const handleRemoveAddGoal = (index: number) => {
    setAddGoals((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [""];
    });
  };

  const handleUpdateAddGoal = (index: number, value: string) => {
    setAddGoals((prev) => {
      const next = prev.slice();
      next[index] = value;
      return next;
    });
  };

  const handleAppendAddGoal = () => {
    if (!addNewGoal.trim()) return;
    setAddGoals((prev) => [...prev.filter((g) => g.trim() !== ""), addNewGoal.trim(), ""]);
    setAddNewGoal("");
  };

  // --- Delete flow
  const handleOpenDelete = (p: { id: string; name: string }) => {
    setDeletingProgramId(p.id);
    setDeletingProgramName(p.name);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProgramId) return;
    const res = await deleteProgram(deletingProgramId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      setDeletingProgramId(null);
      setDeletingProgramName("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading programs & goals...
      </div>
    );
    }

  return (
    <div className="space-y-4">
      {programs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No programs & goals configured yet.
        </p>
      ) : (
        programs.map((p) => (
          <div key={p.id} className="p-3 border rounded">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">{p.name}</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(p)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleOpenDelete(p)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {p.goals.map((g, i) => (
                <Badge key={i} variant="outline">
                  {g}
                </Badge>
              ))}
            </div>
          </div>
        ))
      )}

      <Button onClick={handleOpenAdd} className="w-full" disabled={saving}>
        <Plus className="h-4 w-4 mr-2" />
        {saving ? "Working..." : "Add Program"}
      </Button>

      {/* Edit Program Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-program-name">Program Name</Label>
              <Input
                id="edit-program-name"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
              />
            </div>
            <div>
              <Label>Goals</Label>
              <div className="space-y-2">
                {editingGoals.map((g, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Badge variant="outline" className="flex-1 justify-between">
                      {g}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEditGoal(idx)}
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
                    onKeyDown={(e) => e.key === "Enter" && handleAddEditGoal()}
                  />
                  <Button onClick={handleAddEditGoal} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Changes
              </Button>
            </div>
          </div>
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
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
              />
            </div>
            <div>
              <Label>Goals</Label>
              <div className="space-y-2">
                {addGoals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Goal name"
                      value={goal}
                      onChange={(e) => handleUpdateAddGoal(index, e.target.value)}
                    />
                    {addGoals.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveAddGoal(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new goal"
                    value={addNewGoal}
                    onChange={(e) => setAddNewGoal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAppendAddGoal()}
                  />
                  <Button onClick={handleAppendAddGoal} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleAddProgram} disabled={saving || !addName.trim()}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Add Program
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
            <p>
              Are you sure you want to delete the program "{deletingProgramName}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
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