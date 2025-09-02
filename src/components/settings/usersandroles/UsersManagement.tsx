
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ArrowLeft, Search, Plus, Edit, Trash2, UserPlus, Lock } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  permissions: string[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface UsersManagementProps {
  onBack: () => void;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: "Dr. Sarah Johnson", email: "sarah@healthcare.com", role: "Administrator", status: "Active", lastLogin: "2024-06-28", permissions: ["manage_users", "view_reports", "edit_settings"] },
    { id: '2', name: "Mike Chen", email: "mike@healthcare.com", role: "Clinician", status: "Active", lastLogin: "2024-06-29", permissions: ["view_patients", "create_notes"] },
    { id: '3', name: "Lisa Rodriguez", email: "lisa@healthcare.com", role: "Receptionist", status: "Inactive", lastLogin: "2024-06-25", permissions: ["schedule_appointments"] },
    { id: '4', name: "Dr. James Wilson", email: "james@healthcare.com", role: "Administrator", status: "Active", lastLogin: "2024-06-30", permissions: ["manage_users", "view_reports"] },
    { id: '5', name: "Anna Thompson", email: "anna@healthcare.com", role: "Clinician", status: "Active", lastLogin: "2024-06-29", permissions: ["view_patients"] }
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
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const itemsPerPage = 25;
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleAddUser = () => {
    setIsAddMode(true);
    setEditingUser({
      id: '',
      name: '',
      email: '',
      role: '',
      status: 'Active',
      lastLogin: '',
      permissions: []
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setIsAddMode(false);
    setEditingUser({ ...user });
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      if (isAddMode) {
        const newUser = { ...editingUser, id: (users.length + 1).toString() };
        setUsers([...users, newUser]);
      } else {
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      }
      setIsModalOpen(false);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (editingUser) {
      const updatedPermissions = checked 
        ? [...editingUser.permissions, permissionId]
        : editingUser.permissions.filter(p => p !== permissionId);
      
      setEditingUser({ ...editingUser, permissions: updatedPermissions });
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
            <CardTitle>Users Management</CardTitle>
            <Button onClick={handleAddUser}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search users..."
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
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
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
            <DialogTitle>{isAddMode ? 'Add User' : 'Edit User'}</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={editingUser.role} 
                    onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                      <SelectItem value="Clinician">Clinician</SelectItem>
                      <SelectItem value="Receptionist">Receptionist</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Billing Staff">Billing Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={editingUser.status} 
                    onValueChange={(value) => setEditingUser({ ...editingUser, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                        id={permission.id}
                        checked={editingUser.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                      />
                      <div className="space-y-1">
                        <Label 
                          htmlFor={permission.id}
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
                <Button onClick={handleSaveUser}>
                  {isAddMode ? 'Add User' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default UsersManagement;
