import { Email } from "./EmailInbox";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Paperclip, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";

// --- STATUS MAP + COLORS for label ---
const statusColorMap: Record<string, string> = {
  "Active Client": "bg-[#F2FCE2] text-[#334C1A]",        
  "Discharged": "bg-[#FEC6A1] text-[#792E17]",           
  "Application": "bg-[#FFDEE2] text-[#A74957]",           
  "Verified": "bg-[#E5DEFF] text-[#4F46A6]",             
  "Scheduled": "bg-[#FEF7CD] text-[#866304]",            
  "Partner": "bg-[#FEF7CD] text-[#925D17]",              
  "Staff": "bg-[#D3E4FD] text-[#1D4ED8]",                
  "General": "bg-[#F3F4F6] text-[#374151]",              
};

// Dummy mapping of user id/email to status (for demo)
const senderStatusDummy: Record<string, string> = {
  "Danielle Parker": "Active Client",
  "Gary Long": "Staff",
  "Anna Chan": "Discharged",
  "Mailroom": "Partner",
  "Alex Carter": "Scheduled",
  "Rich Kwan": "General",
  "Tracey Lewis": "Verified",
  "Felicia O'Brien": "Application",
  "allie@somefirm.com": "Partner",
};

const StatusLabel: React.FC<{ status: string }> = ({ status }) => {
  if (!statusColorMap[status]) return null;
  return (
    <span
      className={`ml-0.5 px-2 py-0.5 rounded-full font-medium text-xs min-w-[70px] select-none ${statusColorMap[status]}`}
      style={{ letterSpacing: '0.01em' }}
    >
      {status}
    </span>
  );
};

const ConversationIndicator: React.FC<{ participants: string[] }> = ({ participants }) => {
  const displayNames = participants.slice(0, 2).join(", ");
  return (
    <span className="inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-md bg-muted/80 text-muted-foreground text-xs font-medium">
      <Users className="h-3.5 w-3.5 text-muted-foreground/90" />
      <span className="truncate max-w-[70px]">{displayNames}</span>
      {participants.length > 2 && (
        <span className="text-muted-foreground/60">+{participants.length - 2}</span>
      )}
    </span>
  );
};

const EmailPreview: React.FC<{ preview: string }> = ({ preview }) => (
  <span
    className="ml-2 text-muted-foreground text-sm truncate max-w-xs w-full"
    style={{
      maxWidth: "15rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      display: "inline-block"
    }}
    title={preview}
  >
    {preview.length > 86 ? preview.slice(0, 85) + "..." : preview}
  </span>
);

// --- NEW: Local type to "enrich" Email with extra properties for display ---
type VisualEmail = Email & {
  participants: string[];
  status?: string;
  preview: string;
};

// --- Dummy data patch: enrich each email for demo, in-place ---
function enrichEmailsForDemo(emails: Email[]): VisualEmail[] {
  return emails.map((email, i) => {
    // Demo: simulate some multi-person conversations
    let participants: string[] = [];
    if (i === 2) participants = ["Mailroom", "Rich Kwan", "Alex Carter"];
    else if (i === 4) participants = ["Danielle Parker", "Felicia O'Brien"];
    else participants = [email.sender];

    // Assign a dummy status (none for multi-sender)
    const status = participants.length > 1 ? undefined : (senderStatusDummy[email.sender] || "General");
    // Preview: use first 16 words of content, or placeholder
    const text = email.content 
      ? email.content.replace(/\s+/g, " ").trim()
      : "No preview available";
    const words = text.split(" ");
    const preview = words.slice(0, 16).join(" ") + (words.length > 16 ? "..." : "");

    return { ...email, participants, status, preview };
  });
}

interface EmailListProps {
  emails: Email[];
  selectedEmails: string[];
  onSelectEmail: (id: string) => void;
  onStarEmail: (id: string) => void;
  onToggleSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onDelete: () => void;
  onArchive: () => void;
  onMarkAsRead: (read: boolean) => void;
  currentPage: number;
  onChangePage: (page: number) => void;
  totalEmails: number;
}

function getExtIcon(type: string) {
  if (type === "pdf") return (
    <span className="text-red-500 font-semibold text-xs ml-1">PDF</span>
  );
  if (type === "txt") return (
    <span className="text-blue-500 font-semibold text-xs ml-1">TXT</span>
  );
  if (type === "png" || type === "jpg" || type === "jpeg") return (
    <span className="text-yellow-500 font-semibold text-xs ml-1">IMG</span>
  );
  return <span className="text-muted-foreground text-xs ml-1">{type.toUpperCase()}</span>;
}

