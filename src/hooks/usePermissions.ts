// src/hooks/usePermissions.ts
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Permission {
  id: string;
  permission_name: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionWithAssigned {
  id: string;
  permission_name: string;
  assigned: boolean;
}

interface RpcResponse {
  success: boolean;
  message?: string;
  permission_id?: string;
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.rpc("get_all_permissions");
      if (error) throw error;
      setPermissions(data || []);
    } catch (err: any) {
      console.error("Error fetching permissions:", err);
      setError(err.message || "Failed to fetch permissions");
      if (err.message?.includes("Access denied")) {
        toast.error("Access denied. Admin or owner role required to view permissions.");
      } else {
        toast.error("Failed to load permissions");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissionsForRole = async (roleId: string) => {
    try {
      const { data, error } = await supabase.rpc("get_permissions_with_assignments", {
        p_role_id: roleId,
      });
      if (error) throw error;
      return (data || []) as PermissionWithAssigned[];
    } catch (err: any) {
      console.error("Error fetching permissions for role:", err);
      toast.error(err.message || "Failed to load role permissions");
      return [] as PermissionWithAssigned[];
    }
  };

  const setRolePermissions = async (roleId: string, permissionIds: string[]) => {
    try {
      const { data, error } = await supabase.rpc("set_role_permissions", {
        p_role_id: roleId,
        p_permission_ids: permissionIds,
      });
      if (error) throw error;

      const resp = data as unknown as RpcResponse;
      if (resp?.success) {
        toast.success(resp.message || "Role permissions updated");
        return { success: true };
      }
      throw new Error(resp?.message || "Failed to update role permissions");
    } catch (err: any) {
      console.error("Error setting role permissions:", err);
      const msg = err.message || "Failed to update role permissions";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const addPermission = async (permissionName: string) => {
    try {
      const { data, error } = await supabase.rpc("add_permission", {
        p_permission_name: permissionName,
      });
      if (error) throw error;
      const resp = data as unknown as RpcResponse;
      if (resp?.success) {
        toast.success(resp.message || "Permission created");
        await fetchPermissions();
        return { success: true, permission_id: resp.permission_id };
      }
      throw new Error(resp?.message || "Failed to create permission");
    } catch (err: any) {
      console.error("Error adding permission:", err);
      const msg = err.message || "Failed to add permission";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const updatePermission = async (permissionId: string, permissionName: string) => {
    try {
      const { data, error } = await supabase.rpc("update_permission", {
        p_permission_id: permissionId,
        p_permission_name: permissionName,
      });
      if (error) throw error;
      const resp = data as unknown as RpcResponse;
      if (resp?.success) {
        toast.success(resp.message || "Permission updated");
        await fetchPermissions();
        return { success: true };
      }
      throw new Error(resp?.message || "Failed to update permission");
    } catch (err: any) {
      console.error("Error updating permission:", err);
      const msg = err.message || "Failed to update permission";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const deletePermission = async (permissionId: string) => {
    try {
      const { data, error } = await supabase.rpc("delete_permission", {
        p_permission_id: permissionId,
      });
      if (error) throw error;
      const resp = data as unknown as RpcResponse;
      if (resp?.success) {
        toast.success(resp.message || "Permission deleted");
        await fetchPermissions();
        return { success: true };
      }
      throw new Error(resp?.message || "Failed to delete permission");
    } catch (err: any) {
      console.error("Error deleting permission:", err);
      const msg = err.message || "Failed to delete permission";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return {
    permissions,
    loading,
    error,
    fetchPermissions,
    fetchPermissionsForRole,
    setRolePermissions,
    addPermission,
    updatePermission,
    deletePermission,
  };
};
