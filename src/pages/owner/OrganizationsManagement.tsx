import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Organization {
  id: string;
  organization_name: string;
  organization_state: string | null;
  status: "active" | "inactive" | "deleted";
  created_at: string;
  admin_first_name: string | null;
  admin_last_name: string | null;
  admin_email: string | null;
  user_count: number;
  storage_used: string;
}

interface SoftDeleteResponse {
  organization_id: string;
  success: boolean;
  message: string;
}

const OrganizationsManagement = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    status: "active" as "active" | "inactive"
  });
  const { toast } = useToast();

  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
  ];

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_organizations_with_admins');
      
      if (error) {
        console.error('Error fetching organizations:', error);
        toast({
          title: "Error",
          description: "Failed to fetch organizations",
          variant: "destructive",
        });
        return;
      }

      // Ensure each organization has organization_state field, defaulting to null if missing
      const normalizedData = (data || []).map((org: any) => ({
        ...org,
        organization_state: org.organization_state || null
      })) as Organization[];

      console.log('Fetched organizations data:', normalizedData);
      setOrganizations(normalizedData);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleAdd = async () => {
    if (!formData.name || !formData.state || !formData.adminFirstName || !formData.adminLastName || !formData.adminEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create organizations",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.rpc('create_organization_with_admin', {
        organization_name: formData.name,
        organization_state: formData.state,
        admin_first_name: formData.adminFirstName,
        admin_last_name: formData.adminLastName,
        admin_email: formData.adminEmail,
        created_by_user_id: user.id
      });

      if (error) {
        console.error('Error creating organization:', error);
        toast({
          title: "Error",
          description: "Failed to create organization",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Organization created successfully",
      });

      setFormData({ 
        name: "", 
        state: "", 
        adminFirstName: "", 
        adminLastName: "", 
        adminEmail: "", 
        status: "active" 
      });
      setIsAddDialogOpen(false);
      fetchOrganizations();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedOrg || !formData.name || !formData.state || !formData.adminFirstName || !formData.adminLastName || !formData.adminEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to update organizations",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.rpc('update_organization_with_admin', {
        org_id: selectedOrg.id,
        organization_name: formData.name,
        organization_state: formData.state,
        organization_status: formData.status as "active" | "inactive" | "deleted",
        admin_first_name: formData.adminFirstName,
        admin_last_name: formData.adminLastName,
        admin_email: formData.adminEmail,
        updated_by_user_id: user.id
      });

      if (error) {
        console.error('Error updating organization:', error);
        toast({
          title: "Error",
          description: "Failed to update organization",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Organization updated successfully",
      });

      setIsEditDialogOpen(false);
      setSelectedOrg(null);
      fetchOrganizations();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedOrg) return;

    try {
      console.log('Starting delete operation for organization:', selectedOrg.id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found, aborting delete');
        toast({
          title: "Error",
          description: "You must be logged in to delete organizations",
          variant: "destructive",
        });
        return;
      }

      console.log('User found:', user.id);
      console.log('Calling soft_delete_organization function...');

      const { data, error } = await supabase.rpc('soft_delete_organization', {
        org_id: selectedOrg.id,
        deleting_user_id: user.id
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Error deleting organization:', error);
        toast({
          title: "Error", 
          description: `Failed to delete organization: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      const response = data as unknown as SoftDeleteResponse;

      if (!response || !response.success) {
        console.error('Delete operation failed:', response?.message || 'Unknown error');
        toast({
          title: "Error",
          description: response?.message || "Failed to delete organization",
          variant: "destructive",
        });
        return;
      }

      console.log('Successfully deleted organization:', response);

      toast({
        title: "Success",
        description: "Organization deleted successfully",
      });

      setIsDeleteDialogOpen(false);
      setSelectedOrg(null);
      
      // Force immediate refresh of organizations list
      await fetchOrganizations();
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setFormData({ 
      name: "", 
      state: "", 
      adminFirstName: "", 
      adminLastName: "", 
      adminEmail: "", 
      status: "active" 
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (org: Organization) => {
    setSelectedOrg(org);
    setFormData({
      name: org.organization_name,
      state: org.organization_state || "",
      adminFirstName: org.admin_first_name || "",
      adminLastName: org.admin_last_name || "",
      adminEmail: org.admin_email || "",
      status: org.status === "deleted" ? "inactive" : org.status as "active" | "inactive"
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (org: Organization) => {
    setSelectedOrg(org);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case "deleted":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Deleted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Organizations Management</h2>
            <p className="text-muted-foreground">Manage all organizations on the platform</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading organizations...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Organizations Management</h2>
          <p className="text-muted-foreground">Manage all organizations on the platform</p>
        </div>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Organization
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.organization_name}</TableCell>
                  <TableCell>{org.organization_state || "N/A"}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {org.admin_first_name && org.admin_last_name 
                          ? `${org.admin_first_name} ${org.admin_last_name}`
                          : "No admin assigned"
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {org.admin_email || "No email"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{org.user_count}</TableCell>
                  <TableCell>{org.storage_used}</TableCell>
                  <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(org.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(org)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(org)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Organization Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Organization</DialogTitle>
            <DialogDescription>
              Create a new organization account on the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter organization name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {usStates.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="adminFirstName">Admin Name</Label>
                <Input
                  id="adminFirstName"
                  value={formData.adminFirstName}
                  onChange={(e) => setFormData({ ...formData, adminFirstName: e.target.value })}
                  placeholder="Enter admin first name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="adminLastName">Admin Surname</Label>
                <Input
                  id="adminLastName"
                  value={formData.adminLastName}
                  onChange={(e) => setFormData({ ...formData, adminLastName: e.target.value })}
                  placeholder="Enter admin last name"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={formData.adminEmail}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                placeholder="Enter admin email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Organization</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Organization Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>
              Update organization details and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editName">Organization Name</Label>
              <Input
                id="editName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter organization name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editState">State</Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {usStates.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editAdminFirstName">Admin Name</Label>
                <Input
                  id="editAdminFirstName"
                  value={formData.adminFirstName}
                  onChange={(e) => setFormData({ ...formData, adminFirstName: e.target.value })}
                  placeholder="Enter admin first name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editAdminLastName">Admin Surname</Label>
                <Input
                  id="editAdminLastName"
                  value={formData.adminLastName}
                  onChange={(e) => setFormData({ ...formData, adminLastName: e.target.value })}
                  placeholder="Enter admin last name"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editAdminEmail">Admin Email</Label>
              <Input
                id="editAdminEmail"
                type="email"
                value={formData.adminEmail}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                placeholder="Enter admin email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editStatus">Status</Label>
              <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Organization</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedOrg?.organization_name}"? This action cannot be undone and will permanently remove all data associated with this organization.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationsManagement;
