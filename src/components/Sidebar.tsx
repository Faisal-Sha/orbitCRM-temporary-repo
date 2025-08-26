import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Calendar,
  FileText,
  MessageSquare,
  Home,
  User,
  Users,
  Settings,
  HelpCircle,
  FolderOpen,
  Zap,
  Files,
  DollarSign,
  Shield,
  TrendingUp,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  subItems?: { title: string; path: string }[];
}

const STORAGE_KEY = 'sidebar-expansion-state';

const Sidebar = ({ collapsed, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const menuItems: MenuItem[] = [
    {
      title: "Personal",
      path: "/personal",
      icon: <Home size={20} />,
      subItems: [
        { title: "Goals", path: "/personal/goals" },
        { title: "Tasks", path: "/personal/tasks" },
        { title: "Notes", path: "/personal/notes" },
      ],
    },
    {
      title: "Communication",
      path: "/communication",
      icon: <MessageSquare size={20} />,
      subItems: [
        { title: "Email", path: "/communication/email" },
        { title: "Chat", path: "/communication/chat" },
        { title: "Phone", path: "/communication/phone" },
        { title: "Video", path: "/communication/video" },
        { title: "Social", path: "/communication/social" },
        { title: "Feedback", path: "/communication/feedback" },
      ],
    },
    {
      title: "Schedule",
      path: "/schedule",
      icon: <Calendar size={20} />,
      subItems: [
        { title: "Appointments", path: "/schedule/appointments" },
        { title: "Calendar", path: "/schedule/calendar" },
      ],
    },
    {
      title: "People",
      path: "/people",
      icon: <Users size={20} />,
      subItems: [
        { title: "Leads", path: "/people/leads" },
        { title: "Clients", path: "/people/clients" },
        { title: "Staff", path: "/people/staff" },
        { title: "Audiences", path: "/people/audiences" },
      ],
    },
    {
      title: "Development",
      path: "/development",
      icon: <TrendingUp size={20} />,
      subItems: [
        { title: "Personal", path: "/development/personal-development" },
        { title: "Clients", path: "/development/client-development" },
        { title: "Staff", path: "/development/staff-development" },
      ],
    },
    {
      title: "Records",
      path: "/records",
      icon: <FolderOpen size={20} />,
      subItems: [
        { title: "Client Records", path: "/records/client-records" },
        { title: "Staff Records", path: "/records/staff-records" },
      ],
    },
    {
      title: "Finance",
      path: "/finance",
      icon: <DollarSign size={20} />,
      subItems: [
        { title: "Billing", path: "/finance/billing" },
        { title: "Payouts", path: "/finance/payouts" },
        { title: "Claims", path: "/finance/claims" },
        { title: "Transactions", path: "/finance/transactions" },
      ],
    },
    {
      title: "Forms",
      path: "/forms",
      icon: <FileText size={20} />,
      subItems: [
        { title: "Create", path: "/forms/create" },
        { title: "Manage", path: "/forms/manage" },
        { title: "Submissions", path: "/forms/submissions" },
      ],
    },
    {
      title: "Marketing",
      path: "/marketing",
      icon: <MessageSquare size={20} />,
      subItems: [
        { title: "Lead Campaigns", path: "/marketing/leads-campaigns" },
        { title: "Email", path: "/marketing/email-campaigns" },
        { title: "SMS", path: "/marketing/sms-campaigns" },
        { title: "Ads", path: "/marketing/ad-campaigns" },
        { title: "Social Manager", path: "/marketing/social-manager" },
      ],
    },
    {
      title: "Automation",
      path: "/automation",
      icon: <Zap size={20} />,
      subItems: [
        { title: "Create", path: "/automation/create" },
        { title: "Manage", path: "/automation/manage" },
      ],
    },
    {
      title: "Files",
      path: "/files",
      icon: <Files size={20} />,
    },
    {
      title: "Audit",
      path: "/audit",
      icon: <Shield size={20} />,
    },
    {
      title: "Owner",
      path: "/owner",
      icon: <Crown size={20} />,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <Settings size={20} />,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <User size={20} />,
    },
    {
      title: "Help",
      path: "/help",
      icon: <HelpCircle size={20} />,
    },
  ];

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setExpandedItems(parsedState);
      }
    } catch (error) {
      console.error('Failed to load sidebar expansion state:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedItems));
    } catch (error) {
      console.error('Failed to save sidebar expansion state:', error);
    }
  }, [expandedItems]);

  const toggleExpandedItem = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isPathActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside
      className={cn(
        "sidebar bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-lg font-semibold text-sidebar-foreground">OrbitCRM</div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-sidebar-accent"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <div key={item.path} className="flex flex-col">
              <div className="flex items-center">
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all flex-1",
                    isPathActive(item.path)
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
                    collapsed && "justify-center"
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span>{item.title}</span>}
                </Link>
                {!collapsed && item.subItems && (
                  <button
                    onClick={() => toggleExpandedItem(item.title)}
                    className="p-2 ml-1 hover:bg-sidebar-accent rounded-md flex-shrink-0"
                    aria-label={`${expandedItems[item.title] ? 'Collapse' : 'Expand'} ${item.title} submenu`}
                  >
                    {expandedItems[item.title] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                )}
              </div>
              {!collapsed && item.subItems && expandedItems[item.title] && (
                <div className="mt-1 ml-9 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm transition-colors",
                        isPathActive(subItem.path)
                          ? "bg-sidebar-accent/80 text-sidebar-primary"
                          : "hover:bg-sidebar-accent/50 text-sidebar-foreground/90"
                      )}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
