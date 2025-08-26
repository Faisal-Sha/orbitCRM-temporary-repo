
import React, { useState } from "react";
import {
  Calendar,
  User,
  FileText,
  ChevronDown,
  ChartLine,
  BarChart3,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LineChart from "@/components/charts/LineChart";

const dropdownOptions = [
  "This Month",
  "Last Month",
  "This Quarter",
  "Last Quarter",
  "This Year",
  "Past Year",
  "All Time"
];

// Modified the provider data to rename Responsiveness to Interest % and remove Response Speed and Value
const providerDummy = {
  Satisfaction: { value: "4.2/5.0", org: "4.1/5.0", description: "Feedback on service quality." },
  "Group Participation": { value: "62%", org: "58%", description: "Attendance to team groups and meetings." },
  "Training Participation": { value: "98%", org: "85%", description: "Participation in training events." },
  "Interest %": { value: "72%", org: "68%", description: "Based on engagement and activity." },
  Referrals: { value: 6, org: 4, description: "Number of new client referrals." },
  Sentiment: { value: "Positive", org: null, description: "Perceived attitude." },
};

// Modified the client data to rename Responsiveness to Interest % and remove Response Speed and Value
const clientDummy = {
  Satisfaction: { value: "4.1/5.0", org: "4.2/5.0", description: "Feedback on provider." },
  "Group Participation": { value: "52%", org: "60%", description: "Participation in group activities." },
  "Training Participation": { value: "78%", org: "83%", description: "Engagement with trainings." },
  "Interest %": { value: "79%", org: "74%", description: "Based on engagement and activity." },
  Referrals: { value: 3, org: 4, description: "Other clients referred." },
  Sentiment: { value: "Neutral", org: null, description: "Provider perceived attitude." },
};

// Added new lead data
const leadDummy = {
  "Interest %": { value: "75%", org: "68%", description: "Based on engagement and activity." },
};

const otherDummy = {
  "Matching Score": { value: "68%", org: "65%", description: "Percent fit between client and provider." },
  "Net Promoter": { value: "+42", org: "+37", description: "Willingness to recommend." },
  "Client Issues": { value: "12%", org: "15%", description: "Reported client difficulties." },
  "Top Keywords": { value: ["resilience", "anxiety", "coping", "focus"], org: null, description: "Common words in client notes." }
};

function StatBox({ title, icon, description, value, org, showOrg = true }) {
  const valNum = typeof value === "number"
    ? value
    : parseFloat((value || "0").toString().replace(/[^\d.]/g, ""));
  const orgNum = typeof org === "number"
    ? org
    : org && typeof org === "string"
      ? parseFloat(org.replace(/[^\d.]/g, ""))
      : null;
  const isPositive = orgNum !== null && valNum >= orgNum;
  return (
    <TooltipProvider>
      <div className="flex flex-col items-start bg-muted/70 rounded-lg px-4 py-3 relative min-w-[126px] break-words">
        <div className="flex items-center gap-2 mb-2">
          {icon && React.createElement(icon, { className: "w-4 h-4 text-primary" })}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-medium text-sm cursor-help">{title}</span>
            </TooltipTrigger>
            <TooltipContent side="top">
              {description}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-end gap-2 flex-wrap">
          {Array.isArray(value) ? (
            <span className="text-sm font-bold">{value.join(", ")}</span>
          ) : (
            <span className="text-xl font-bold">{value}</span>
          )}
          {showOrg && org !== null && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={`ml-1 text-xs font-semibold px-2 py-0.5 rounded transition
                ${valNum >= orgNum ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                cursor-help`}
                >
                  {org}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                Compared to organizational average.
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

// New Lead Section Component
const LeadSection = () => (
  <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <BarChart3 className="h-5 w-5 text-orange-600" />
      <h3 className="font-semibold text-base">Lead</h3>
    </div>
    <div className="flex flex-wrap gap-4">
      {Object.entries(leadDummy).map(([k, v]) => (
        <StatBox
          key={k}
          title={k}
          icon={null}
          description={v.description}
          value={v.value}
          org={v.org}
          showOrg={v.org !== null}
        />
      ))}
    </div>
  </section>
);

const ProviderSection = () => (
  <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <User className="h-5 w-5 text-blue-600" />
      <h3 className="font-semibold text-base">Provider</h3>
    </div>
    <div className="flex flex-wrap gap-4">
      {Object.entries(providerDummy).map(([k, v]) => (
        <StatBox
          key={k}
          title={k}
          icon={null}
          description={v.description}
          value={v.value}
          org={v.org}
          showOrg={v.org !== null}
        />
      ))}
    </div>
  </section>
);

const ClientSection = () => (
  <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <User className="h-5 w-5 text-purple-600" />
      <h3 className="font-semibold text-base">Client</h3>
    </div>
    <div className="flex flex-wrap gap-4">
      {Object.entries(clientDummy).map(([k, v]) => (
        <StatBox
          key={k}
          title={k}
          icon={null}
          description={v.description}
          value={v.value}
          org={v.org}
          showOrg={v.org !== null}
        />
      ))}
    </div>
  </section>
);

const OtherDataSection = () => (
  <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <FileText className="h-5 w-5 text-green-600" />
      <h3 className="font-semibold text-base">Other Data</h3>
    </div>
    <div className="flex flex-wrap gap-4">
      {Object.entries(otherDummy).map(([k, v]) => (
        <StatBox
          key={k}
          title={k}
          icon={null}
          description={v.description}
          value={v.value}
          org={v.org}
          showOrg={!!v.org}
        />
      ))}
    </div>
  </section>
);

const EngagementTrendsSection = () => {
  // Dummy data for demonstration (months and sample values for three lines)
  const chartData = [
    { month: "Jan", providerSat: 4.1, clientSat: 4.2, clientIssues: 8 },
    { month: "Feb", providerSat: 4.2, clientSat: 4.1, clientIssues: 9 },
    { month: "Mar", providerSat: 4.3, clientSat: 4.2, clientIssues: 6 },
    { month: "Apr", providerSat: 4.1, clientSat: 4.3, clientIssues: 10 },
    { month: "May", providerSat: 4.0, clientSat: 4.2, clientIssues: 13 },
    { month: "Jun", providerSat: 4.1, clientSat: 4.1, clientIssues: 10 },
    { month: "Jul", providerSat: 4.2, clientSat: 4.2, clientIssues: 8 },
    { month: "Aug", providerSat: 4.3, clientSat: 4.3, clientIssues: 7 },
    { month: "Sep", providerSat: 4.2, clientSat: 4.1, clientIssues: 9 },
  ];
  const series = [
    { dataKey: "providerSat", name: "Provider Satisfaction", color: "#6366f1" },
    { dataKey: "clientSat", name: "Client Satisfaction", color: "#34d399" },
    { dataKey: "clientIssues", name: "Client Issues", color: "#f59e42" },
  ];
  
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <ChartLine className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-base">Engagement Trends</h3>
      </div>
      <LineChart
        data={chartData}
        series={series}
        xAxisDataKey="month"
        yAxisLabel={"Score"}
        chartTitle={undefined}
        showSeriesToggle={true}
        height={260}
      />
    </section>
  );
};

type PerformanceEngagementProps = {
  dashboardView?: "leads" | "clients" | "staff";
};

const PerformanceEngagement = ({ dashboardView }: PerformanceEngagementProps) => {
  const [selected, setSelected] = useState(dropdownOptions[0]);

  const shouldShowSection = (section: string) => {
    if (!dashboardView) return true; // Show all sections in normal view
    
    switch (dashboardView) {
      case "leads":
        return section === "lead";
      case "clients":
        return ["client", "otherData", "engagementTrends"].includes(section);
      case "staff":
        return section === "provider";
      default:
        return true;
    }
  };

  return (
    <div>
      {!dashboardView && (
        <div className="flex items-center justify-end mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="border px-3 py-1 rounded-md flex items-center gap-2 text-sm shadow-sm bg-background hover:bg-muted transition">
                <Calendar className="w-4 h-4 mr-1" />
                {selected} <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {dropdownOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  className={option === selected ? "bg-muted/40 font-semibold" : ""}
                  onClick={() => setSelected(option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Reordered sections as specified */}
      {shouldShowSection("lead") && <LeadSection />}
      {shouldShowSection("client") && <ClientSection />}
      {shouldShowSection("provider") && <ProviderSection />}
      {shouldShowSection("otherData") && <OtherDataSection />}
      {shouldShowSection("engagementTrends") && <EngagementTrendsSection />}
    </div>
  );
};

export default PerformanceEngagement;
