
import React, { useState } from "react";
import { Calendar, User, TrendingUp, Target, Bug, ChevronDown, ChartBar, ClipboardList } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import BarChart from "@/components/charts/BarChart";
import MilestonesIcon, { Milestone } from "@/components/MilestonesIcon";

const dropdownOptions = ["This Month", "Last Month", "This Quarter", "Last Quarter", "This Year", "Past Year", "All Time"];

const providerDummy = {
  Onboarding: {
    value: "4.1/5.0",
    org: "4.0/5.0",
    description: "Provider effectiveness during onboarding."
  },
  Milestones: {
    value: "72%",
    org: "69%",
    description: "Percent of major milestones achieved."
  },
  Income: {
    value: "$23,937",
    org: "$21,420",
    description: "Total earned income as provider."
  }
};

const clientDummy = {
  "Client Retention": {
    value: "67%",
    org: "68%",
    description: "Percent of clients who stayed beyond intake."
  },
  "Client Lifetime": {
    value: "8 weeks",
    org: "9 weeks",
    description: "Average time clients remain enrolled."
  },
  "Milestones %": {
    value: "72%",
    org: "70%",
    description: "Client milestone achievement percent."
  },
  "Mental Health": {
    value: "3.4/10.0",
    org: "3.7/10.0",
    description: "Improvement in self-reported score (lower is better)."
  }
};

const growthDummy = {
  Foundation: {
    value: "25%",
    org: "22%",
    description: "Clients in initial phase of program."
  },
  Developing: {
    value: "30%",
    org: "28%",
    description: "Clients progressing toward completion."
  },
  Established: {
    value: "44%",
    org: "46%",
    description: "Clients consistently meeting objectives."
  }
};

const topGoals = ["Reduce anxiety", "Improve focus", "Build healthy habits", "Increase social confidence"];

const topChallenges = ["Time management", "Chronic stress", "Low motivation", "Irregular attendance"];

// Define the lead milestones data
const leadMilestones: Milestone[] = [
  {
    completed: true,
    label: "Application"
  },
  {
    completed: true,
    label: "Verification"
  },
  {
    completed: true,
    label: "Eligible"
  },
  {
    completed: false,
    label: "Scheduled"
  },
  {
    completed: false,
    label: "Client"
  }
];

function StatBox({
  title,
  icon,
  description,
  value,
  org
}) {
  const valNum = typeof value === "number" ? value : parseFloat((value || "0").toString().replace(/[^\d.]/g, ""));
  const orgNum = typeof org === "number" ? org : org && typeof org === "string" ? parseFloat(org.replace(/[^\d.]/g, "")) : null;
  const isPositive = orgNum !== null && valNum >= orgNum;
  const showOrg = typeof org !== "undefined";
  return <TooltipProvider>
      <div className="flex flex-col items-start bg-muted/70 rounded-lg px-4 py-3 relative min-w-[126px] break-words">
        <div className="flex items-center gap-2 mb-2">
          {icon && React.createElement(icon, {
          className: "w-4 h-4 text-primary"
        })}
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
          <span className="text-xl font-bold">{value}</span>
          {showOrg && org !== null && <Tooltip>
              <TooltipTrigger asChild>
                <span className={`ml-1 text-xs font-semibold px-2 py-0.5 rounded transition
                ${valNum >= orgNum ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                cursor-help`}>
                  {org}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                Compared to organizational average.
              </TooltipContent>
            </Tooltip>}
        </div>
      </div>
    </TooltipProvider>;
}

// New Leads Section Component showing milestone completion
const LeadsSection = () => <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <ClipboardList className="h-5 w-5 text-orange-600" />
      <h3 className="font-semibold text-base">Lead</h3>
    </div>
    <div className="bg-muted/70 rounded-lg px-4 py-3">
      <div className="flex flex-col">
        <div className="mb-2">
          <span className="font-medium text-sm">Lead Progress Milestones</span>
        </div>
        <div className="flex flex-col gap-3">
          <MilestonesIcon milestones={leadMilestones} className="gap-4" iconSize={5} />
          <div className="text-sm text-muted-foreground mt-1">
            <span>3 of 5 milestones completed</span>
          </div>
        </div>
      </div>
    </div>
  </section>;

const ProviderSection = () => <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <User className="h-5 w-5 text-blue-600" />
      <h3 className="font-semibold text-base">Provider</h3>
    </div>
    <div className="flex flex-wrap gap-4">
      {Object.entries(providerDummy).map(([k, v]) => <StatBox key={k} title={k} icon={null} description={v.description} value={v.value} org={v.org} />)}
    </div>
  </section>;

const ClientSection = () => <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <User className="h-5 w-5 text-purple-600" />
      <h3 className="font-semibold text-base">Client</h3>
    </div>
    <div className="flex flex-wrap gap-4">
      {Object.entries(clientDummy).map(([k, v]) => <StatBox key={k} title={k} icon={null} description={v.description} value={v.value} org={v.org} />)}
    </div>
  </section>;

