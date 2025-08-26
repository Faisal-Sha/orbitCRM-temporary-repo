
import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import TabsComponent from "@/components/TabsComponent";
import ColdLeads from "@/components/people/leads/ColdLeads";
import NoShows from "@/components/people/leads/NoShows";
import Referrals from "@/components/people/leads/Referrals";

const Leads = () => {
  const [useSimplifiedView, setUseSimplifiedView] = useState(false);

  // Cold Leads content
  const coldLeadsContent = <ColdLeads useSimplifiedView={useSimplifiedView} />;

  // No Shows content
  const noShowsTabContent = <NoShows useSimplifiedView={useSimplifiedView} />;

  // Referrals content
  const referralsTabContent = <Referrals useSimplifiedView={useSimplifiedView} />;

  const tabs = [
    { value: "cold-leads", label: "Cold Leads", content: coldLeadsContent },
    { value: "no-shows", label: "No Shows", content: noShowsTabContent },
    { value: "referrals", label: "Referrals", content: referralsTabContent },
  ];

  return (
    <PageContainer
      title="Leads"
      description="Manage potential clients and leads"
    >
      <TabsComponent tabs={tabs} defaultTab="cold-leads" />
    </PageContainer>
  );
};

export default Leads;
