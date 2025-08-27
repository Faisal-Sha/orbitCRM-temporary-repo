import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import AppLayout from "./layouts/AppLayout";

// App Pages (Authentication & General)
import LoginPage from "./pages/apppages/LoginPage";
import RegisterPage from "./pages/apppages/RegisterPage";
import PasswordResetPage from "./pages/apppages/PasswordResetPage";
import PasswordResetSubmitPage from "./pages/apppages/PasswordResetSubmitPage";
import NotFoundPage from "./pages/apppages/404Page";
import ContactPage from "./pages/apppages/ContactPage";

// Personal Routes
import Personal from "./pages/Personal";
import Goals from "./pages/personal/Goals";
import Tasks from "./pages/personal/Tasks";
import Notes from "./pages/personal/Notes";

// Communication Routes
import Communication from "./pages/Communication";
import Email from "./pages/communication/Email";
import Phone from "./pages/communication/Phone";
import Video from "./pages/communication/Video";
import Chat from "./pages/communication/Chat";
import Social from "./pages/communication/Social";
import Feedback from "./pages/communication/Feedback";

// Schedule Routes
import Schedule from "./pages/Schedule";
import Appointments from "./pages/schedule/Appointments";
import Calendar from "./pages/schedule/Calendar";
import CalendarPreview from "./components/appointments/CalendarPreview";

// People Routes
import People from "./pages/People";
import Leads from "./pages/people/Leads";
import Clients from "./pages/people/Clients";
import Staff from "./pages/people/Staff";
import Audiences from "./pages/people/Audiences";

// Development Routes
import Development from "./pages/Development";
import ClientDevelopment from "./pages/development/ClientDevelopment";
import StaffDevelopment from "./pages/development/StaffDevelopment";
import PersonalDevelopment from "./pages/development/PersonalDevelopment";

// Records Routes
import Records from "./pages/Records";
import ClientRecords from "./pages/records/ClientRecords";
import StaffRecords from "./pages/records/StaffRecords";

// Finance Routes
import Finance from "./pages/Finance";
import Billing from "./pages/finance/Billing";
import Claims from "./pages/finance/Claims";
import Payouts from "./pages/finance/Payouts";
import Transactions from "./pages/finance/Transactions";

// Forms Routes
import Forms from "./pages/Forms";
import FormCreate from "./pages/forms/Create";
import FormManage from "./pages/forms/Manage";
import FormSubmissions from "./pages/forms/Submissions";

// Automation Routes
import Automation from "./pages/Automation";
import AutomationCreate from "./pages/automation/Create";
import AutomationManage from "./pages/automation/Manage";

// Files Routes
import Files from "./pages/Files";

// Audit Routes
import Audit from "./pages/Audit";

// Owner Routes
import Owner from "./pages/Owner";

// Other Routes
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import Index from "./pages/Index";

// Marketing Routes
import Marketing from "./pages/Marketing";
import LeadsCampaigns from "./pages/marketing/LeadsCampaigns";
import EmailCampaigns from "./pages/marketing/EmailCampaigns";
import SMSCampaigns from "./pages/marketing/SMSCampaigns";
import AdCampaigns from "./pages/marketing/AdCampaigns";
import SocialManager from "./pages/marketing/SocialManager";

// Assessment Form
import AssessmentForm from "./components/records/assessments/AssessmentForm";

// Progress Notes Form
import ProgressNotesForm from "./components/progressnotes/ProgressNotesForm";

// Staff Onboarding Form
import OnboardingForm from "./components/records/staffonboarding/OnboardingForm";

// Staff Development Form
import DevelopmentForm from "./components/records/staffdevelopment/DevelopmentForm";

