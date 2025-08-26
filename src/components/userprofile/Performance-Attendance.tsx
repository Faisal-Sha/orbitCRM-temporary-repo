
import React, { useState } from "react";
import {
  Calendar,
  AlarmClock,
  Briefcase,
  Clock,
  ChartLine
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
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

const attendanceDummy = {
  Scheduled: { value: 10, org: 8, description: "Number of future scheduled sessions." },
  Attended: { value: 5, org: 7, description: "How many scheduled sessions the client actually attended." },
  "Attendance %": { value: "50%", org: "70%", description: "Ratio of attended to scheduled sessions as a percentage." },
};
const caseloadDummy = {
  "Total Paired": { value: 230, org: 240, description: "All-time clients paired to this provider." },
  "Current Caseload": { value: 34, org: 40, description: "Current unique clients under management." },
  "Ideal Caseload": { value: 40, target: true, description: "Target recommended for your role." },
  "Active Clients": { value: 50, org: 52, description: "Clients with ongoing engagement." },
};
const hoursDummy = {
  "Total Hours": { value: 1200, org: 1300, description: "Total client contact hours." },
  "Avg/Month": { value: 127, org: 131, description: "Average contact hours per month." },
  "Avg/Week": { value: 31.8, org: 37, description: "Average contact hours per week." },
  "Avg/Day": { value: 6.4, org: 6.9, description: "Average client hours per working day." },
  "Avg/Client": { value: 7.2, org: 8.1, description: "Average client hours per unique client." },
  "Avg/Session": { value: 1.2, org: 1.3, description: "Average duration per session." }
};
const sessionsDummy = {
  "Total Sessions": { value: 978, org: 1058, description: "Total unique sessions." },
  "Avg/Month": { value: 94, org: 106, description: "Average completed sessions per month." },
  "Avg/Week": { value: 23.8, org: 30, description: "Average completed sessions per week." },
  "Avg/Day": { value: 4.4, org: 5.3, description: "Average completed sessions per working day." },
  "Avg/Client": { value: 5.2, org: 5.5, description: "Average sessions per client." },
  "Show Up %": { value: "78%", org: "80%", description: "Attendance ratio for all client sessions." }
};

type StatBoxProps = {
  title: string,
  icon?: React.ComponentType<{ className?: string }>,
  description: string,
  value: any,
  org?: any,
  target?: boolean
}

function StatBox({ title, icon, description, value, org, target = false }: StatBoxProps) {
  const orgPresent = typeof org !== "undefined";
  const valNum = typeof value === "number" ? value : parseFloat((value || "0").toString().replace(/[^\d.]/g, ""));
  const orgNum = typeof org === "number" ? org : org && typeof org === "string" ? parseFloat(org.replace(/[^\d.]/g, "")) : null;
  const isPositive = orgNum !== null && valNum >= orgNum;
  return (
    <TooltipProvider>
      <div className="flex flex-col items-start bg-muted/70 rounded-lg px-4 py-3 relative min-w-[126px]">
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
        <div className="flex items-end gap-2">
          <span className="text-xl font-bold">
            {value}
            {target && <span className="ml-1 text-xs text-muted-foreground align-baseline">Target</span>}
          </span>
          {orgPresent && !target && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={`ml-1 text-xs font-semibold px-2 py-0.5 rounded transition
                  ${isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
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

const AttendanceSection = () => (
  <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <AlarmClock className="h-5 w-5 text-blue-600" />
      <h3 className="font-semibold text-base">Appointments</h3>
    </div>
    <div className="flex flex-wrap gap-4">
      {Object.entries(attendanceDummy).map(([k, v]) => (
        <StatBox
          key={k}
          title={k}
          icon={null}
          description={v.description}
          value={v.value}
          org={v.org}
        />
      ))}
    </div>
  </section>
);

const CaseloadSection = () => (
  <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <Briefcase className="h-5 w-5 text-purple-600" />
      <h3 className="font-semibold text-base">Caseload</h3>
    </div>
    <div className="flex flex-wrap gap-4">
      {Object.entries(caseloadDummy).map(([k, v]) => (
        <StatBox
          key={k}
          title={k}
          icon={null}
          description={v.description}
          value={v.value}
          org={("org" in v ? v.org : undefined)}
          target={("target" in v ? v.target : false)}
        />
      ))}
    </div>
  </section>
);

const ClientHoursSection = () => (
  <section className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <Clock className="h-5 w-5 text-green-600" />
      <h3 className="font-semibold text-base">Client Hours</h3>
    </div>
    <div className="flex flex-wrap gap-4">
      {Object.entries(hoursDummy).map(([k, v]) => (
        <StatBox
          key={k}
          title={k}
          icon={null}
          description={v.description}
          value={v.value}
          org={v.org}
        />
      ))}
    </div>
  </section>
);

const ClientSessionsSection = () => (
  <section>
    <div className="flex items-center gap-2 mb-3">
      <Clock className="h-5 w-5 text-sky-600" />
      <h3 className="font-semibold text-base">Client Sessions</h3>
    </div>
    <div className="flex flex-wrap gap-4">
      {Object.entries(sessionsDummy).map(([k, v]) => (
        <StatBox
          key={k}
          title={k}
          icon={null}
          description={v.description}
          value={v.value}
          org={v.org}
        />
      ))}
    </div>
  </section>
);

const AttendanceTrendsSection = () => {
  // Example dummy data (months and sample values for the three lines)
  const chartData = [
    { month: "Jan", caseload: 20, avgHours: 40, avgSessions: 5 },
    { month: "Feb", caseload: 22, avgHours: 38, avgSessions: 7 },
    { month: "Mar", caseload: 25, avgHours: 46, avgSessions: 9 },
    { month: "Apr", caseload: 29, avgHours: 43, avgSessions: 8 },
    { month: "May", caseload: 30, avgHours: 48, avgSessions: 10 },
    { month: "Jun", caseload: 32, avgHours: 51, avgSessions: 10 },
    { month: "Jul", caseload: 36, avgHours: 54, avgSessions: 12 },
    { month: "Aug", caseload: 37, avgHours: 56, avgSessions: 12 },
    { month: "Sep", caseload: 34, avgHours: 52, avgSessions: 11 },
  ];
  // Three lines to toggle
  const series = [
    { dataKey: "caseload", name: "Caseload", color: "#8B5CF6" },
    { dataKey: "avgHours", name: "Avg Hours", color: "#10b981" }, // tailwind emerald-500
    { dataKey: "avgSessions", name: "Avg Sessions", color: "#f59e42" }, // vivid orange
  ];
  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <ChartLine className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-base">Attendance Trends</h3>
      </div>
      <LineChart
        data={chartData}
        series={series}
        xAxisDataKey="month"
        yAxisLabel="Count"
        chartTitle={undefined}
        showSeriesToggle={true}
        height={260}
      />
    </section>
  );
};

type PerformanceAttendanceProps = {
  dashboardView?: "leads" | "clients" | "staff";
};

const PerformanceAttendance = ({ dashboardView }: PerformanceAttendanceProps) => {
  const [selected, setSelected] = useState(dropdownOptions[0]);

  const shouldShowSection = (section: string) => {
    if (!dashboardView) return true; // Show all sections in normal view
    
    switch (dashboardView) {
      case "leads":
        return section === "appointments";
      case "clients":
        return ["appointments", "clientHours", "clientSessions", "attendanceTrends"].includes(section);
      case "staff":
        return section === "caseload";
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
      
      {shouldShowSection("appointments") && <AttendanceSection />}
      {shouldShowSection("caseload") && <CaseloadSection />}
      {shouldShowSection("clientHours") && <ClientHoursSection />}
      {shouldShowSection("clientSessions") && <ClientSessionsSection />}
      {shouldShowSection("attendanceTrends") && <AttendanceTrendsSection />}
    </div>
  );
};

export default PerformanceAttendance;
