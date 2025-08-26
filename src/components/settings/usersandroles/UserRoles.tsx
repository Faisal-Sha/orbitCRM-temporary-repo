import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ArrowLeft, Search, Plus, Edit, Trash2 } from "lucide-react";

interface Role {
  id: string;
  name: string;
  users: number;
  permissions: string[];
  description: string;
}

interface UserRolesProps {
  onBack: () => void;
}

const UserRoles: React.FC<UserRolesProps> = ({ onBack }) => {
  const [roles, setRoles] = useState<Role[]>([
    { id: '1', name: "Administrator", users: 8, permissions: ["Full Access", "User Management", "System Settings", "Reports"], description: "Complete system access and control" },
    { id: '2', name: "Clinician", users: 15, permissions: ["Patient Records", "Appointments", "Notes", "Assessments"], description: "Clinical access for patient care" },
    { id: '3', name: "Receptionist", users: 5, permissions: ["Appointments", "Basic Patient Info", "Phone Access"], description: "Front desk and scheduling access" },
    { id: '4', name: "Supervisor", users: 3, permissions: ["Team Management", "Reports", "Quality Assurance"], description: "Team oversight and reporting" },
    { id: '5', name: "Billing Staff", users: 4, permissions: ["Billing", "Insurance", "Financial Reports"], description: "Financial and billing operations" },
    // Add 12 more dummy roles to reach 17 total
    ...Array.from({ length: 12 }, (_, i) => ({
      id: (i + 6).toString(),
      name: `Role ${i + 6}`,
      users: Math.floor(Math.random() * 10) + 1,
      permissions: [`Permission ${i + 1}`, `Access ${i + 1}`, `Feature ${i + 1}`],
      description: `Description for role ${i + 6}`
    }))
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const availablePermissions = [
    "Full Access", "User Management", "System Settings", "Reports",
    "Patient Records", "Appointments", "Notes", "Assessments",
    "Basic Patient Info", "Phone Access", "Team Management",
    "Quality Assurance", "Billing", "Insurance", "Financial Reports",
    "Data Export", "Communication", "Forms", "Calendar Management"
  ];

  const itemsPerPage = 25;
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, startIndex + itemsPerPage);

  const handleAddRole = () => {
    setIsAddMode(true);
    setEditingRole({
      id: '',
      name: '',
      users: 0,
      permissions: [],
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setIsAddMode(false);
    setEditingRole({ ...role, permissions: [...role.permissions] });
    setIsModalOpen(true);
  };

  const handleSaveRole = () => {
    if (editingRole) {
      if (isAddMode) {
        const newRole = { ...editingRole, id: (roles.length + 1).toString() };
        setRoles([...roles, newRole]);
      } else {
        setRoles(roles.map(r => r.id === editingRole.id ? editingRole : r));
      }
      setIsModalOpen(false);
      setEditingRole(null);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    setRoleToDelete(roleId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRole = () => {
    if (roleToDelete) {
      setRoles(roles.filter(r => r.id !== roleToDelete));
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (editingRole) {
      if (checked) {
        setEditingRole({
          ...editingRole,
          permissions: [...editingRole.permissions, permission]
        });
      } else {
        setEditingRole({
          ...editingRole,
          permissions: editingRole.permissions.filter(p => p !== permission)
        });
      }
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
            <CardTitle>Roles & Permissions Management</CardTitle>
            <Button onClick={handleAddRole}>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search roles..."
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
                <TableHead>Role Name</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <p className="font-medium">{role.name}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{role.users} users</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 2).map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {role.permissions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.id)}>
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
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddMode ? 'Add Role' : 'Edit Role'}</DialogTitle>
          </DialogHeader>
          {editingRole && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role-name">Role Name</Label>
                  <Input
                    id="role-name"
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="users-count">Number of Users</Label>
                  <Input
                    id="users-count"
                    type="number"
                    value={editingRole.users}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  placeholder="Role description"
                />
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto border p-4 rounded">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={editingRole.permissions.includes(permission)}
                        onCheckedChange={(checked) => handlePermissionChange(permission, checked as boolean)}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveRole}>
                  {isAddMode ? 'Add Role' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteRole}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone and may affect users assigned to this role."
      />
    </div>
  );
};

export default UserRoles;
