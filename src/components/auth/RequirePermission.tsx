// src/components/auth/RequirePermission.tsx
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthz } from "@/hooks/useAuthz";

export const RequirePermission = ({ perm }: { perm: string }) => {
  const { can, isLoading } = useAuthz();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Checking access…
      </div>
    );
  }

  if (!can(perm)) return <Navigate to="/" replace />;
  return <Outlet />;
};
