
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Shield, UserPlus, Settings, Loader2 } from "lucide-react";
import { useState } from "react";
import UserRoles from "@/components/settings/usersandroles/UserRoles";
import StaffTypes from "@/components/settings/usersandroles/StaffTypes";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useStaffTypes } from "@/hooks/useStaffTypes";
import { RoleLabel } from "@/components/ui/role-label";

// Staff type enum display mapping
const STAFF_TYPE_LABELS: Record<string, string> = {
  'specialist_marketer': 'Specialist - Marketer',
  'clinical_assessor': 'Clinical Assessor',
  'clinical_supervisor': 'Clinical Supervisor',
  'case_manager': 'Case Manager',
  'admin_support': 'Admin Support',
  'sales_rep': 'Sales Representative',
  'specialist_hr': 'Specialist - HR',
  'specialist_it': 'Specialist - IT',
  'specialist_finance': 'Specialist - Finance',
  'leadership_team_lead': 'Leadership - Team Lead',
  'leadership_exec': 'Leadership - Executive'
};

const UsersAndRoles = () => {
  const [showUserRoles, setShowUserRoles] = useState(false);
  const [showStaffTypes, setShowStaffTypes] = useState(false);
  const { roles, loading } = useUserRoles();
  const { staffTypes, loading: staffTypesLoading } = useStaffTypes();

  // Show up to 3 roles on main tab
  const displayRoles = roles.slice(0, 3);

  // Show up to 3 staff types on main tab
  const displayStaffTypes = staffTypes.slice(0, 3);

  if (showUserRoles) {
    return <UserRoles onBack={() => setShowUserRoles(false)} />;
  }

  if (showStaffTypes) {
    return <StaffTypes onBack={() => setShowStaffTypes(false)} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Roles & Permissions ({loading ? '...' : roles.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading roles...
            </div>
          ) : (
            <div className="space-y-4">
              {displayRoles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No roles configured yet</p>
                  <p className="text-sm">Click "Manage Roles" to get started</p>
                </div>
              ) : (
                displayRoles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <RoleLabel
                        roleName={role.role_name}
                        labelColor={role.label_color}
                        textColor={role.text_color}
                        fontWeight={role.font_weight}
                        className="mb-2"
                      />
                      <p className="text-sm text-muted-foreground">{role.user_count} users • Permissions not configured</p>
                    </div>
                    <Badge variant="outline">{role.user_count}</Badge>
                  </div>
                ))
              )}
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => setShowUserRoles(true)}>
                  View All Roles
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff Types ({staffTypesLoading ? '...' : staffTypes.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {staffTypesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading staff types...
            </div>
          ) : (
            <div className="space-y-4">
              {displayStaffTypes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No staff types configured yet</p>
                  <p className="text-sm">Click "View All Staff Types" to get started</p>
                </div>
              ) : (
                displayStaffTypes.map((staffType) => (
                  <div key={staffType.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{STAFF_TYPE_LABELS[staffType.staff_type] || staffType.staff_type}</p>
                      <p className="text-sm text-muted-foreground">{staffType.count} staff members</p>
                    </div>
                    <Badge variant="outline">{staffType.count}</Badge>
                  </div>
                ))
              )}
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => setShowStaffTypes(true)}>
                  View All Staff Types
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersAndRoles;
