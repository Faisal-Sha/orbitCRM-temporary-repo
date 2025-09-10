import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Program {
  id: string;
  name: string;
  // get_programs_with_goals returns an array of goal names
  goals: string[];
}

interface RpcResult {
  success: boolean;
  message?: string;
  program_id?: string;
}

export const useProgramsGoals = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.rpc("get_programs_with_goals");
      if (error) throw error;

      const arr = (data as unknown as Program[]) ?? [];
      setPrograms(arr);
    } catch (err: any) {
      const msg = err?.message ?? "Failed to load programs";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  const addProgram = async (name: string, goals: string[]) => {
    if (!name.trim()) {
      toast.error("Program name is required");
      return { success: false, message: "Program name is required" };
    }
    const validGoals = goals.filter((g) => g.trim() !== "");
    if (validGoals.length < 1) {
      toast.error("At least one goal is required");
      return { success: false, message: "At least one goal is required" };
    }

    try {
      setSaving(true);
      const { data, error } = await supabase.rpc("add_program_with_goals", {
        p_program_name: name.trim(),
        p_goals: validGoals.map((g) => ({ name: g.trim() })),
      });
      if (error) throw error;
      const res = data as unknown as RpcResult;
      if (!res?.success) {
        toast.error(res?.message ?? "Failed to add program");
        return { success: false, message: res?.message };
      }
      toast.success(res?.message ?? "Program added");
      await refetch();
      return { success: true };
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to add program");
      return { success: false, message: err?.message };
    } finally {
      setSaving(false);
    }
  };

  const updateProgram = async (id: string, name: string, goals: string[]) => {
    if (!id) return { success: false, message: "Program id is required" };
    if (!name.trim()) {
      toast.error("Program name is required");
      return { success: false, message: "Program name is required" };
    }
    const validGoals = goals.filter((g) => g.trim() !== "");
    if (validGoals.length < 1) {
      toast.error("At least one goal is required");
      return { success: false, message: "At least one goal is required" };
    }

    try {
      setSaving(true);
      const { data, error } = await supabase.rpc("update_program_with_goals", {
        p_program_id: id,
        p_program_name: name.trim(),
        p_goals: validGoals.map((g) => ({ name: g.trim() })),
      });
      if (error) throw error;
      const res = data as unknown as RpcResult;
      if (!res?.success) {
        toast.error(res?.message ?? "Failed to update program");
        return { success: false, message: res?.message };
      }
      toast.success(res?.message ?? "Program updated");
      await refetch();
      return { success: true };
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update program");
      return { success: false, message: err?.message };
    } finally {
      setSaving(false);
    }
  };

  const deleteProgram = async (id: string) => {
    if (!id) return { success: false, message: "Program id is required" };
    try {
      setSaving(true);
      const { data, error } = await supabase.rpc("delete_program_with_goals", {
        p_program_id: id,
      });
      if (error) throw error;
      const res = data as unknown as RpcResult;
      if (!res?.success) {
        toast.error(res?.message ?? "Failed to delete program");
        return { success: false, message: res?.message };
      }
      toast.success(res?.message ?? "Program deleted");
      await refetch();
      return { success: true };
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete program");
      return { success: false, message: err?.message };
    } finally {
      setSaving(false);
    }
  };

  return {
    programs,
    loading,
    saving,
    error,
    refetch,
    addProgram,
    updateProgram,
    deleteProgram,
  };
};
