
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

// Subtabs enum
const SUBTABS = [
  {
    key: "application",
    name: "Application",
    icon: FileText,
  },
  {
    key: "service",
    name: "Service",
    icon: FileText,
  },
  {
    key: "internalNotes",
    name: "Internal Notes",
    icon: FileText,
  },
  {
    key: "tasks",
    name: "Tasks",
    icon: ListChecks,
  },
  {
    key: "files",
    name: "Files",
    icon: FileText,
  },
];

// ---- Reusable SectionCard ----
const SectionCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ElementType; className?: string }> = ({
  title,
  children,
  icon: Icon,
  className = "",
}) => (
  <section className={cn("mb-4 border rounded-lg bg-white shadow-sm", className)}>
    <header className="flex items-center gap-2 px-4 pt-3 pb-1 border-b">
      {Icon && <Icon className="h-5 w-5 text-primary" />}
      <h3 className="text-base font-semibold">{title}</h3>
    </header>
    <div className="px-4 pb-4 pt-2">{children}</div>
  </section>
);

// ---- Reusable LabelList ----
const LabelList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="mb-3">
    <h4 className="text-xs font-semibold text-gray-600 mb-1.5">{title}</h4>
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <Badge key={idx} variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
          {item}
        </Badge>
      ))}
    </div>
  </div>
);

// ---- Internal Notes data ----
const DUMMY_NOTES = Array.from({ length: 20 }, (_, idx) => ({
  id: idx + 1,
  date: `2025-06-${String(20 - idx).padStart(2, "0")}`,
  time: `${14 + (idx % 5)}:${(idx % 2 ? "15" : "45")}`,
  creator: ["Dr. Alan Grant", "Case Manager Sue", "Admin Tony"][(idx % 3)],
  note: `Internal note ${20 - idx}: Dummy note content for testing.`
}));

// ---- Tasks data ----
const DUMMY_TASKS = Array.from({ length: 25 }, (_, idx) => {
  const subtasks = idx % 3 === 0 ? Math.floor(Math.random() * 5) + 1 : 0;
  return {
    id: idx + 1,
    title: `Task Title ${idx + 1}`,
    subtasks,
    creator: ["Beth", "Isaac", "Kylie"][(idx % 3)],
    assigned: Math.floor(Math.random() * 4) + 1,
    status: ["To Do", "In Progress", "Blocked", "Completed", "Cancelled"][idx % 5],
  };
});

// ---- Files data (from TaskPreviewPanel style) ----
const DUMMY_FILES = [
  {
    id: 1,
    name: "IntakeForm.pdf",
    uploadedBy: "Dr. Alan Grant",
    uploadedAt: "2025-06-06 12:14",
    size: "1.3MB",
    url: "#",
    type: "pdf"
  },
  {
    id: 2,
    name: "CarePlan.docx",
    uploadedBy: "Case Manager Sue",
    uploadedAt: "2025-06-04 17:48",
    size: "320KB",
    url: "#",
    type: "docx"
  },
  {
    id: 3,
    name: "AssessmentSummary.txt",
    uploadedBy: "Beth",
    uploadedAt: "2025-06-01 09:32",
    size: "12KB",
    url: "#",
    type: "txt"
  }
];

// ---- File row icon helper ----
const fileTypeIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <span className="inline-block w-5 h-5 bg-red-100 flex items-center justify-center rounded text-red-500 font-bold text-xs mr-2">PDF</span>;
    case "docx":
      return <span className="inline-block w-5 h-5 bg-blue-100 flex items-center justify-center rounded text-blue-500 font-bold text-xs mr-2">DOC</span>;
    case "txt":
      return <span className="inline-block w-5 h-5 bg-gray-200 flex items-center justify-center rounded text-gray-700 font-bold text-xs mr-2">TXT</span>;
    default:
      return <FileText className="h-4 w-4 text-gray-500 mr-2" />;
  }
};