const GrowthSection = () => <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <TrendingUp className="h-5 w-5 text-green-600" />
      <h3 className="font-semibold text-base">Growth Distribution</h3>
    </div>
    <div className="flex flex-wrap gap-4">
      {Object.entries(growthDummy).map(([k, v]) => <StatBox key={k} title={k} icon={null} description={v.description} value={v.value} org={v.org} />)}
    </div>
  </section>;

const TopGoalsSection = () => <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <Target className="h-5 w-5 text-violet-600" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <h3 className="font-semibold text-base cursor-help">Top Goals</h3>
          </TooltipTrigger>
          <TooltipContent side="top">
            Most common goals currently being pursued by clients.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div className="flex flex-wrap gap-2">
      {topGoals.map(goal => <span key={goal} className="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium">{goal}</span>)}
    </div>
  </section>;

const TopChallengesSection = () => <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <Bug className="h-5 w-5 text-orange-600" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <h3 className="font-semibold text-base cursor-help">Top Challenges</h3>
          </TooltipTrigger>
          <TooltipContent side="top">
            Most common client-reported challenges and barriers.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div className="flex flex-wrap gap-2">
      {topChallenges.map(challenge => <span key={challenge} className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm font-medium">{challenge}</span>)}
    </div>
  </section>;

const ProviderGrowthTrendSection = () => {
  // Dummy data for demo, similar style as provided image
  const chartData = [
    {
      month: "Jan",
      Foundation: 3
    },
    {
      month: "Feb",
      Foundation: 5
    },
    {
      month: "Mar",
      Foundation: 7
    },
    {
      month: "Apr",
      Developing: 8
    },
    {
      month: "May",
      Developing: 9
    },
    {
      month: "Jun",
      Developing: 9.5
    },
    {
      month: "Jul",
      Established: 10.5
    },
    {
      month: "Aug",
      Established: 11
    },
    {
      month: "Sep",
      Established: 12
    }
  ];
  const series = [
    {
      dataKey: "Foundation",
      name: "Foundation",
      color: "#6366f1",
      enabled: true
    },
    {
      dataKey: "Developing",
      name: "Developing",
      color: "#22c55e",
      enabled: true
    },
    {
      dataKey: "Established",
      name: "Established",
      color: "#f59e42",
      enabled: true
    }
  ];
  return <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <ChartBar className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-base">Provider Growth Trend</h3>
      </div>
      <BarChart data={chartData} series={series} xAxisDataKey="month" yAxisLabel="Count" chartTitle={undefined} showSeriesToggle={false} height={260} barGap={4} />
    </section>;
};

const ClientGrowthTrendSection = () => {
  // Dummy data for demo
  const chartData = [
    {
      month: "Jan",
      Foundation: 2
    },
    {
      month: "Feb",
      Foundation: 4
    },
    {
      month: "Mar",
      Foundation: 6
    },
    {
      month: "Apr",
      Developing: 7
    },
    {
      month: "May",
      Developing: 8.5
    },
    {
      month: "Jun",
      Developing: 9
    },
    {
      month: "Jul",
      Established: 10
    },
    {
      month: "Aug",
      Established: 11
    },
    {
      month: "Sep",
      Established: 12
    }
  ];
  const series = [
    {
      dataKey: "Foundation",
      name: "Foundation",
      color: "#6366f1",
      enabled: true
    },
    {
      dataKey: "Developing",
      name: "Developing",
      color: "#22c55e",
      enabled: true
    },
    {
      dataKey: "Established",
      name: "Established",
      color: "#f59e42",
      enabled: true
    }
  ];
  return <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <ChartBar className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-base">Client Growth Trend</h3>
      </div>
      <BarChart data={chartData} series={series} xAxisDataKey="month" yAxisLabel="Count" chartTitle={undefined} showSeriesToggle={false} height={260} barGap={4} />
    </section>;
};

type PerformanceProgressProps = {
  dashboardView?: "leads" | "clients" | "staff";
};

const PerformanceProgress = ({ dashboardView }: PerformanceProgressProps) => {
  const [selected, setSelected] = useState(dropdownOptions[0]);

  const shouldShowSection = (section: string) => {
    if (!dashboardView) return true; // Show all sections in normal view
    
    switch (dashboardView) {
      case "leads":
        return section === "leads";
      case "clients":
        return ["client", "growthDistribution", "clientGrowthTrend", "topGoals", "topChallenges"].includes(section);
      case "staff":
        return ["provider", "providerGrowthTrend"].includes(section);
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
              {dropdownOptions.map(option => (
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
      {shouldShowSection("leads") && <LeadsSection />}
      {shouldShowSection("client") && <ClientSection />}
      {shouldShowSection("growthDistribution") && <GrowthSection />}
      {shouldShowSection("clientGrowthTrend") && <ClientGrowthTrendSection />}
      {shouldShowSection("provider") && <ProviderSection />}
      {shouldShowSection("providerGrowthTrend") && <ProviderGrowthTrendSection />}
      {shouldShowSection("topGoals") && <TopGoalsSection />}
      {shouldShowSection("topChallenges") && <TopChallengesSection />}
    </div>
  );
};

export default PerformanceProgress;
