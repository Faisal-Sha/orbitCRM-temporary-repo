
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import PersonalInfo from "@/pages/profile/PersonalInfo";
import Security from "@/pages/profile/Security";
import Preferences from "@/pages/profile/Preferences";
import { UnsavedChangesProvider } from "@/contexts/UnsavedChangesContext";

const Profile = () => {
  const tabs = [
    { value: "info", label: "Personal Info", content: <PersonalInfo /> },
    { value: "security", label: "Security", content: <Security /> },
    { value: "preferences", label: "Preferences", content: <Preferences /> },
  ];

  return (
    <PageContainer
      title="Profile"
      description="View and update your profile information"
    >
      <UnsavedChangesProvider>
        <TabsComponent tabs={tabs} defaultTab="info" />
      </UnsavedChangesProvider>
    </PageContainer>
  );
};

export default Profile;