// ---- Status Badge (styled to match task cards) ----
const statusBadge = (status: string) => {
  const color = {
    "To Do": "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Blocked": "bg-yellow-100 text-yellow-700",
    "Completed": "bg-green-100 text-green-700",
    "Cancelled": "bg-red-100 text-red-700",
  }[status] || "bg-gray-200 text-gray-800";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
};

// ---- Subtab Container and Tabs ----
const SubtabSwitcher: React.FC<{
  active: string,
  onChange: (key: string) => void
}> = ({ active, onChange }) => (
  <nav className="flex items-center gap-1 bg-white border-b pt-2 mb-2 px-2">
    {SUBTABS.map(tab => (
      <button
        key={tab.key}
        className={cn(
          "inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors min-w-[80px]",
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
        {tab.name}
      </button>
    ))}
  </nav>
);

// ---- Main RecordsTab Component ----
const RecordsTab = ({ user }: { user: any }) => {
  const [activeSubtab, setActiveSubtab] = useState("application");
  const [notesVisible, setNotesVisible] = useState(10);
  const [tasksVisible, setTasksVisible] = useState(10);

  // For Files, always show all dummy files
  // For Internal Notes, start with 10, load 5 more per click
  const loadMoreNotes = () => {
    setNotesVisible(v => Math.min(v + 5, DUMMY_NOTES.length));
  };
  // For Tasks, start with 10, load 7 more per click
  const loadMoreTasks = () => {
    setTasksVisible(v => Math.min(v + 7, DUMMY_TASKS.length));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Subtabs */}
      <SubtabSwitcher active={activeSubtab} onChange={setActiveSubtab} />
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          {/* Application */}
          {activeSubtab === "application" && (
            <div className="max-w-2xl mx-auto p-1">
              <SectionCard title="Application Information" icon={FileText}>
                <div className="mb-2 text-xs text-gray-500">
                  Application completed on 3/19/2024, 3:07 PM
                </div>
                <LabelList title="Priority Goals" items={["Manage stress", "Find new job", "Improve health"]} />
                <LabelList title="Preference & Interests" items={["Black mentor", "Phone calls", "Community events"]} />
                <LabelList title="Expectation" items={["Supportive communication"]} />
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-1.5 mt-3">Applicant Notes</h4>
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded border">Looking for a therapist who is understanding and can provide practical coping strategies. Open to group sessions if available.</p>
                </div>
              </SectionCard>
            </div>
          )}
          {/* Service */}
          {activeSubtab === "service" && (
            <div className="max-w-2xl mx-auto p-1">
              <SectionCard title="Pairings History" icon={FileText}>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md bg-green-50 border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-green-700">Dr. Sarah Kenwood (Therapist)</span>
                      <Badge variant="default" className="bg-green-600 text-white">Current</Badge>
                    </div>
                    <p className="text-xs text-green-600">Paired since: Jan 15, 2025</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <span className="font-medium">Mark Robinson (Case Manager)</span>
                    <p className="text-xs text-gray-500">Oct 10, 2024 - Jan 14, 2025</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <span className="font-medium">Dr. Emily Carter (Initial Assessor)</span>
                    <p className="text-xs text-gray-500">Sep 01, 2024 - Sep 30, 2024</p>
                  </div>
                </div>
              </SectionCard>
              <SectionCard title="Assessment History" icon={FileText}>
                <div className="space-y-3">
                  <p className="text-xs"><span className="font-semibold">Completed by:</span> Dr. Alan Grant</p>
                  <p className="text-xs"><span className="font-semibold">Date:</span> May 10, 2025</p>
                  <p className="text-xs"><span className="font-semibold">Duration:</span> 45 minutes</p>
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-gray-600 mb-1">AI Generated Insights:</h4>
                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded border">The assessment indicates moderate anxiety levels, primarily related to work stress. Client shows good self-awareness and motivation for change.</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">View Full Record</Button>
                </div>
              </SectionCard>
              <SectionCard title="Progress Notes" icon={FileText}>
                <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                  <div><span className="font-semibold">Last Session:</span> Jun 10, 2025</div>
                  <div><span className="font-semibold">Next Session:</span> Jun 24, 2025</div>
                  <div><span className="font-semibold">Total Sessions:</span> 8</div>
                  <div><span className="font-semibold">Avg. Duration:</span> 50 mins</div>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs font-semibold">Milestones Completed:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">7/12</Badge>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-1">AI Generated Insights:</h4>
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded border">
                    Client is making steady progress on identified goals. Stress management techniques are being applied effectively. Next steps involve exploring work-life balance strategies.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="mt-3">View Full Record</Button>
              </SectionCard>
            </div>
          )}
          {/* Internal Notes */}
          {activeSubtab === "internalNotes" && (
            <div className="max-w-2xl mx-auto p-1">
              {DUMMY_NOTES.slice(0, notesVisible).map((note) => (
                <div key={note.id}
                  className="bg-white border rounded-lg px-4 py-3 mb-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="font-semibold text-sm">{note.creator}</span>
                    <span className="text-xs text-muted-foreground">{note.date} {note.time}</span>
                  </div>
                  <div className="text-xs text-gray-700">{note.note}</div>
                </div>
              ))}
              {notesVisible < DUMMY_NOTES.length && (
                <div className="p-2 text-center">
                  <Button variant="outline" size="sm" onClick={loadMoreNotes}>Load More</Button>
                </div>
              )}
            </div>
          )}
          {/* Tasks */}
          {activeSubtab === "tasks" && (
            <div className="max-w-2xl mx-auto p-1">
              <div className="divide-y">
                {DUMMY_TASKS.slice(0, tasksVisible).map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col md:flex-row items-start md:items-center py-3 gap-2 md:gap-0 hover:bg-gray-50 transition-colors"
                    style={{ minHeight: 56 }}
                  >
                    <div className="flex-1 font-medium text-sm">{task.title}</div>
                    <div className="w-28 text-xs">{task.subtasks ? `${task.subtasks} subtasks` : ""}</div>
                    <div className="w-32 text-xs">{task.creator && <span className="text-muted-foreground">Created by</span>} {task.creator}</div>
                    <div className="w-32 text-xs text-muted-foreground">{task.assigned} team</div>
                    <div className="flex-1">{statusBadge(task.status)}</div>
                    <a
                      href="/personal/tasks/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline px-2 whitespace-nowrap"
                    >
                      View Task
                    </a>
                  </div>
                ))}
              </div>
              {tasksVisible < DUMMY_TASKS.length && (
                <div className="p-2 text-center">
                  <Button variant="outline" size="sm" onClick={loadMoreTasks}>Load More</Button>
                </div>
              )}
            </div>
          )}
          {/* Files */}
          {activeSubtab === "files" && (
            <div className="max-w-2xl mx-auto p-1">
              <div className="overflow-x-auto bg-white border rounded-lg">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="py-2 px-2 text-left font-semibold">File</th>
                      <th className="py-2 px-2 text-left font-semibold">Uploaded By</th>
                      <th className="py-2 px-2 text-left font-semibold">Date/Time</th>
                      <th className="py-2 px-2 text-left font-semibold">Size</th>
                      <th className="py-2 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {DUMMY_FILES.map((file) => (
                      <tr key={file.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-2 px-2 whitespace-nowrap">
                          <div className="flex items-center">
                            {fileTypeIcon(file.type)}
                            <span>{file.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-2">{file.uploadedBy}</td>
                        <td className="py-2 px-2">{file.uploadedAt}</td>
                        <td className="py-2 px-2">{file.size}</td>
                        <td className="py-2 px-2">
                          <a
                            href={file.url}
                            className="text-xs text-blue-600 hover:underline"
                            download
                          >
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default RecordsTab;
