import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  state: string;
  adminName: string;
  adminSurname: string;
  adminEmail: string;
  userCount: number;
  storageUsed: string;
  dateCreated: string;
  status: "active" | "suspended" | "inactive";
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
    adminName: "",
    adminSurname: "",
    adminEmail: "",
    status: "active" as "active" | "suspended" | "inactive"
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

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      // Fetch organizations with admin details
      const { data: orgsData, error: orgsError } = await supabase
        .from('app_organizations')
        .select(`
          id,
          organization_name,
          status,
          created_at,
          app_organization_admins!inner (
            admin_id,
            people!inner (
              id,
              first_name,
              last_name,
              people_contacts!inner (
                email
              )
            )
          )
        `)
        .eq('is_deleted', false);

      if (orgsError) {
        console.error('Error fetching organizations:', orgsError);
        toast({
          title: "Error",
          description: "Failed to fetch organizations",
          variant: "destructive",
        });
        return;
      }

      // Transform data to match UI structure
      const transformedOrgs: Organization[] = (orgsData || []).map(org => ({
        id: org.id,
        name: org.organization_name || '',
        state: 'California', // TODO: Add state field to database
        adminName: org.app_organization_admins?.[0]?.people?.first_name || '',
        adminSurname: org.app_organization_admins?.[0]?.people?.last_name || '',
        adminEmail: org.app_organization_admins?.[0]?.people?.people_contacts?.[0]?.email || '',
        userCount: 0, // TODO: Calculate actual user count
        storageUsed: "0 MB", // TODO: Calculate actual storage
        dateCreated: new Date(org.created_at).toLocaleDateString(),
        status: org.status as "active" | "suspended" | "inactive"
      }));

      setOrganizations(transformedOrgs);
    } catch (error) {
      console.error('Error in fetchOrganizations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.state || !formData.adminName || !formData.adminSurname || !formData.adminEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Call the edge function to create the complete organization workflow
      const { data, error } = await supabase.functions.invoke('create-organization', {
        body: {
          organizationName: formData.name,
          state: formData.state,
          status: formData.status,
          adminName: formData.adminName,
          adminSurname: formData.adminSurname,
          adminEmail: formData.adminEmail
        }
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
        description: "Organization created successfully and invitation sent to admin",
      });
      
      setFormData({ 
        name: "", 
        state: "", 
        adminName: "", 
        adminSurname: "", 
        adminEmail: "", 
        status: "active" 
      });
      setIsAddDialogOpen(false);
      fetchOrganizations(); // Refresh the list
    } catch (error) {
      console.error('Error in handleAdd:', error);
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedOrg || !formData.name || !formData.state || !formData.adminName || !formData.adminSurname || !formData.adminEmail) {
      toast({
        title: "Error", 
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Update organization
      const { error: orgError } = await supabase
        .from('app_organizations')
        .update({ 
          organization_name: formData.name,
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedOrg.id);

      if (orgError) {
        console.error('Error updating organization:', orgError);
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
      fetchOrganizations(); // Refresh the list
    } catch (error) {
      console.error('Error in handleEdit:', error);
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedOrg) return;

    try {
      setLoading(true);
      
      // Soft delete organization
      const { error } = await supabase
        .from('app_organizations')
        .update({ 
          is_deleted: true,
          deleted_at: new Date().toISOString()
        })
        .eq('id', selectedOrg.id);

      if (error) {
        console.error('Error deleting organization:', error);
        toast({
          title: "Error",
          description: "Failed to delete organization",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Organization deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedOrg(null);
      fetchOrganizations(); // Refresh the list
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendToggle = async (org: Organization) => {
    try {
      const newStatus = org.status === "active" ? "suspended" : "active";
      
      const { error } = await supabase
        .from('app_organizations')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', org.id);

      if (error) {
        console.error('Error updating organization status:', error);
        toast({
          title: "Error",
          description: "Failed to update organization status",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Organization ${newStatus === "active" ? "activated" : "suspended"} successfully`,
      });
      
      fetchOrganizations(); // Refresh the list
    } catch (error) {
      console.error('Error in handleSuspendToggle:', error);
      toast({
        title: "Error",
        description: "Failed to update organization status",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setFormData({ 
      name: "", 
      state: "", 
      adminName: "", 
      adminSurname: "", 
      adminEmail: "", 
      status: "active" 
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (org: Organization) => {
    setSelectedOrg(org);
    setFormData({
      name: org.name,
      state: org.state,
      adminName: org.adminName,
      adminSurname: org.adminSurname,
      adminEmail: org.adminEmail,
      status: org.status
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
      case "suspended":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Suspended</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading organizations...
                  </TableCell>
                </TableRow>
              ) : organizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No organizations found
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>{org.state}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{org.adminName} {org.adminSurname}</div>
                        <div className="text-sm text-muted-foreground">{org.adminEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{org.userCount}</TableCell>
                    <TableCell>{org.storageUsed}</TableCell>
                    <TableCell>{org.dateCreated}</TableCell>
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
                          onClick={() => handleSuspendToggle(org)}
                          className={org.status === "active" ? "text-yellow-600" : "text-green-600"}
                        >
                          <AlertTriangle className="h-4 w-4" />
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Organization Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
            <div className="grid gap-2">
              <Label htmlFor="adminName">Admin Name</Label>
              <Input
                id="adminName"
                value={formData.adminName}
                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                placeholder="Enter admin first name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adminSurname">Admin Surname</Label>
              <Input
                id="adminSurname"
                value={formData.adminSurname}
                onChange={(e) => setFormData({ ...formData, adminSurname: e.target.value })}
                placeholder="Enter admin last name"
              />
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
              <Select value={formData.status} onValueChange={(value: "active" | "suspended" | "inactive") => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={loading}>
              {loading ? "Creating..." : "Add Organization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Organization Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
            <div className="grid gap-2">
              <Label htmlFor="editAdminName">Admin Name</Label>
              <Input
                id="editAdminName"
                value={formData.adminName}
                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                placeholder="Enter admin first name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editAdminSurname">Admin Surname</Label>
              <Input
                id="editAdminSurname"
                value={formData.adminSurname}
                onChange={(e) => setFormData({ ...formData, adminSurname: e.target.value })}
                placeholder="Enter admin last name"
              />
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
              <Select value={formData.status} onValueChange={(value: "active" | "suspended" | "inactive") => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Organization</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedOrg?.name}"? This action cannot be undone and will permanently remove all data associated with this organization.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete Organization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationsManagement;