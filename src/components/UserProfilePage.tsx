import React, { useState } from "react";
import { User, X, Mail, Phone } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import UserProfilePanel from "./userprofile/UserProfilePanel";
import { UserRound } from "lucide-react";
import MilestonesIcon from "./MilestonesIcon";

// Types for the component props
export interface TableColumn {
  key: string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  cellClassName?: string;
  render?: (value: any, item: any) => React.ReactNode;
}

// Type for the details panel configuration
export interface DetailsConfig {
  title?: string;
  showHeader?: boolean;
  className?: string;
  actions?: React.ReactNode;
  renderType?: "default" | "summary" | "custom";
  summaryConfig?: {
    layout?: "vertical" | "horizontal";
    fields?: Array<{
      key: string;
      label?: string;
      render?: (value: any, item: any) => React.ReactNode;
    }>;
  };
  customComponent?: React.ComponentType<any>;
  customComponentProps?: Record<string, any>;
}

export interface UserProfilePageProps {
  // Table data and configuration
  data: any[];
  columns: TableColumn[];
  tableTitle?: string;
  detailsTitle?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;

  // Optional custom renderers
  renderDetailsPanel?: (item: any, config?: DetailsConfig) => React.ReactNode;
  renderEmptyState?: () => React.ReactNode;

  // Details panel configuration
  detailsConfig?: DetailsConfig;

  // Control visibility of growth status indicator
  showGrowthStatus?: boolean;
}

// Simple default detail view component
const DefaultProfileView = ({
  user,
}: {
  user: any;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
          {user.name
            ? user.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
            : "U"}
        </div>
        <div>
          <h3 className="font-medium text-lg">{user.name}</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="secondary">{user.interest || "New"}</Badge>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-2">Summary</h4>
        <p className="text-sm text-gray-700">
          This is a {user.name} who showed interest on {user.inquiryDate || "recently"}. 
          Current interest level is rated at {user.interest || "unknown"}.
        </p>
      </div>

      {/* Communication Information */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h4 className="font-medium mb-4">Contact Information</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{user.email || "email@example.com"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-green-500" />
              <span className="text-sm">{user.phone || "000-000-0000"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserProfilePage = (props: UserProfilePageProps) => {
  const {
    data = [],
    columns = [],
    tableTitle = "Items",
    detailsTitle = "Overview",
    emptyStateTitle = "Select an Item",
    emptyStateDescription = "Click on the details button next to any item in the table to view detailed information.",
    renderDetailsPanel,
    renderEmptyState,
    detailsConfig = {},
    showGrowthStatus = true,
  } = props;
  
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // State for UserProfilePanel
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelUser, setPanelUser] = useState<any | null>(null);

  const handleDetailsClick = (itemName: string) => {
    if (selectedItem === itemName) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemName);
    }
  };

  // Handler for user profile icon click (panel trigger)
  const openUserProfilePanel = (user: any) => {
    setPanelUser(user);
    setPanelOpen(true);
  };

  const closeUserProfilePanel = () => {
    setPanelOpen(false);
    setPanelUser(null);
  };

  return (
    <div className="bg-white rounded-md">
      {/* Table + Details Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Item Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b">
            <h4 className="font-medium">{props.tableTitle}</h4>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {props.columns.map((column, index) => (
                    <TableHead 
                      key={index}
                      className={`${column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : ""} ${column.width || ""}`}
                    >
                      {column.header}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {props.data.map((item, index) => (
                  <TableRow 
                    key={index} 
                    className={selectedItem === item.name ? "bg-primary/10" : ""}
                  >
                    {props.columns.map((column, colIndex) => (
                      <TableCell 
                        key={colIndex} 
                        className={`${column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : ""} ${column.cellClassName || ""}`}
                      >
                        {column.key === "milestones" && column.render 
                          ? column.render(item[column.key], item)
                          : (column.render
                            ? column.render(item[column.key], item)
                            : item[column.key]
                          )
                        }
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleDetailsClick(item.name)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-muted transition-colors"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                        >
                          <path
                            d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right Side: Details Panel */}
        <div className="border rounded-lg overflow-hidden">
          {selectedItem ? (
            <div>
              {(() => {
                const selectedItemData = props.data.find(
                  (item) => item.name === selectedItem,
                );
                if (!selectedItemData) return null;

                return (
                  <>
                    {props.detailsConfig?.showHeader !== false && (
                      <div className="bg-muted px-4 py-3 border-b flex justify-between items-center">
                        <h4 className="font-medium">
                          {props.detailsConfig?.title || props.detailsTitle}
                        </h4>
                        <div className="flex items-center gap-2">
                          {props.detailsConfig?.actions}
                          <button
                            onClick={() => setSelectedItem(null)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className={`p-4 ${props.detailsConfig?.className || ""}`}>
                      {/* --- Remove duplicate name/icon rendering --- */}
                      {/* --- Unified header with profile icon and trigger --- */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {selectedItemData.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg">{selectedItemData.name}</h3>
                          <button
                            className="ml-1 text-muted-foreground hover:text-primary"
                            title="Open full profile"
                            onClick={() => openUserProfilePanel(selectedItemData)}
                            aria-label="Open profile panel"
                            type="button"
                          >
                            <UserRound className="h-5 w-5" />
                          </button>
                        </div>
                        <Badge variant="secondary">{selectedItemData.interest || "New"}</Badge>
                      </div>

                      {/* --- Upcoming Appointments section --- */}
                      <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
                        <h4 className="font-medium mb-2">Upcoming Appointments</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr>
                                <th className="font-semibold text-left py-2 px-2">Date</th>
                                <th className="font-semibold text-left py-2 px-2">Time</th>
                                <th className="font-semibold text-left py-2 px-2">Clinician</th>
                                <th className="font-semibold text-center py-2 px-2">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Dummy rows */}
                              <tr className="border-t">
                                <td className="py-2 px-2 whitespace-nowrap">Jun 18, 2025</td>
                                <td className="py-2 px-2">11:00 AM</td>
                                <td className="py-2 px-2">Dr. Emily Clark</td>
                                <td className="py-2 px-2 flex gap-2 justify-center">
                                  <button className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors" title="Edit">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                      <path d="M16.475 3.95a2.121 2.121 0 0 1 3 3L7.5 18.925l-4 1 1-4 11.975-11.975Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                  <button className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors" title="Cancel">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 px-2 whitespace-nowrap">Jun 22, 2025</td>
                                <td className="py-2 px-2">3:30 PM</td>
                                <td className="py-2 px-2">Dr. Mike Evans</td>
                                <td className="py-2 px-2 flex gap-2 justify-center">
                                  <button className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors" title="Edit">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                      <path d="M16.475 3.95a2.121 2.121 0 0 1 3 3L7.5 18.925l-4 1 1-4 11.975-11.975Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                  <button className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors" title="Cancel">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* --- Summary section --- */}
                      <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                        <h4 className="font-medium mb-2">Summary</h4>
                        <p className="text-sm text-gray-700">
                          This is a {selectedItemData.name} who showed interest on {selectedItemData.inquiryDate || "recently"}. 
                          Current interest level is rated at {selectedItemData.interest || "unknown"}.
                        </p>
                      </div>

                      {/* --- Quick Access section --- */}
                      <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
                        <h4 className="font-medium mb-4">Quick Access</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-blue-500">
                              <path d="M4 4h16v16H4V4zm8 9a1 1 0 100-2 1 1 0 000 2zm0 0v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-sm">{selectedItemData.email || "email@example.com"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-green-500">
                              <path d="M22 16.92V21a2 2 0 01-2.18 2A19.74 19.74 0 013 5.14 2 2 0 015 3h4.09a2 2 0 012 1.72c.13 1.18.32 2.34.56 3.47a2 2 0 01-.45 1.89l-2.2 2.2a16 16 0 006.29 6.29l2.2-2.2a2 2 0 011.89-.45c1.13.24 2.29.43 3.47.56a2 2 0 011.72 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-sm">{selectedItemData.phone || "000-000-0000"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-purple-600">
                              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                              <path d="M6 20v-2a6 6 0 1112 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-sm">Application Portal</span>
                          </div>
                        </div>
                      </div>

                      {/* --- Communication Stats section --- */}
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h4 className="font-medium mb-4">Communication Stats</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex flex-col items-center">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-blue-500 mb-1">
                              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                              <path d="M4 8h16" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <span className="font-semibold text-xl">12</span>
                            <span className="text-xs text-muted-foreground">Emails</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-green-500 mb-1">
                              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                              <path d="M3 7l6.333 5.333c.8.673 2.134.673 2.934 0L21 7" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <span className="font-semibold text-xl">24</span>
                            <span className="text-xs text-muted-foreground">SMS</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-purple-600 mb-1">
                              <rect x="2" y="2" width="20" height="20" rx="10" stroke="currentColor" strokeWidth="2"/>
                              <path d="M10 8h4m-2 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span className="font-semibold text-xl">8</span>
                            <span className="text-xs text-muted-foreground">Calls</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-blue-600 mb-1">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <span className="font-semibold text-xl">37</span>
                            <span className="text-xs text-muted-foreground">Messages</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-violet-500">
                              <rect x="4" y="4" width="16" height="16" rx="8" stroke="currentColor" strokeWidth="2"/>
                              <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span className="text-sm text-muted-foreground">Responsiveness</span>
                            <span className="font-semibold text-violet-500 ml-1">67%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-green-500">
                              <path d="M9 12l2 2l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <span className="text-sm text-muted-foreground">Sentiment</span>
                            <span className="font-semibold text-green-500 ml-1">Positive</span>
                          </div>
                        </div>
                      </div>
                      {/* --- END new sections --- */}
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center text-center h-full">
              {props.renderEmptyState ? (
                props.renderEmptyState()
              ) : (
                <>
                  <div className="bg-muted/50 rounded-full p-3 mb-3">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">
                    {props.emptyStateTitle}
                  </h4>
                  <p className="text-muted-foreground text-sm max-w-md">
                    {props.emptyStateDescription}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* UserProfilePanel sheet rendered outside main grid, overlays content */}
      <UserProfilePanel
        open={panelOpen}
        onClose={closeUserProfilePanel}
        user={panelUser}
      />
    </div>
  );
};

export default UserProfilePage;
