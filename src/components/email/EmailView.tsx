import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Reply,
  Trash2,
  Star,
  MoreVertical,
  MailOpen,
  Tag,
  ListTodo,
  Printer,
  Download,
  Forward,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  User,
  Send,
  Plus,
  X,
  Archive,
  Mail,
  MailX,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserProfilePanel from "@/components/userprofile/UserProfilePanel";

// Props and internal-stubbed data
interface EmailViewProps {
  // You can extend as needed; here, only dummy version for demonstration.
  email?: {
    from: string;
    subject: string;
    preview: string;
    date: string;
    starred: boolean;
    attachments?: string[];
    label?: string;
    status?: string;
    clientIssue?: boolean;
    folder?: string;
    hasTask?: boolean;
    hasTeammates?: boolean;
  };
  onBack?: () => void;
  onToggleStar?: () => void;
  onToggleTask?: () => void;
}

// Dummy email data for demonstration
const demoEmail = {
  from: "William V Vysniauskas",
  subject: "Healthcare Collaboration Opportunity",
  preview:
    "Hi Caitlin! We have yet to be properly introduced, but I'm William V...",
  date: "10 Feb 2025, 20:05",
  starred: true,
  attachments: ["Intro.pdf", "Brochure.docx"],
  label: "Partnership",
  status: "Active Client",
  clientIssue: false,
  folder: "inbox",
  hasTask: true,
  hasTeammates: true,
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Active Client":
      return "bg-green-100 text-green-800";
    case "Discharged Client":
      return "bg-red-100 text-red-800";
    case "Application":
      return "bg-blue-100 text-blue-800";
    case "Verified":
      return "bg-purple-100 text-purple-800";
    case "Scheduled":
      return "bg-yellow-100 text-yellow-800";
    case "Staff":
      return "bg-indigo-100 text-indigo-800";
    case "Partner":
      return "bg-pink-100 text-pink-800";
    case "General":
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusForEmail = (name: string) => {
  const statuses = [
    "Active Client",
    "Discharged Client",
    "Application",
    "Verified",
    "Scheduled",
    "General",
    "Staff",
    "Partner",
  ];
  const nameHash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const statusIndex = nameHash % statuses.length;
  return statuses[statusIndex];
};

const messageContents = [
  {
    sender: demoEmail.from,
    content:
      "Hi, Caitlin! We have yet to be properly introduced, but I'm William V (or William V, as friends call me). I came across your profile...",
    full: (
      <>
        <p>
          Hi, Caitlin! We have yet to be properly introduced, but I'm William V (or William V, as friends call me). I came across your profile and wanted to reach out about a partnership opportunity...
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip
          ex ea commodo consequat.
        </p>
        <p>
          Best regards,
          <br />
          William V Vysniauskas
        </p>
      </>
    ),
    date: "10 Feb 2025, 20:05",
    to: "me",
    attachments: demoEmail.attachments,
  },
  {
    sender: demoEmail.from,
    content:
      "Hi, Caitlin -I wanted to quickly pop in and see if you've read my below email. I'd still be interested in chatting about how we could partner to ex...",
    full: (
      <>
        <p>Hi Caitlin,</p>
        <p>
          I wanted to quickly pop in and see if you've read my
          below email. I'd still be interested in chatting about
          how we could partner to expand our reach in the
          healthcare space.
        </p>
        <p>Looking forward to connecting.</p>
        <p>
          Best regards,
          <br />
          William V Vysniauskas
        </p>
      </>
    ),
    date: "12 Feb 2025, 15:38",
    to: "me",
  },
  {
    sender: "Caitlin Schmidt",
    content:
      "Hello, We are in the process of credentialing with Medicaid in Illinois and Indiana and would be interested to hear what a partnership would loc...",
    full: (
      <>
        <p>Hello,</p>
        <p>
          We are in the process of credentialing with Medicaid
          in Illinois and Indiana and would be interested to
          hear what a partnership would look like with your
          organization.
        </p>
        <p>
          Could you provide more details about your services and
          how we might collaborate?
        </p>
        <p>
          Best regards,
          <br />
          Caitlin Schmidt
        </p>
      </>
    ),
    date: "18 Feb 2025, 22:31 (10 days ago)",
    to: demoEmail.from,
  },
  {
    sender: demoEmail.from,
    content:
      "I've investigated the issue you reported and found a solution. Here are the steps you need to take:",
    full: (
      <>
        <p>Hello Caitlin,</p>
        <p>
          Thank you for your response. I'd be happy to provide
          more details about our services and potential
          collaboration opportunities.
        </p>
        <p>
          Our organization specializes in providing integrated
          healthcare solutions with a focus on:
        </p>
        <ul>
          <li>Mental health services</li>
          <li>Substance abuse treatment</li>
          <li>Care coordination</li>
          <li>Telehealth options</li>
        </ul>
        <p>
          We currently work with several Medicaid providers in
          neighboring states and have a proven track record of
          successful partnerships.
        </p>
        <p>
          Would you be available for a call next week to discuss
          this further? I'm available Tuesday or Thursday
          afternoon.
        </p>
        <p>
          Best regards,
          <br />
          William V Vysniauskas
        </p>
      </>
    ),
    date: new Date().toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    to: "Caitlin",
  },
];

const internalNotesData = [
  {
    author: "You",
    date: "2024-04-01",
    content: "Initial assessment scheduled for next week.",
    icon: <MailOpen className="h-4 w-4 text-gray-500" />,
  },
  {
    author: "You",
    date: "2024-04-03",
    content:
      "Patient history reviewed, noting several key areas to address during assessment.",
    icon: <MailOpen className="h-4 w-4 text-gray-500" />,
  },
  {
    author: "Emma Davis",
    date: "2024-04-05",
    content:
      "Prepared assessment materials and sent pre-assessment questionnaire to patient.",
    icon: (
      <ListTodo className="h-4 w-4 text-blue-500" />
    ),
    onClick: () => {
      // simulate open task details with notes tab
    },
  },
  {
    author: "You",
    date: "2024-04-08",
    content:
      "Received completed questionnaire. Patient expressed concerns about anxiety symptoms.",
    icon: <MailOpen className="h-4 w-4 text-gray-500" />,
  },
  {
    author: "You",
    date: "2024-04-10",
    content:
      "Discussed assessment approach with team. Will focus on anxiety and potential underlying factors.",
    icon: <MailOpen className="h-4 w-4 text-gray-500" />,
  },
];

export default function EmailView({
  email,
  onBack,
  onToggleStar,
  onToggleTask,
}: EmailViewProps) {
  const mail = email || demoEmail;

  // UI state
  const [showReplyField, setShowReplyField] = useState(false);
  const [showInternalNote, setShowInternalNote] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<number[]>([3]);
  const [isForward, setIsForward] = useState(false);
  const [openProfilePanel, setOpenProfilePanel] = useState(false);

  // Move labels to right of subject line
  const subjectLabels = (
    <div className="flex items-center gap-2 ml-2">
      {mail.label && (
        <Badge
          variant="secondary"
          className="bg-gray-100 text-gray-800 flex items-center gap-2"
        >
          {mail.label}
          <X className="h-3 w-3 cursor-pointer" />
        </Badge>
      )}
      {/* Example: Scheduled */}
      {(mail.status === "Scheduled" || mail.label === "Scheduled") && (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 flex items-center gap-2"
        >
          Scheduled
        </Badge>
      )}
    </div>
  );

  // DUMMY attachments for demo
  const demoAttachments = [
    "Project_Plan.pdf",
    "Medicaid_Partner.docx",
  ];

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Email Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center flex-wrap">
              <h2 className="text-lg font-semibold">{mail.subject}</h2>
              {subjectLabels}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Reply */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowReplyField(true);
                      setIsForward(false);
                    }}
                  >
                    <Reply className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reply</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* User profile */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpenProfilePanel(true)}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>User profile</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Archive */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Archive className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Archive</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Delete */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Main actions dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="p-2 w-56">
                {/* Category 1 */}
                <DropdownMenuItem
                  onClick={() => {
                    setShowReplyField(true);
                    setIsForward(false);
                  }}
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setShowReplyField(true);
                    setIsForward(false);
                    // For dummy purposes, treat as reply-all
                  }}
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Reply all
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setShowReplyField(true);
                    setIsForward(true);
                  }}
                >
                  <Forward className="h-4 w-4 mr-2" />
                  Forward
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                {/* Category 2 */}
                <DropdownMenuItem>
                  <MailOpen className="h-4 w-4 mr-2" />
                  Mark as unread
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MailX className="h-4 w-4 mr-2" />
                  Log client issue
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ListTodo className="h-4 w-4 mr-2" />
                  Add to tasks
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Tag className="h-4 w-4 mr-2" />
                  Label as
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Category 3 */}
                <DropdownMenuItem>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="h-4 w-4 mr-2" />
                  Report Spam
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Star */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onToggleStar}>
                    <Star
                      className={`h-4 w-4 ${mail.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Star</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {/* Email Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header area above messages - now simplified, all labels/timestamp/note icon REMOVED */}

            {/* Threaded email messages */}
            <div className="space-y-6">
              {messageContents.map((msg, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  {/* Bubble header */}
                  <div
                    className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer hover:bg-muted/70"
                    onClick={() =>
                      setExpandedMessages((prev) =>
                        prev.includes(i)
                          ? prev.filter((id) => id !== i)
                          : [...prev, i],
                      )
                    }
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full ${msg.sender === "Caitlin Schmidt"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                          } flex items-center justify-center text-xs font-medium`}
                      >
                        {msg.sender.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{msg.sender}</span>
                          <span className="text-xs text-muted-foreground">
                            {msg.date}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          to {msg.to}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {expandedMessages.includes(i) ? (
                        <ChevronUp className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={e => {
                          e.stopPropagation();
                          setShowReplyField(true);
                          setIsForward(false);
                        }}
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={e => {
                          e.stopPropagation();
                          setShowReplyField(true);
                          setIsForward(true);
                        }}
                      >
                        <Forward className="h-4 w-4" />
                      </Button>
                      {/* Updated Thread menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={e => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation();
                              setShowReplyField(true);
                              setIsForward(false);
                            }}
                          >
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation();
                              setShowReplyField(true);
                              setIsForward(false);
                            }}
                          >
                            <Reply className="h-4 w-4 mr-2" />
                            Reply to all
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation();
                              setShowReplyField(true);
                              setIsForward(true);
                            }}
                          >
                            <Forward className="h-4 w-4 mr-2" />
                            Forward
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {!expandedMessages.includes(i) && (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      {msg.content}
                    </div>
                  )}
                  {expandedMessages.includes(i) && (
                    <div className="p-4 prose max-w-none">
                      {msg.full}
                      {msg.attachments && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">
                            Attachments
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {msg.attachments.map((file, j) => (
                              <div key={j} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                <span className="text-xs">{file}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Attachments Section - persistent, above reply */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Attachments</h4>
              <div className="grid grid-cols-2 gap-4">
                {demoAttachments.map((attachment, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-sm">{attachment}</span>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply and Forward buttons at the bottom - only shown when not replying */}
            {!showReplyField && (
              <div className="flex flex-wrap gap-4 mt-6 mb-6 justify-start">
                <Button
                  variant="default"
                  className="flex items-center gap-2 px-6 bg-blue-600 text-white hover:bg-blue-700 shadow font-semibold"
                  onClick={() => {
                    setShowReplyField(true);
                    setIsForward(false);
                  }}
                >
                  <Reply className="h-4 w-4" />
                  Reply
                </Button>
                <Button
                  variant="default"
                  className="flex items-center gap-2 px-6 bg-blue-600 text-white hover:bg-blue-700 shadow font-semibold"
                  onClick={() => {
                    setShowReplyField(true);
                    setIsForward(true);
                  }}
                >
                  <Forward className="h-4 w-4" />
                  Forward
                </Button>
                {!showInternalNote && (
                  <Button
                    variant="outline"
                    className="text-black bg-white border-black hover:bg-gray-100"
                    onClick={() => setShowInternalNote(true)}
                  >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Add Internal Note
                  </Button>
                )}
              </div>
            )}

            {/* Reply box - only shown when Reply button is clicked */}
            {showReplyField && (
              <div className="border rounded-lg p-4 mt-4 mb-6">
                {!isForward && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
                    >
                      AI Quick Reply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
                    >
                      AI Reply: Database Scan
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
                    >
                      AI Reply: My Points
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
                    >
                      Study With CompanionedAI
                    </Button>
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">To:</span>
                    <span className="text-sm">{mail.from}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyField(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Subject:</span>
                  <span className="text-sm">
                    {isForward ? "Fwd" : "Re"}: {mail.subject}
                  </span>
                </div>
                <div className="border-t pt-4 mb-4"></div>
                <textarea
                  placeholder={isForward ? "Forward this email..." : "Reply to this email..."}
                  className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  autoFocus
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      className="bg-blue-600 text-white hover:bg-blue-700 shadow font-semibold"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Add new note section - only shown when Add Internal Note is clicked and not replying */}
            {!showReplyField && showInternalNote && (
              <div className="mt-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Add New Note</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInternalNote(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <textarea
                    placeholder="Enter internal note..."
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    autoFocus
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button>Save Note</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Internal Notes section */}
            <div id="internal-notes-section" className="mt-6 border-t pt-6">
              <h4 className="font-medium mb-4">Internal Notes</h4>
              <div className="space-y-4">
                <div className="space-y-4">
                  {internalNotesData.map((note, i) => (
                    <div key={i} className="p-3 bg-muted/50 rounded-lg space-y-2 hover:bg-muted/70 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{note.author}</p>
                          {note.icon}
                        </div>
                        <p className="text-xs text-muted-foreground">{note.date}</p>
                      </div>
                      <p className="text-sm">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* User Profile Panel Sheet */}
      <UserProfilePanel
        open={openProfilePanel}
        onClose={() => setOpenProfilePanel(false)}
        user={{
          person_id: "demo-person-id",
          name: mail.from,
          interest: mail.label || "General",
          inquiryDate: mail.date,
          email: "demo@example.com",
          phone: "000-000-0000",
        }}
      />
    </>
  );
}
