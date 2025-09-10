import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Admin {
  first_name: string;
  last_name: string;
  email: string;
}

export interface Agency {
  id: string;
  agency_name: string;
  agency_state: string | null;
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

export const useAgencies = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
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

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_agencies_with_admins');
      
      if (error) {
        console.error('Error fetching agencies:', error);
        toast({
          title: "Error",
          description: "Failed to fetch agencies",
          variant: "destructive",
        });
        return;
      }

      // Ensure each agency has agency_state field, defaulting to null if missing
      const normalizedData = (data || []).map((agency: any) => {
        console.log('Raw agency from DB:', agency);
        console.log('agency.admins type:', typeof agency.admins);
        console.log('agency.admins value:', agency.admins);
        console.log('agency.admins.length:', agency.admins?.length);
        console.log('Array.isArray(org.admins):', Array.isArray(agency.admins));
        
        // Parse admins if it's a JSON string
        let parsedAdmins = agency.admins;
        if (typeof agency.admins === 'string') {
          try {
            parsedAdmins = JSON.parse(agency.admins);
            console.log('Parsed admins from string:', parsedAdmins);
          } catch (e) {
            console.error('Failed to parse admins JSON:', e);
            parsedAdmins = [];
          }
        }
        
        const normalizedAgency = {
          ...agency,
          agency_state: agency.agency_state || null,
          admins: Array.isArray(parsedAdmins) ? parsedAdmins : []
        };
        
        console.log('Normalized agency.admins:', normalizedAgency.admins);
        console.log('Normalized agency.admins.length:', normalizedAgency.admins.length);
        
        return normalizedAgency;
      }) as Agency[];

      console.log('Final normalized data:', normalizedData);
      setAgencies(normalizedData);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch agencies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
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
          description: "You must be logged in to create agencies",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-agency', {
        body: {
          agencyName: formData.name,
          agencyState: formData.state,
          agencyStatus: formData.status,
          adminFirstName: formData.adminFirstName,
          adminLastName: formData.adminLastName,
          adminEmail: formData.adminEmail,
          createdByUserId: user.id
        }
      });

      if (error) {
        console.error('Error creating agency:', error);
        toast({
          title: "Error",
          description: "Failed to create agency",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Agency created and invitation email sent successfully",
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
      fetchAgencies();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create agency",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedAgency || !formData.name || !formData.state || !formData.adminFirstName || !formData.adminLastName || !formData.adminEmail) {
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
          description: "You must be logged in to update agencies",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.rpc('update_agency_with_admin', {
        agency_id: selectedAgency.id,
        agency_name: formData.name,
        agency_state: formData.state,
        agency_status: formData.status as "active" | "inactive" | "deleted",
        admin_first_name: formData.adminFirstName,
        admin_last_name: formData.adminLastName,
        admin_email: formData.adminEmail,
        updated_by_user_id: user.id
      });

      if (error) {
        console.error('Error updating agency:', error);
        toast({
          title: "Error",
          description: "Failed to update agency",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Agency updated successfully",
      });

      setIsEditDialogOpen(false);
      setSelectedAgency(null);
      fetchAgencies();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update agency",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedAgency) return;

    try {
      console.log('Starting delete operation for agency:', selectedAgency.id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found, aborting delete');
        toast({
          title: "Error",
          description: "You must be logged in to delete agencies",
          variant: "destructive",
        });
        return;
      }

      console.log('User found:', user.id);
      console.log('Calling soft_delete_agency function...');

      const { data, error } = await supabase.rpc('soft_delete_agency', {
        agency_id: selectedAgency.id,
        deleting_user_id: user.id
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Error deleting agency:', error);
        toast({
          title: "Error", 
          description: `Failed to delete agency: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      const response = data as unknown as SoftDeleteResponse;

      if (!response || !response.success) {
        console.error('Delete operation failed:', response?.message || 'Unknown error');
        toast({
          title: "Error",
          description: response?.message || "Failed to delete agency",
          variant: "destructive",
        });
        return;
      }

      console.log('Successfully deleted agency:', response);

      toast({
        title: "Success",
        description: "Agency deleted successfully",
      });

      setIsDeleteDialogOpen(false);
      setSelectedAgency(null);
      
      // Force immediate refresh of agencies list
      await fetchAgencies();
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast({
        title: "Error",
        description: "Failed to delete agency",
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

  const openEditDialog = (agency: Agency) => {
    setSelectedAgency(agency);
    const firstAdmin = agency.admins[0] || { first_name: "", last_name: "", email: "" };
    setFormData({
      name: agency.agency_name,
      state: agency.agency_state || "",
      adminFirstName: firstAdmin.first_name,
      adminLastName: firstAdmin.last_name,
      adminEmail: firstAdmin.email,
      status: agency.status === "deleted" ? "inactive" : agency.status as "active" | "inactive"
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (agency: Agency) => {
    setSelectedAgency(agency);
    setIsDeleteDialogOpen(true);
  };

  return {
    // State
    agencies,
    loading,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    selectedAgency,
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