const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedEmails,
  onSelectEmail,
  onStarEmail,
  onToggleSelect,
  onSelectAll,
  onDelete,
  onArchive,
  onMarkAsRead,
}) => {
  const allSelected = emails.length > 0 && selectedEmails.length === emails.length;
  const someSelected = selectedEmails.length > 0 && selectedEmails.length < emails.length;
  const hasSelection = selectedEmails.length > 0;

  // Use type-safe enriched emails
  const visualEmails: VisualEmail[] = enrichEmailsForDemo(emails);

  return (
    <div className="h-full flex flex-col">
      {/* Action Bar */}
      <div className="p-2 flex items-center space-x-2 border-b">
        <Checkbox 
          id="select-all"
          checked={allSelected} 
          className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
          onCheckedChange={(checked) => {
            if (typeof checked === "boolean") {
              onSelectAll(checked);
            }
          }}
        />
        {hasSelection ? (
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="p-1 rounded hover:bg-muted/70"
                    onClick={() => onMarkAsRead(true)}
                  >
                    <span className="sr-only">Mark as read</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8" />
                      <rect x="3" y="6" width="18" height="12" rx="2" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mark as read</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="p-1 rounded hover:bg-muted/70"
                    onClick={() => onMarkAsRead(false)}
                  >
                    <span className="sr-only">Mark as unread</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="6" width="18" height="12" rx="2" />
                      <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mark as unread</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="p-1 rounded hover:bg-muted/70"
                    onClick={onArchive}
                  >
                    <span className="sr-only">Archive</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="4" rx="1" />
                      <path d="M4 8v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
                      <polyline points="10 12 12 14 14 12" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Archive</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="p-1 rounded hover:bg-muted/70"
                    onClick={onDelete}
                  >
                    <span className="sr-only">Delete</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m5-4h4a2 2 0 0 1 2-2v2H7V4a2 2 0 0 1 2-2z" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Select emails to perform actions</span>
        )}
      </div>
      
      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        <table className="min-w-full table-fixed">
          <tbody>
            {visualEmails.map((email) => (
              <tr 
                key={email.id}
                className={`border-b hover:bg-muted/20 cursor-pointer transition-colors ${!email.read ? 'font-medium bg-muted/10' : ''}`}
                onClick={() => onSelectEmail(email.id)}
              >
                {/* Checkbox and star */}
                <td className="pl-4 pr-2 py-3 align-top w-10">
                  <div className="flex items-center space-x-3 pt-1">
                    <Checkbox
                      checked={selectedEmails.includes(email.id)}
                      onCheckedChange={(checked) => {
                        if (typeof checked === "boolean") {
                          onToggleSelect(email.id, checked);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onStarEmail(email.id);
                      }}
                      tabIndex={0}
                    >
                      <Star 
                        className={`h-4 w-4 ${email.starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                      />
                    </button>
                  </div>
                </td>

                {/* Sender */}
                <td className="px-2 py-3 w-1/4 align-top max-w-[170px]">
                  <div className="flex items-center">
                    <span className="truncate font-medium">{email.sender}</span>
                  </div>
                  <div className="mt-0.5 flex items-center flex-wrap gap-1">
                    {email.participants && email.participants.length > 1 ? (
                      <ConversationIndicator participants={email.participants} />
                    ) : (
                      email.status && <StatusLabel status={email.status} />
                    )}
                  </div>
                </td>

                {/* Subject, Labels, Preview, Attachments */}
                <td className="px-2 py-3 align-top min-w-[280px] max-w-[420px]">
                  {/* Subject + Preview */}
                  <div className="flex items-center w-full">
                    <span className="truncate font-semibold max-w-[11rem]">{email.subject}</span>
                    {/* Email body preview */}
                    <EmailPreview preview={email.preview || ""} />
                  </div>
                  {/* Labels (below subject) */}
                  {email.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {email.labels.map((label, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 text-xs rounded-full bg-muted/70 text-muted-foreground"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Attachments (below labels, if any) */}
                  {email.attachments && email.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1 items-center">
                      {email.attachments.map((a, i) => (
                        <div key={i} className="flex items-center rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs text-blue-900 truncate max-w-[160px]">
                          <Paperclip className="h-3 w-3 text-blue-400 mr-1" />
                          <span className="truncate max-w-[90px]">{a.filename.length > 18 ? (a.filename.slice(0,15) + '...') : a.filename}</span>
                          {getExtIcon(a.type)}
                        </div>
                      ))}
                    </div>
                  )}
                </td>

                {/* Date/time, end of row */}
                <td className="px-2 py-3 pr-4 align-top text-right whitespace-nowrap w-32">
                  <span className="text-xs text-muted-foreground">{email.time}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmailList;
