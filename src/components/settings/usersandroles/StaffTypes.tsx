
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { ArrowLeft, Search, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useStaffTypes, StaffTypeEnum } from "@/hooks/useStaffTypes";

// Staff type enum values from database
const STAFF_TYPE_OPTIONS = [
  { value: 'specialist_marketer', label: 'Specialist - Marketer' },
  { value: 'clinical_assessor', label: 'Clinical Assessor' },
  { value: 'clinical_supervisor', label: 'Clinical Supervisor' },
  { value: 'case_manager', label: 'Case Manager' },
  { value: 'admin_support', label: 'Admin Support' },
  { value: 'sales_rep', label: 'Sales Representative' },
  { value: 'specialist_hr', label: 'Specialist - HR' },
  { value: 'specialist_it', label: 'Specialist - IT' },
  { value: 'specialist_finance', label: 'Specialist - Finance' },
  { value: 'leadership_team_lead', label: 'Leadership - Team Lead' },
  { value: 'leadership_exec', label: 'Leadership - Executive' }
];

interface StaffTypesProps {
  onBack: () => void;
}

const StaffTypes: React.FC<StaffTypesProps> = ({ onBack }) => {
  const { staffTypes, loading, addStaffType, updateStaffType, deleteStaffType } = useStaffTypes();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaffType, setEditingStaffType] = useState<{ id?: string; staff_type: StaffTypeEnum; } | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffTypeToDelete, setStaffTypeToDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const itemsPerPage = 25;
  const filteredStaffTypes = staffTypes.filter(staffType => {
    const staffTypeLabel = STAFF_TYPE_OPTIONS.find(opt => opt.value === staffType.staff_type)?.label || staffType.staff_type;
    return staffTypeLabel.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredStaffTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStaffTypes = filteredStaffTypes.slice(startIndex, startIndex + itemsPerPage);

  const handleAddStaffType = () => {
    setIsAddMode(true);
    setEditingStaffType({
      staff_type: '' as StaffTypeEnum
    });
    setIsModalOpen(true);
  };

  const handleEditStaffType = (staffType: any) => {
    setIsAddMode(false);
    setEditingStaffType({ 
      id: staffType.id,
      staff_type: staffType.staff_type 
    });
    setIsModalOpen(true);
  };

  const handleSaveStaffType = async () => {
    if (!editingStaffType?.staff_type) return;
    
    setSaving(true);
    try {
      if (isAddMode) {
        const result = await addStaffType(editingStaffType.staff_type);
        if (result.success) {
          setIsModalOpen(false);
          setEditingStaffType(null);
        }
      } else if (editingStaffType.id) {
        const result = await updateStaffType(editingStaffType.id, editingStaffType.staff_type);
        if (result.success) {
          setIsModalOpen(false);
          setEditingStaffType(null);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaffType = (staffTypeId: string) => {
    setStaffTypeToDelete(staffTypeId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStaffType = async () => {
    if (staffTypeToDelete) {
      await deleteStaffType(staffTypeToDelete);
      setDeleteDialogOpen(false);
      setStaffTypeToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users & Roles
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Staff Types Management</CardTitle>
            <Button onClick={handleAddStaffType}>
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Type
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search staff types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading staff types...
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Type</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStaffTypes.map((staffType) => {
                    const staffTypeLabel = STAFF_TYPE_OPTIONS.find(opt => opt.value === staffType.staff_type)?.label || staffType.staff_type;
                    return (
                      <TableRow key={staffType.id}>
                        <TableCell>
                          <p className="font-medium">{staffTypeLabel}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{staffType.count} staff</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditStaffType(staffType)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteStaffType(staffType.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddMode ? 'Add Staff Type' : 'Edit Staff Type'}</DialogTitle>
          </DialogHeader>
          {editingStaffType && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="staffType">Staff Type</Label>
                <Select 
                  value={editingStaffType.staff_type} 
                  onValueChange={(value) => setEditingStaffType({ ...editingStaffType, staff_type: value as StaffTypeEnum })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a staff type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSaveStaffType} disabled={saving || !editingStaffType.staff_type}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isAddMode ? 'Adding...' : 'Saving...'}
                    </>
                  ) : (
                    isAddMode ? 'Add Staff Type' : 'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteStaffType}
        title="Delete Staff Type"
        description="Are you sure you want to delete this staff type? This action cannot be undone."
      />
    </div>
  );
};

export default StaffTypes;
