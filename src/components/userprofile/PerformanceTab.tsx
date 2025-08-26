
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Users, TrendingUp } from "lucide-react";
import PerformanceAttendance from "./Performance-Attendance";
import PerformanceEngagement from "./Performance-Engagement";
import PerformanceProgress from "./Performance-Progress";
import { cn } from "@/lib/utils";

// Tab metadata
const PERF_TABS = [
  {
    key: "attendance",
    label: "Attendance",
    icon: Activity,
    content: <PerformanceAttendance />,
  },
  {
    key: "engagement",
    label: "Engagement",
    icon: Users,
    content: <PerformanceEngagement />,
  },
  {
    key: "progress",
    label: "Progress",
    icon: TrendingUp,
    content: <PerformanceProgress />,
  },
];

// Tab switcher (almost identical to RecordsTab, but more compact for design consistency)
const SubtabSwitcher: React.FC<{
  active: string;
  onChange: (key: string) => void;
}> = ({ active, onChange }) => (
  <nav className="flex items-center gap-1 bg-transparent border-b pt-2 mb-2 px-2">
    {PERF_TABS.map((tab) => (
      <button
        key={tab.key}
        className={cn(
          "inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors min-w-[90px]",
          active === tab.key
            ? "bg-primary/10 border text-primary"
            : "hover:bg-muted text-muted-foreground",
        )}
        style={{
          borderColor: active === tab.key ? "hsl(var(--primary))" : "transparent",
          borderBottomWidth: active === tab.key ? 2 : 0,
        }}
        onClick={() => onChange(tab.key)}
        type="button"
        aria-current={active === tab.key}
      >
        <tab.icon className="h-4 w-4 mr-1" />
        {tab.label}
      </button>
    ))}
  </nav>
);

const PerformanceTab = ({ user }: { user: any }) => {
  const [activeTab, setActiveTab] = useState("attendance");

  // Find current tab content to render below
  const tabContent = PERF_TABS.find(tab => tab.key === activeTab)?.content;

  return (
    <div className="h-full flex flex-col">
      <SubtabSwitcher active={activeTab} onChange={setActiveTab} />
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="max-w-3xl mx-auto p-1">
            {tabContent}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PerformanceTab;

