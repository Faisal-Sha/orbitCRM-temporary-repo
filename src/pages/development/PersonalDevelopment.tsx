import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import PersonalOnboarding from "@/components/development/personal/Onboarding";
import PersonalGoals from "@/components/development/personal/Goals";
import PersonalTraining from "@/components/development/personal/Training";
import PersonalCertificates from "@/components/development/personal/Certificates";

const PersonalDevelopment = () => {
  const tabs = [
    { value: "onboarding", label: "Onboarding", content: <PersonalOnboarding /> },
    { value: "goals", label: "Goals", content: <PersonalGoals /> },
    { value: "training", label: "Training", content: <PersonalTraining /> },
    { value: "certificates", label: "Certificates", content: <PersonalCertificates /> },
  ];

  return (
    <PageContainer title="Personal Development" description="Personal development tools and resources">
      <TabsComponent tabs={tabs} defaultTab="onboarding" />
    </PageContainer>
  );
};

export default PersonalDevelopment;