// Configure QueryClient with proper garbage collection
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Add periodic cleanup in development
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    console.log(`Active queries: ${queries.length}`);
    
    // Clear old queries periodically
    if (queries.length > 50) {
      console.warn('Too many cached queries, clearing old ones');
      queryClient.clear();
    }
  }, 30000); // Check every 30 seconds
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* App Pages (Outside Main Layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />
            <Route path="/password-reset-submit" element={<PasswordResetSubmitPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Index />} />
              
              {/* Personal Routes */}
              <Route path="personal" element={<Personal />} />
              <Route path="personal/goals" element={<Goals />} />
              <Route path="personal/tasks" element={<Tasks />} />
              <Route path="personal/notes" element={<Notes />} />
              
              {/* Communication Routes */}
              <Route path="communication" element={<Communication />} />
              <Route path="communication/email" element={<Email />} />
              <Route path="communication/chat" element={<Chat />} />
              <Route path="communication/phone" element={<Phone />} />
              <Route path="communication/video" element={<Video />} />
              <Route path="communication/social" element={<Social />} />
              <Route path="communication/feedback" element={<Feedback />} />
              
              {/* Schedule Routes */}
              <Route path="schedule" element={<Schedule />} />
              <Route path="schedule/appointments" element={<Appointments />} />
              <Route path="schedule/calendar" element={<Calendar />} />
              <Route path="schedule/calendar/preview" element={<CalendarPreview />} />
              
              {/* People Routes */}
              <Route path="people" element={<People />} />
              <Route path="people/leads" element={<Leads />} />
              <Route path="people/clients" element={<Clients />} />
              <Route path="people/staff" element={<Staff />} />
              <Route path="people/audiences" element={<Audiences />} />
              
              {/* Development Routes */}
              <Route path="development" element={<Development />} />
              <Route path="development/client-development" element={<ClientDevelopment />} />
              <Route path="development/staff-development" element={<StaffDevelopment />} />
              <Route path="development/personal-development" element={<PersonalDevelopment />} />
              
              {/* Records Routes - Updated for new hierarchy */}
              <Route path="records" element={<Records />} />
              <Route path="records/client-records" element={<ClientRecords />} />
              <Route path="records/staff-records" element={<StaffRecords />} />
              <Route path="records/assessment-form" element={<AssessmentForm />} />
              <Route path="records/progress-notes-form" element={<ProgressNotesForm />} />
              <Route path="records/onboarding-form" element={<OnboardingForm />} />
              <Route path="records/development-form" element={<DevelopmentForm />} />
              
              {/* Finance Routes */}
              <Route path="finance" element={<Finance />} />
              <Route path="finance/billing" element={<Billing />} />
              <Route path="finance/claims" element={<Claims />} />
              <Route path="finance/payouts" element={<Payouts />} />
              <Route path="finance/transactions" element={<Transactions />} />
              
              {/* Forms Routes */}
              <Route path="forms" element={<Forms />} />
              <Route path="forms/create" element={<FormCreate />} />
              <Route path="forms/manage" element={<FormManage />} />
              <Route path="forms/submissions" element={<FormSubmissions />} />
              
              {/* Marketing Routes */}
              <Route path="marketing" element={<Marketing />} />
              <Route path="marketing/leads-campaigns" element={<LeadsCampaigns />} />
              <Route path="marketing/email-campaigns" element={<EmailCampaigns />} />
              <Route path="marketing/sms-campaigns" element={<SMSCampaigns />} />
              <Route path="marketing/ad-campaigns" element={<AdCampaigns />} />
              <Route path="marketing/social-manager" element={<SocialManager />} />
              
              {/* Automation Routes */}
              <Route path="automation" element={<Automation />} />
              <Route path="automation/create" element={<AutomationCreate />} />
              <Route path="automation/manage" element={<AutomationManage />} />
              
              {/* Files Routes */}
              <Route path="files" element={<Files />} />
              
              {/* Audit Routes */}
              <Route path="audit" element={<Audit />} />
              
              {/* Owner Routes */}
              <Route path="owner" element={<Owner />} />
              
              {/* Other Routes */}
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="help" element={<Help />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
