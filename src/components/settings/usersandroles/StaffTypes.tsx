
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { ArrowLeft, Search, Plus, Edit, Trash2, Lock } from "lucide-react";

interface StaffType {
  id: string;
  name: string;
  count: number;
  description: string;
  requirements: string;
  permissions: string[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface StaffTypesProps {
  onBack: () => void;
}

const StaffTypes: React.FC<StaffTypesProps> = ({ onBack }) => {
  const [staffTypes, setStaffTypes] = useState<StaffType[]>([
    { id: '1', name: "Licensed Clinician", count: 25, description: "Licensed mental health professionals", requirements: "Master's Degree, State License", permissions: ["view_patients", "create_notes"] },
    { id: '2', name: "Support Staff", count: 18, description: "Administrative and support personnel", requirements: "High School Diploma", permissions: ["schedule_appointments"] },
    { id: '3', name: "Administrative", count: 12, description: "Office management and coordination", requirements: "Associate Degree preferred", permissions: ["schedule_appointments", "billing_access"] },
    { id: '4', name: "Management", count: 8, description: "Supervisory and leadership roles", requirements: "Bachelor's Degree, Experience", permissions: ["manage_users", "view_reports", "edit_settings"] },
    { id: '5', name: "Billing Specialist", count: 6, description: "Medical billing and insurance processing", requirements: "Certification preferred", permissions: ["billing_access"] }
  ]);

  const availablePermissions: Permission[] = [
    { id: 'manage_users', name: 'Manage Users', description: 'Create, edit, and delete user accounts' },
    { id: 'view_reports', name: 'View Reports', description: 'Access organizational reports and analytics' },
    { id: 'edit_settings', name: 'Edit Settings', description: 'Modify system and organization settings' },
    { id: 'view_patients', name: 'View Patients', description: 'Access patient information and records' },
    { id: 'create_notes', name: 'Create Notes', description: 'Add clinical notes and documentation' },
    { id: 'schedule_appointments', name: 'Schedule Appointments', description: 'Manage patient scheduling' },
    { id: 'billing_access', name: 'Billing Access', description: 'View and manage billing information' },
    { id: 'audit_logs', name: 'Audit Logs', description: 'Access system audit and activity logs' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaffType, setEditingStaffType] = useState<StaffType | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffTypeToDelete, setStaffTypeToDelete] = useState<string | null>(null);

  const itemsPerPage = 25;
  const filteredStaffTypes = staffTypes.filter(staffType => 
    staffType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffType.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStaffTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStaffTypes = filteredStaffTypes.slice(startIndex, startIndex + itemsPerPage);

  const handleAddStaffType = () => {
    setIsAddMode(true);
    setEditingStaffType({
      id: '',
      name: '',
      count: 0,
      description: '',
      requirements: '',
      permissions: []
    });
    setIsModalOpen(true);
  };

  const handleEditStaffType = (staffType: StaffType) => {
    setIsAddMode(false);
    setEditingStaffType({ ...staffType });
    setIsModalOpen(true);
  };

  const handleSaveStaffType = () => {
    if (editingStaffType) {
      if (isAddMode) {
        const newStaffType = { ...editingStaffType, id: (staffTypes.length + 1).toString() };
        setStaffTypes([...staffTypes, newStaffType]);
      } else {
        setStaffTypes(staffTypes.map(st => st.id === editingStaffType.id ? editingStaffType : st));
      }
      setIsModalOpen(false);
      setEditingStaffType(null);
    }
  };

  const handleDeleteStaffType = (staffTypeId: string) => {
    setStaffTypeToDelete(staffTypeId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStaffType = () => {
    if (staffTypeToDelete) {
      setStaffTypes(staffTypes.filter(st => st.id !== staffTypeToDelete));
      setDeleteDialogOpen(false);
      setStaffTypeToDelete(null);
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (editingStaffType) {
      const updatedPermissions = checked 
        ? [...editingStaffType.permissions, permissionId]
        : editingStaffType.permissions.filter(p => p !== permissionId);
      
      setEditingStaffType({ ...editingStaffType, permissions: updatedPermissions });
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Type</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Requirements</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStaffTypes.map((staffType) => (
                <TableRow key={staffType.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{staffType.name}</p>
                      <p className="text-sm text-gray-500">{staffType.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{staffType.count} staff</Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{staffType.requirements}</p>
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
              ))}
            </TableBody>
          </Table>

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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Staff Type Name</Label>
                  <Input
                    id="name"
                    value={editingStaffType.name}
                    onChange={(e) => setEditingStaffType({ ...editingStaffType, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="count">Staff Count</Label>
                  <Input
                    id="count"
                    type="number"
                    value={editingStaffType.count}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={editingStaffType.description}
                  onChange={(e) => setEditingStaffType({ ...editingStaffType, description: e.target.value })}
                  placeholder="Staff type description"
                />
              </div>
              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Input
                  id="requirements"
                  value={editingStaffType.requirements}
                  onChange={(e) => setEditingStaffType({ ...editingStaffType, requirements: e.target.value })}
                  placeholder="Education, certification, or experience requirements"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Permissions
                </Label>
                <div className="border rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`${editingStaffType.id}-${permission.id}`}
                        checked={editingStaffType.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                      />
                      <div className="space-y-1">
                        <Label 
                          htmlFor={`${editingStaffType.id}-${permission.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.name}
                        </Label>
                        <p className="text-xs text-gray-500">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveStaffType}>
                  {isAddMode ? 'Add Staff Type' : 'Save Changes'}
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
