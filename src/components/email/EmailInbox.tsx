import { useState } from "react";
import EmailSidebar from "./EmailSidebar";
import EmailList from "./EmailList";
import EmailView from "./EmailView";
import ComposeEmail from "./ComposeEmail";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type Email = {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  content: string;
  time: string;
  read: boolean;
  starred: boolean;
  hasAttachment: boolean;
  labels: string[];
  thread?: string;
  replies?: Email[];
  attachments?: Attachment[];
};

export type Attachment = {
  filename: string;
  type: string; // e.g., "pdf", "txt", etc.
};

export type InternalNote = {
  id: string;
  author: string;
  date: string;
  content: string;
  relatedEmailId: string;
};

const mockAttachments = [
  { filename: "Q2_Report.pdf", type: "pdf" },
  { filename: "MeetingNotes.txt", type: "txt" },
  { filename: "screenshot.png", type: "png"}
];

const EmailInbox = () => {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [openedEmail, setOpenedEmail] = useState<Email | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [activeAccount, setActiveAccount] = useState("jane.doe@example.com");
  const [autoDraftReplies, setAutoDraftReplies] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  // Mock emails data (with attachments field where appropriate)
  const mockEmails: Email[] = [
    {
      id: "1",
      sender: "John Smith",
      senderEmail: "john.smith@company.com",
      subject: "Project Update - Q2 Report",
      content: "Hello Jane,\n\nI wanted to share the latest update on our Q2 Project. We've made significant progress on the client deliverables.\n\nAttached is the latest report for your review.\n\nBest regards,\nJohn",
      time: "10:30 AM",
      read: false,
      starred: true,
      hasAttachment: true,
      labels: ["Work", "Important"],
      attachments: [mockAttachments[0]],
      replies: []
    },
    {
      id: "2",
      sender: "Marketing Team",
      senderEmail: "marketing@company.com",
      subject: "New Campaign Brief",
      content: "Team,\n\nHere is the brief for our upcoming marketing campaign. Please review by Friday.\n\nRegards,\nMarketing Team",
      time: "Yesterday",
      read: true,
      starred: false,
      hasAttachment: false,
      labels: ["Marketing"],
      attachments: [],
      replies: []
    },
    {
      id: "3",
      sender: "Sarah Johnson",
      senderEmail: "sarah@client.com",
      subject: "Meeting Request - Partnership Opportunity",
      content: "Dear Jane,\n\nI hope this email finds you well. I'd like to schedule a meeting to discuss a potential partnership between our companies.\n\nWould you be available next Tuesday at 2 PM?\n\nBest regards,\nSarah Johnson\nClient Relations Manager",
      time: "Yesterday",
      read: true,
      starred: true,
      hasAttachment: false,
      labels: ["Partnerships"],
      attachments: [],
      replies: []
    },
    {
      id: "4",
      sender: "Technical Support",
      senderEmail: "support@software.com",
      subject: "Your Ticket #45678 Has Been Resolved",
      content: "Dear Jane,\n\nWe're happy to inform you that your recent support ticket (#45678) regarding database connectivity issues has been resolved.\n\nPlease let us know if you need any further assistance.\n\nBest regards,\nTechnical Support Team",
      time: "May 10",
      read: false,
      starred: false,
      hasAttachment: false,
      labels: ["Work"],
      attachments: [mockAttachments[1]],
      replies: []
    },
    {
      id: "5",
      sender: "HR Department",
      senderEmail: "hr@company.com",
      subject: "Important: Quarterly Review Schedule",
      content: "Dear Team Members,\n\nThis is a reminder about the upcoming quarterly performance reviews. Please find the schedule attached.\n\nRegards,\nHR Department",
      time: "May 9",
      read: true,
      starred: false,
      hasAttachment: true,
      labels: ["Work", "Important"],
      attachments: [mockAttachments[2]],
      replies: []
    }
  ];

  // Mock internal notes
  const mockInternalNotes: InternalNote[] = [
    {
      id: "note-1",
      author: "Jane Doe",
      date: "Today, 11:45 AM",
      content: "Followed up with John about the project deliverables. Expecting response by EOD.",
      relatedEmailId: "1"
    },
    {
      id: "note-2",
      author: "Tom Parker",
      date: "Yesterday, 3:20 PM",
      content: "Client expressed interest in additional services. Should schedule a call to discuss options.",
      relatedEmailId: "3"
    }
  ];

  const handleSelectEmail = (id: string) => {
    const email = mockEmails.find(email => email.id === id);
    if (email) {
      setOpenedEmail(email);
    }
  };

  const handleStarEmail = (id: string) => {
    toast({
      title: "Email starred",
      description: "Email has been marked as important"
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmails(mockEmails.map(email => email.id));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleToggleEmailSelection = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedEmails([...selectedEmails, id]);
    } else {
      setSelectedEmails(selectedEmails.filter(emailId => emailId !== id));
    }
  };

  const handleCompose = () => {
    setIsComposing(true);
  };

  const handleCloseCompose = () => {
    setIsComposing(false);
  };

  const handleSendEmail = (to: string, subject: string, content: string) => {
    toast({
      title: "Email sent",
      description: `Email to ${to} has been sent successfully`
    });
    setIsComposing(false);
  };

  const handleDeleteSelected = () => {
    toast({
      title: "Emails deleted",
      description: `${selectedEmails.length} emails have been moved to trash`
    });
    setSelectedEmails([]);
  };

  const handleArchiveSelected = () => {
    toast({
      title: "Emails archived",
      description: `${selectedEmails.length} emails have been archived`
    });
    setSelectedEmails([]);
  };

  const handleMarkAsRead = (asRead: boolean) => {
    toast({
      title: asRead ? "Marked as read" : "Marked as unread",
      description: `${selectedEmails.length} emails have been marked as ${asRead ? "read" : "unread"}`
    });
    setSelectedEmails([]);
  };

  const handleBackToInbox = () => {
    setOpenedEmail(null);
  };

  // Mapping openedEmail (our Email shape) to the EmailView dummy shape expected
  function mapEmailToEmailView(email: Email | null) {
    if (!email) return null;
    return {
      from: email.sender,
      subject: email.subject,
      preview: email.content,
      date: email.time,
      starred: email.starred,
      attachments: email.attachments ? email.attachments.map(a => a.filename) : [],
      label: email.labels?.[0], // Just the first label for demo
      status: undefined,
      clientIssue: false,
      folder: undefined,
      hasTask: false,
      hasTeammates: false
    };
  }

  // Pagination control data
  const itemsPerPage = 25;
  const totalEmails = mockEmails.length;
  const totalPages = Math.ceil(totalEmails / itemsPerPage);

  // New top bar layout: search + auto-draft left, pagination right
  return (
    <div className="flex h-[calc(100vh-200px)] overflow-hidden border rounded-lg bg-background">
      {/* Left Sidebar */}
      <EmailSidebar onCompose={handleCompose} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="p-2 border-b flex items-center justify-between">
        
          {/* Left section: Search and auto-draft toggle */}
          <div className="flex items-center space-x-3">
            {/* Account Selector */}
            <select
              className="border rounded p-1 text-sm bg-background"
              value={activeAccount}
              onChange={(e) => setActiveAccount(e.target.value)}
            >
              <option value="jane.doe@example.com">jane.doe@example.com</option>
              <option value="jane.work@company.com">jane.work@company.com</option>
              <option value="personal@mail.com">personal@mail.com</option>
            </select>
            
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search emails"
                className="px-3 py-1 border rounded-md text-sm w-44 md:w-64"
              />
            </div>
            
            {/* Auto-draft toggle */}
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={autoDraftReplies} 
                        onCheckedChange={setAutoDraftReplies} 
                        id="auto-draft"
                      />
                      <label 
                        htmlFor="auto-draft" 
                        className="text-sm cursor-pointer"
                      >
                        <span className="hidden sm:inline">Auto-draft replies</span>
                        <span className="sm:hidden">Auto-draft</span>
                      </label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enable AI to auto-draft all emails, new and existing</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Right section: Pagination controls */}
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="ghost"
              disabled={currentPage === 1}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              aria-label="Previous page"
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
            <Button
              size="icon"
              variant="ghost"
              disabled={currentPage === totalPages}
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              aria-label="Next page"
              className="rounded-full"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Email Content */}
        <div className="flex-1 overflow-auto">
          {openedEmail ? (
            <EmailView 
              email={mapEmailToEmailView(openedEmail)} 
              onBack={handleBackToInbox}
              onToggleStar={() => handleStarEmail(openedEmail.id)}
              // onToggleTask can be added as needed
            />
          ) : (
            <EmailList 
              emails={mockEmails} 
              onSelectEmail={handleSelectEmail}
              onStarEmail={handleStarEmail}
              selectedEmails={selectedEmails}
              onToggleSelect={handleToggleEmailSelection}
              onSelectAll={handleSelectAll}
              onDelete={handleDeleteSelected}
              onArchive={handleArchiveSelected}
              onMarkAsRead={(read) => handleMarkAsRead(read)}
              currentPage={currentPage}
              onChangePage={setCurrentPage}
              totalEmails={mockEmails.length}
              // No longer rendering internal pagination in EmailList, it's handled here in the top right
            />
          )}
        </div>
      </div>

      {/* Compose Email Modal */}
      {isComposing && (
        <ComposeEmail 
          onClose={handleCloseCompose} 
          onSend={handleSendEmail} 
        />
      )}
    </div>
  );
};

export default EmailInbox;
