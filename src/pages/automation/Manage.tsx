
import React, { useState } from 'react';
import PageContainer from "@/components/PageContainer";
import { AutomationManagementList } from "@/components/automation/AutomationManagementList";

const Manage = () => {
  return (
    <PageContainer
      title="Manage Automations"
      description="Edit and organize your automated workflows"
    >
      <AutomationManagementList />
    </PageContainer>
  );
};

export default Manage;
