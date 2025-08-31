
import { useRef } from "react";
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import PersonalInfo from "@/pages/profile/PersonalInfo";
import Security from "@/pages/profile/Security";
import Preferences from "@/pages/profile/Preferences";

const Profile = () => {
  const personalInfoRef = useRef<{ hasUnsavedChanges: () => boolean; showUnsavedModal: () => Promise<boolean> }>(null);
  
  const tabs = [
    { value: "info", label: "Personal Info", content: <PersonalInfo ref={personalInfoRef} /> },
    { value: "security", label: "Security", content: <Security /> },
    { value: "preferences", label: "Preferences", content: <Preferences /> },
  ];

  const handleTabChange = async (newTab: string, currentTab: string): Promise<boolean> => {
    // Only check for unsaved changes when leaving the PersonalInfo tab
    if (currentTab === 'info' && personalInfoRef.current) {
      if (personalInfoRef.current.hasUnsavedChanges()) {
        return await personalInfoRef.current.showUnsavedModal();
      }
    }
    return true;
  };

  return (
    <PageContainer
      title="Profile"
      description="View and update your profile information"
    >
      <TabsComponent tabs={tabs} defaultTab="info" onTabChange={handleTabChange} />
    </PageContainer>
  );
};

export default Profile;
