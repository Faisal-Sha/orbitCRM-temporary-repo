import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Admin {
  first_name: string;
  last_name: string;
  email: string;
}

export interface Organization {
  id: string;
  organization_name: string;
  organization_state: string | null;
  status: "active" | "inactive" | "deleted";
  created_at: string;
  admins: Admin[];
  user_count: number;
  storage_used: string;
}

interface SoftDeleteResponse {
  organization_id: string;
  success: boolean;
  message: string;
}

export interface FormData {
  name: string;
  state: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  status: "active" | "inactive";
}

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    state: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    status: "active"
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

      const { data, error } = await supabase.functions.invoke('create-organization', {
        body: {
          organizationName: formData.name,
          organizationState: formData.state,
          organizationStatus: formData.status,
          adminFirstName: formData.adminFirstName,
          adminLastName: formData.adminLastName,
          adminEmail: formData.adminEmail,
          createdByUserId: user.id
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
        description: "Organization created and invitation email sent successfully",
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
    const firstAdmin = org.admins[0] || { first_name: "", last_name: "", email: "" };
    setFormData({
      name: org.organization_name,
      state: org.organization_state || "",
      adminFirstName: firstAdmin.first_name,
      adminLastName: firstAdmin.last_name,
      adminEmail: firstAdmin.email,
      status: org.status === "deleted" ? "inactive" : org.status as "active" | "inactive"
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (org: Organization) => {
    setSelectedOrg(org);
    setIsDeleteDialogOpen(true);
  };

  return {
    // State
    organizations,
    loading,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    selectedOrg,
    formData,
    usStates,
    
    // Actions
    setFormData,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
  };
};