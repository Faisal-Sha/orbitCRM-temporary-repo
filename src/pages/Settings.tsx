
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import Organization from "@/pages/settings/Organization";
import UsersAndRoles from "@/pages/settings/UsersAndRoles";
import Data from "@/pages/settings/Data";
import Communication from "@/pages/settings/Communication";
import BillingAndRCM from "@/pages/settings/BillingAndRCM";
import Integrations from "@/pages/settings/Integrations";
import SystemAndSecurity from "@/pages/settings/SystemAndSecurity";
import { useAuthz } from "@/hooks/useAuthz";

const Settings = () => {
  const { can, isLoading } = useAuthz();

  if (isLoading) {
    return (
      <PageContainer
        title="Settings"
        description="Configure application settings and preferences"
      >
        <div className="flex items-center justify-center h-40">
          Loading...
        </div>
      </PageContainer>
    );
  }

  // Check if user is owner (has all settings access)
  const isOwner = can("owner.view");
  
  // Check if user has admin role (limited settings access)
  const hasAdminAccess = can("settings.view");

  // If user has no access at all, show access denied
  if (!isOwner && !hasAdminAccess) {
    return (
      <PageContainer
        title="Settings"
        description="Configure application settings and preferences"
      >
        <div className="flex items-center justify-center h-40 text-muted-foreground">
          Access denied. You don't have permission to view settings.
        </div>
      </PageContainer>
    );
  }

  // Define all tabs for owners
  const ownerTabs = [
    { value: "organization", label: "Organization", content: <Organization /> },
    { value: "users-roles", label: "Users & Roles", content: <UsersAndRoles /> },
    { value: "data", label: "Data", content: <Data /> },
    { value: "communication", label: "Communication", content: <Communication /> },
    { value: "billing-rcm", label: "Services & Billing", content: <BillingAndRCM /> },
    { value: "integrations", label: "Integrations", content: <Integrations /> },
    { value: "system-security", label: "System & Security", content: <SystemAndSecurity /> },
  ];

  // Define limited tabs for agency admins (only Services & Billing)
  const adminTabs = [
    { value: "billing-rcm", label: "Services & Billing", content: <BillingAndRCM /> },
  ];

  // Use appropriate tabs based on user role
  const tabs = isOwner ? ownerTabs : adminTabs;
  const defaultTab = isOwner ? "organization" : "billing-rcm";

  return (
    <PageContainer
      title="Settings"
      description="Configure application settings and preferences"
    >
      <TabsComponent tabs={tabs} defaultTab={defaultTab} />
    </PageContainer>
  );
};

export default Settings;
