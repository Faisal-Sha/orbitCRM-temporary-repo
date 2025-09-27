import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const BreadcrumbNav = () => {
  const location = useLocation();
  
  // Title case formatter for the breadcrumb items
  const formatTitle = (path: string) => {
    if (path === "email") return "Email";
    if (path === "chat") return "Chat";
    if (path === "desk") return "Email"; // backward compatibility for history
    if (path === "team") return "Chat"; // backward compatibility for history
    if (path === "social") return "Social";
    if (path === "feedback") return "Feedback";
    if (path === "goals") return "Goals";
    if (path === "tasks") return "Tasks";
    if (path === "notes") return "Notes";
    if (path === "calendars") return "Calendars";
    if (path === "client-records") return "Client Records";
    if (path === "staff-records") return "Staff Records";
    if (path === "client-development") return "Clients";
    if (path === "staff-development") return "Staff";
    if (path === "personal-development") return "Personal";
    if (path === "files") return "Files";
    if (path === "audit") return "Audit";
    if (path === "billing") return "Billing";
    if (path === "claims") return "Claims";
    if (path === "payouts") return "Payouts";
    if (path === "transactions") return "Transactions";
    if (path === "leads-campaigns") return "Lead Campaigns";
    if (path === "email-campaigns") return "Email";
    if (path === "sms-campaigns") return "SMS";
    if (path === "ad-campaigns") return "Ads";
    if (path === "social-manager") return "Social Manager";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  // Define complete paths for each section
  const getCompletePaths = () => {
    const currentPath = location.pathname;
    
    // Personal section complete path
    if (currentPath.startsWith('/personal')) {
      return [
        { name: 'personal', path: '/personal' },
        { name: 'goals', path: '/personal/goals' },
        { name: 'tasks', path: '/personal/tasks' },
        { name: 'notes', path: '/personal/notes' }
      ];
    }
    
    // People section complete path
    if (currentPath.startsWith('/people')) {
      return [
        { name: 'people', path: '/people' },
        { name: 'leads', path: '/people/leads' },
        { name: 'clients', path: '/people/clients' },
        { name: 'staff', path: '/people/staff' },
        { name: 'audiences', path: '/people/audiences' }
      ];
    }
    
    // Development section complete path
    if (currentPath.startsWith('/development')) {
      return [
        { name: 'development', path: '/development' },
        { name: 'personal-development', path: '/development/personal-development' },
        { name: 'client-development', path: '/development/client-development' },
        { name: 'staff-development', path: '/development/staff-development' }
      ];
    }
    
    // Records section complete path with new hierarchy
    if (currentPath.startsWith('/records')) {
      return [
        { name: 'records', path: '/records' },
        { name: 'client-records', path: '/records/client-records' },
        { name: 'staff-records', path: '/records/staff-records' }
      ];
    }
    
    // Finance section complete path
    if (currentPath.startsWith('/finance')) {
      return [
        { name: 'finance', path: '/finance' },
        { name: 'billing', path: '/finance/billing' },
        { name: 'payouts', path: '/finance/payouts' },
        { name: 'claims', path: '/finance/claims' },
        { name: 'transactions', path: '/finance/transactions' }
      ];
    }
    
    // Forms section complete path
    if (currentPath.startsWith('/forms')) {
      return [
        { name: 'forms', path: '/forms' },
        { name: 'create', path: '/forms/create' },
        { name: 'manage', path: '/forms/manage' },
        { name: 'submissions', path: '/forms/submissions' }
      ];
    }
    
    // Marketing section complete path
    if (currentPath.startsWith('/marketing')) {
      return [
        { name: 'marketing', path: '/marketing' },
        { name: 'leads-campaigns', path: '/marketing/leads-campaigns' },
        { name: 'email-campaigns', path: '/marketing/email-campaigns' },
        { name: 'sms-campaigns', path: '/marketing/sms-campaigns' },
        { name: 'ad-campaigns', path: '/marketing/ad-campaigns' },
        { name: 'social-manager', path: '/marketing/social-manager' }
      ];
    }
    
    // Automation section complete path
    if (currentPath.startsWith('/automation')) {
      return [
        { name: 'automation', path: '/automation' },
        { name: 'create', path: '/automation/create' },
        { name: 'manage', path: '/automation/manage' }
      ];
    }
    
    // Files section complete path
    if (currentPath.startsWith('/files')) {
      return [
        { name: 'files', path: '/files' }
      ];
    }
    
    // Audit section complete path
    if (currentPath.startsWith('/audit')) {
      return [
        { name: 'audit', path: '/audit' }
      ];
    }
    
    // Communication section complete path
    if (currentPath.startsWith('/communication')) {
      return [
        { name: 'communication', path: '/communication' },
        { name: 'email', path: '/communication/email' },
        { name: 'chat', path: '/communication/chat' },
        { name: 'phone', path: '/communication/phone' },
        { name: 'video', path: '/communication/video' },
        { name: 'social', path: '/communication/social' },
        { name: 'feedback', path: '/communication/feedback' },
      ];
    }
    
    // Schedule section complete path
    if (currentPath.startsWith('/schedule')) {
      return [
        { name: 'schedule', path: '/schedule' },
        { name: 'appointments', path: '/schedule/appointments' },
        { name: 'calendars', path: '/schedule/appointments/calendars' },
        { name: 'calendar', path: '/schedule/calendar' }
      ];
    }
    
    // Default: just use current path segments
    const pathnames = location.pathname.split("/").filter((x) => x);
    return pathnames.map((segment, index) => {
      const path = `/${pathnames.slice(0, index + 1).join("/")}`;
      return { name: segment, path };
    });
  };

  // Get complete breadcrumb paths
  const breadcrumbPaths = getCompletePaths();

  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol className="flex items-center space-x-1 text-sm">
        {breadcrumbPaths.map((item, index) => {
          const isLast = index === breadcrumbPaths.length - 1;
          
          // Check if this path is part of the current path
          const isActive = location.pathname.includes(item.path);
          
          return (
            <li key={item.path} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />}
              <Link
                to={item.path}
                className={cn(
                  "transition-colors",
                  isLast && isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={isLast && isActive ? "page" : undefined}
              >
                {formatTitle(item.name)}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbNav;
