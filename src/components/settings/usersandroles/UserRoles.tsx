import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
// import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { RoleLabel } from "@/components/ui/role-label";
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
import { useUserRoles, UserRole } from "@/hooks/useUserRoles";
import { PermissionWithAssigned, usePermissions } from "@/hooks/usePermissions";
import { useDataLabels } from "@/hooks/useDataLabels";

interface UserRolesProps {
  onBack: () => void;
}

const UserRoles: React.FC<UserRolesProps> = ({ onBack }) => {
  const [modalPermissions, setModalPermissions] = useState<PermissionWithAssigned[]>([]);
  const { roles, loading, addRole, updateRole, deleteRole } = useUserRoles();
  const { labels = [], loading: labelsLoading } = useDataLabels();
  const { permissions, loading: permissionsLoading, fetchPermissionsForRole, setRolePermissions, addPermission } = usePermissions();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [roleName, setRoleName] = useState('');
  const [selectedLabelId, setSelectedLabelId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [newPermissionName, setNewPermissionName] = useState("");
  const [assigning, setAssigning] = useState(false);

  const availablePermissions: string[] = [];

  const itemsPerPage = 25;
  const filteredRoles = roles.filter(role => 
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, startIndex + itemsPerPage);

  const handleAddRole = async () => {
    setIsAddMode(true);
    setEditingRole(null);
    setRoleName('');
    setSelectedLabelId('no-label');
    setSelectedPermissionIds([]);
    setIsModalOpen(true);

    // fetch the filtered/visible permissions for a new role
    const dummyId = "00000000-0000-0000-0000-000000000000";
    try {
      const visible = await fetchPermissionsForRole(dummyId);
      setModalPermissions(visible);
    } catch {
      setModalPermissions([]);
      }
  };

  const handleEditRole = async (role: UserRole) => {
    setIsAddMode(false);
    setEditingRole(role);
    setRoleName(role.role_name);
    setSelectedLabelId(role.role_label_id || 'no-label');
    setIsModalOpen(true);

    // preload assigned permissions
    try {
      const visible = await fetchPermissionsForRole(role.id);
      setModalPermissions(visible);
      setSelectedPermissionIds(visible.filter(v => v.assigned).map(v => v.id));
    } catch {
      setModalPermissions([]);
      setSelectedPermissionIds([]);
    }
  };

  const handleSaveRole = async () => {
    if (!roleName.trim()) {
      return;
    }

    setSaving(true);
    try {
      const labelId = selectedLabelId === 'no-label' ? undefined : selectedLabelId;
      if (isAddMode) {
        const result = await addRole(roleName.trim(), labelId);
        if (result.success && result.role_id) {
          // apply permissions if any selected
          if (selectedPermissionIds.length > 0) {
            setAssigning(true);
            await setRolePermissions(result.role_id, selectedPermissionIds);
            setAssigning(false);
          }
          setIsModalOpen(false);
          setRoleName('');
          setSelectedLabelId('no-label');
          setEditingRole(null);
          setSelectedPermissionIds([]);
        }
      } else if (editingRole) {
        const result = await updateRole(editingRole.id, roleName.trim(), labelId);
        if (result.success) {
          // update permissions for this role
          setAssigning(true);
          await setRolePermissions(editingRole.id, selectedPermissionIds);
          setAssigning(false);
          setIsModalOpen(false);
          setRoleName('');
          setSelectedLabelId('no-label');
          setEditingRole(null);
          setSelectedPermissionIds([]);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    setRoleToDelete(roleId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRole = async () => {
    if (roleToDelete) {
      const result = await deleteRole(roleToDelete);
      if (result.success) {
        setDeleteDialogOpen(false);
        setRoleToDelete(null);
      }
    }
  };

  // Toggle permission assignment
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissionIds(prev =>
      checked ? Array.from(new Set([...prev, permissionId])) : prev.filter(id => id !== permissionId)
    );
  };

  // Optional quick creation of a permission right from modal
  const handleQuickAddPermission = async () => {
    const name = newPermissionName.trim();
    if (!name) return;
    const res = await addPermission(name);
    if (res.success && res.permission_id) {
      setNewPermissionName("");
    // auto-select the newly added permission
    setSelectedPermissionIds(prev => Array.from(new Set([...prev, res.permission_id!])));
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading roles...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <RoleLabel
                          roleName={role.role_name}
                          labelColor={role.label_color}
                          textColor={role.text_color}
                          fontWeight={role.font_weight}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{role.user_count} users</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {typeof (role as any).permission_count === "number"
                            ? `${(role as any).permission_count} permissions`
                            : "Not configured"}
                        </Badge>
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
                  ))
                )}
              </TableBody>
            </Table>
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
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddMode ? 'Add Role' : 'Edit Role'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Enter role name..."
                />
              </div>
              <div>
                <Label htmlFor="role-label">Label (Optional)</Label>
                <Select value={selectedLabelId} onValueChange={setSelectedLabelId}>
                  <SelectTrigger id="role-label">
                    <SelectValue placeholder="Select a label..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-label">No Label</SelectItem>
                    {labels.map((label) => (
                      <SelectItem key={label.id} value={label.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: label.color }}
                          />
                          {label.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {!isAddMode && editingRole && (
                <div>
                  <Label htmlFor="users-count">Number of Users</Label>
                  <Input
                    id="users-count"
                    type="number"
                    value={editingRole.user_count}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
              )}
            </div>
            <div>
              <Label>Permissions</Label>

              {/* Quick add (optional) */}
              {/* <div className="flex gap-2 mt-2">
                <Input 
                  placeholder="Create a new permission (e.g., 'users.read')"
                  value={newPermissionName}
                  onChange={(e) => setNewPermissionName(e.target.value)}
                  className="max-w-md"
                />
                <Button type="button" variant="secondary" onClick={handleQuickAddPermission}>
                  Add
                </Button>
              </div> */}

              <div className="grid grid-cols-2 gap-2 mt-3 max-h-60 overflow-y-auto border p-4 rounded bg-muted/50">
                {permissionsLoading ? (
                  <div className="col-span-2 flex items-center justify-center py-6 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading permissions...
                  </div>
                ) : modalPermissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground col-span-2 text-center py-4">
                    No permissions defined yet. Add one above to get started.
                  </p>
                ) : (
                  modalPermissions.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPermissionIds.includes(perm.id)}
                        onChange={(e) => handlePermissionChange(perm.id, e.target.checked)}
                      />
                      <span className="text-sm">{perm.permission_name}</span>
                    </label>
                  ))
                )}
              </div>
              {assigning && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Applying permissions...
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSaveRole} disabled={!roleName.trim() || saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {isAddMode ? 'Add Role' : 'Save Changes'}
              </Button>
            </div>
          </div>
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
