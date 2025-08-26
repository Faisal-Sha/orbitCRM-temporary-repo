
import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import ActivityLog from "@/pages/audit/ActivityLog";
import PHIAccessLog from "@/pages/audit/PHIAccessLog";
import DataModificationLog from "@/pages/audit/DataModificationLog";
import SecuritySystemsEvents from "@/pages/audit/SecuritySystemsEvents";
import ConfigurationChanges from "@/pages/audit/ConfigurationChanges";
import AuditReports from "@/pages/audit/AuditReports";

const Audit = () => {
  const tabs = [
    { value: "activity-log", label: "Activity Log", content: <ActivityLog /> },
    { value: "phi-access-log", label: "PHI Access Log", content: <PHIAccessLog /> },
    { value: "data-modification-log", label: "Data Modification Log", content: <DataModificationLog /> },
    { value: "security-systems-events", label: "Security & Systems Events", content: <SecuritySystemsEvents /> },
    { value: "configuration-changes", label: "Configuration Changes", content: <ConfigurationChanges /> },
    { value: "audit-reports", label: "Audit Reports", content: <AuditReports /> },
  ];

  return (
    <PageContainer
      title="Audit"
      description="Monitor and review system audit logs and security events"
    >
      <TabsComponent tabs={tabs} defaultTab="activity-log" />
    </PageContainer>
  );
};

export default Audit;
