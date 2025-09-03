
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Shield, UserPlus, Settings } from "lucide-react";
import { useState } from "react";
import UserRoles from "@/components/settings/usersandroles/UserRoles";
import StaffTypes from "@/components/settings/usersandroles/StaffTypes";

const UsersAndRoles = () => {
  const [showUserRoles, setShowUserRoles] = useState(false);
  const [showStaffTypes, setShowStaffTypes] = useState(false);

  // Show up to 5 users on main tab
  const displayUsers: any[] = [];

  // Show up to 5 roles on main tab
  const displayRoles: any[] = [];

  // Show up to 5 staff types on main tab
  const displayStaffTypes: any[] = [];

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
              Roles & Permissions (0)
            </CardTitle>
            <Button onClick={() => setShowUserRoles(true)}>
              Manage Roles
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayRoles.map((role, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{role.name}</p>
                  <p className="text-sm text-gray-500">{role.users} users • {role.permissions}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff Types (0)
            </CardTitle>
            <Button onClick={() => setShowStaffTypes(true)}>
              Manage Staff Types
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayStaffTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{type.name}</p>
                  <p className="text-sm text-gray-500">{type.count} staff members</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersAndRoles;
