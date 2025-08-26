
import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import ActiveFiles from "@/pages/files/Active";
import ArchivedFiles from "@/pages/files/Archived";

const Files = () => {
  const tabs = [
    { value: "active", label: "Active", content: <ActiveFiles /> },
    { value: "archived", label: "Archived", content: <ArchivedFiles /> },
  ];

  return (
    <PageContainer
      title="Files"
      description="Manage your files and documents"
    >
      <TabsComponent tabs={tabs} defaultTab="active" />
    </PageContainer>
  );
};

export default Files;
