
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import Organization from "@/pages/settings/Organization";
import UsersAndRoles from "@/pages/settings/UsersAndRoles";
import Data from "@/pages/settings/Data";
import Communication from "@/pages/settings/Communication";
import BillingAndRCM from "@/pages/settings/BillingAndRCM";
import Integrations from "@/pages/settings/Integrations";
import SystemAndSecurity from "@/pages/settings/SystemAndSecurity";

const Settings = () => {
  const tabs = [
    { value: "organization", label: "Organization", content: <Organization /> },
    { value: "users-roles", label: "Users & Roles", content: <UsersAndRoles /> },
    { value: "data", label: "Data", content: <Data /> },
    { value: "communication", label: "Communication", content: <Communication /> },
    { value: "billing-rcm", label: "Services & Billing", content: <BillingAndRCM /> },
    { value: "integrations", label: "Integrations", content: <Integrations /> },
    { value: "system-security", label: "System & Security", content: <SystemAndSecurity /> },
  ];

  return (
    <PageContainer
      title="Settings"
      description="Configure application settings and preferences"
    >
      <TabsComponent tabs={tabs} defaultTab="organization" />
    </PageContainer>
  );
};

export default Settings;
