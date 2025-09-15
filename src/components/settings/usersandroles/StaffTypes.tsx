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
import { useDataLabels } from "@/hooks/useDataLabels";
import { RoleLabel } from "@/components/ui/role-label";
import { PermissionWithAssigned, usePermissions } from "@/hooks/usePermissions";

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

// Allowed enum values (keys)
const STAFF_TYPE_ENUM_VALUES = [
  'specialist_marketer',
  'clinical_assessor',
  'clinical_supervisor',
  'case_manager',
  'admin_support',
  'sales_rep',
  'specialist_hr',
  'specialist_it',
  'specialist_finance',
  'leadership_team_lead',
  'leadership_exec',
] as const;

type StaffTypeEnumLiteral = typeof STAFF_TYPE_ENUM_VALUES[number];

const isValidStaffType = (v: string): v is StaffTypeEnumLiteral =>
  STAFF_TYPE_ENUM_VALUES.includes(v as StaffTypeEnumLiteral);

interface StaffTypesProps {
  onBack: () => void;
}

const StaffTypes: React.FC<StaffTypesProps> = ({ onBack }) => {
  const [modalPermissions, setModalPermissions] = useState<PermissionWithAssigned[]>([]);
  const { staffTypes, loading, addStaffType, updateStaffType, deleteStaffType } = useStaffTypes();
  const { labels = [], loading: labelsLoading } = useDataLabels();

  const {
    permissions,
    loading: permissionsLoading,
    fetchPermissionsForStaffType,
    setStaffTypePermissions,
    addPermission,
  } = usePermissions();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [staffTypeError, setStaffTypeError] = useState<string | null>(null);

  const [editing, setEditing] = useState<{
    id?: string;
    staff_type: StaffTypeEnum | '';
    staff_type_label_id?: string | null;
    count?: number;
  } | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffTypeToDelete, setStaffTypeToDelete] = useState<string | null>(null);

  const [selectedLabelId, setSelectedLabelId] = useState<string>('no-label');

  // NEW: permissions state (same as Roles page)
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [newPermissionName, setNewPermissionName] = useState("");
  const [assigning, setAssigning] = useState(false);

  const itemsPerPage = 25;
  const filteredStaffTypes = staffTypes.filter(st => {
    const label = STAFF_TYPE_OPTIONS.find(o => o.value === st.staff_type)?.label || st.staff_type;
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredStaffTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filteredStaffTypes.slice(startIndex, startIndex + itemsPerPage);

  const handleAdd = async () => {
    setIsAddMode(true);
    setEditing({
      staff_type: '' as StaffTypeEnum,
      staff_type_label_id: null,
      count: 0
    });
    setSelectedLabelId('no-label');
    setSelectedPermissionIds([]); // reset permissions
    setIsModalOpen(true);

    // fetch the filtered/visible permissions for a new role
    const dummyId = "00000000-0000-0000-0000-000000000000";
    try {
      const visible = await fetchPermissionsForStaffType(dummyId);
      setModalPermissions(visible);
    } catch {
      setModalPermissions([]);
    }
  };

  const handleEdit = async (st: any) => {
    setIsAddMode(false);
    setEditing({
      id: st.id,
      staff_type: st.staff_type,
      staff_type_label_id: st.staff_type_label_id || null,
      count: st.count
    });
    setSelectedLabelId(st.staff_type_label_id || 'no-label');
    setIsModalOpen(true);

    // preload assigned permissions for this staff type
    try {
      const visible = await fetchPermissionsForStaffType(st.id);
      setModalPermissions(visible);
      setSelectedPermissionIds(visible.filter(v => v.assigned).map(v => v.id)); 
    } catch {
      setModalPermissions([]);
      setSelectedPermissionIds([]);
    }
  };

  const handleSave = async () => {
    if (!editing?.staff_type) return;
    if (!isValidStaffType(editing.staff_type)) {
      setStaffTypeError(
        "Invalid value. Must match one of: " + STAFF_TYPE_ENUM_VALUES.join(", ")
      );
      return;
    }
    setStaffTypeError(null);
    setSaving(true);
    try {
      const labelId = selectedLabelId === 'no-label' ? undefined : selectedLabelId;
      if (isAddMode) {
        const res = await addStaffType(editing.staff_type as StaffTypeEnum, labelId);
        if (res.success && res.staff_type_id) {
          // apply permissions if some are selected
          if (selectedPermissionIds.length > 0) {
            setAssigning(true);
            await setStaffTypePermissions(res.staff_type_id, selectedPermissionIds);
            setAssigning(false);
          }
          setIsModalOpen(false);
          setEditing(null);
          setSelectedPermissionIds([]);
        }
      } else if (editing?.id) {
        const res = await updateStaffType(editing.id, editing.staff_type as StaffTypeEnum, labelId);
        if (res.success) {
          setAssigning(true);
          await setStaffTypePermissions(editing.id, selectedPermissionIds);
          setAssigning(false);
          setIsModalOpen(false);
          setEditing(null);
          setSelectedPermissionIds([]);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setStaffTypeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (staffTypeToDelete) {
      const res = await deleteStaffType(staffTypeToDelete);
      if (res.success) {
        setDeleteDialogOpen(false);
        setStaffTypeToDelete(null);
      }
    }
  };

  // Toggle permission assignment (same as Roles page)
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissionIds(prev =>
      checked ? Array.from(new Set([...prev, permissionId])) : prev.filter(id => id !== permissionId)
    );
  };

  // Optional quick permission creator (same as Roles page; keep commented if you don’t want it live)
  const handleQuickAddPermission = async () => {
    const name = newPermissionName.trim();
    if (!name) return;
    const res = await addPermission(name);
    if (res.success && res.permission_id) {
      setNewPermissionName("");
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
            <CardTitle>Staff Types Management</CardTitle>
            <Button onClick={handleAdd}>
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
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
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
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        No staff types found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((st) => {
                      const display = STAFF_TYPE_OPTIONS.find(o => o.value === st.staff_type)?.label || st.staff_type;
                      return (
                        <TableRow key={st.id}>
                          <TableCell>
                            {st.label_color ? (
                              <RoleLabel
                                roleName={display}
                                labelColor={st.label_color}
                                textColor={st.text_color || 'black'}
                                fontWeight={st.font_weight || 'normal'}
                              />
                            ) : (
                              <p className="font-medium">{display}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{st.count} staff</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(st)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(st.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal layout */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddMode ? 'Add Staff Type' : 'Edit Staff Type'}</DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Staff Type */}
                <div>
                  <Label htmlFor="staff-type">Staff Type</Label>
                  <Input
                    id="staff-type"
                    placeholder="e.g., specialist_it"
                    value={editing.staff_type}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      setEditing((prev) => (prev ? { ...prev, staff_type: v as StaffTypeEnum } : prev));
                    }}
                  />
                  {staffTypeError && (
                    <p className="text-sm text-destructive mt-1">{staffTypeError}</p>
                  )}
                </div>

                {/* Optional Label */}
                <div>
                  <Label htmlFor="staff-type-label">Label (Optional)</Label>
                  <Select
                    value={selectedLabelId}
                    onValueChange={setSelectedLabelId}
                    disabled={labelsLoading}
                  >
                    <SelectTrigger id="staff-type-label">
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

                {/* Count (read-only like “Users” field in Roles edit) */}
                {!isAddMode && typeof editing.count === 'number' && (
                  <div>
                    <Label htmlFor="staff-count">Count</Label>
                    <Input
                      id="staff-count"
                      type="number"
                      value={editing.count}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                )}
              </div>

              {/* Permissions (now functional, mirrors Roles) */}
              <div>
                <Label>Permissions</Label>

                {/* Quick add (optional) — keep commented to match Roles page */}
                {/* <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Create a new permission (e.g., 'patients.read')"
                    value={newPermissionName}
                    onChange={(e) => setNewPermissionName(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                <div className="mt-2">
                  <Button type="button" variant="secondary" onClick={handleQuickAddPermission}>
                    Add Permission
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
                <Button onClick={handleSave} disabled={saving || !editing.staff_type}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
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
        onConfirm={confirmDelete}
        title="Delete Staff Type"
        description="Are you sure you want to delete this staff type? This action cannot be undone."
      />
    </div>
  );
};

export default StaffTypes;
