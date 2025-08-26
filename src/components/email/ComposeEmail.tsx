
import { useState } from "react";
import { X, Paperclip, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface ComposeEmailProps {
  onClose: () => void;
  onSend: (to: string, subject: string, content: string) => void;
}

const ComposeEmail: React.FC<ComposeEmailProps> = ({ onClose, onSend }) => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<{ name: string; size: string }[]>([]);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleAttachFile = () => {
    // Simulate file attachment
    const newAttachment = {
      name: `file-${Math.floor(Math.random() * 1000)}.pdf`,
      size: `${Math.floor(Math.random() * 10) + 1} MB`
    };
    setAttachments([...attachments, newAttachment]);
  };

  const handleRemoveAttachment = (name: string) => {
    setAttachments(attachments.filter(att => att.name !== name));
  };

  const handleSend = () => {
    onSend(to, subject, content);
  };

  return (
    <div 
      className={`fixed bottom-0 right-8 w-[600px] bg-card shadow-lg border rounded-t-lg flex flex-col z-50 ${
        isMinimized ? 'h-12' : 'h-[500px]'
      }`}
    >
      {/* Header */}
      <div 
        className="px-4 py-2 border-b flex items-center justify-between bg-muted/30 cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <h3 className="font-medium">New Message</h3>
        <div className="flex items-center space-x-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Recipient Fields */}
          <div className="p-3 space-y-2">
            <div className="flex items-center">
              <span className="w-10 text-sm">To:</span>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1"
              />
              <button 
                className="text-xs ml-2 text-primary"
                onClick={() => setShowCcBcc(!showCcBcc)}
              >
                {showCcBcc ? 'Hide' : 'Cc/Bcc'}
              </button>
            </div>

            {showCcBcc && (
              <>
                <div className="flex items-center">
                  <span className="w-10 text-sm">Cc:</span>
                  <Input
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center">
                  <span className="w-10 text-sm">Bcc:</span>
                  <Input
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </>
            )}

            <div className="flex items-center">
              <span className="w-10 text-sm">Subject:</span>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Text Editor */}
          <div className="flex-1 p-3 overflow-y-auto">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full resize-none border-none"
              placeholder="Write your email here..."
            />
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="p-3 border-t">
              <div className="text-sm font-medium mb-2">Attachments</div>
              <div className="space-y-2">
                {attachments.map((file) => (
                  <div 
                    key={file.name}
                    className="flex items-center justify-between py-1 px-2 bg-muted/20 rounded"
                  >
                    <div className="flex items-center">
                      <Paperclip className="h-4 w-4 mr-2" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({file.size})</span>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(file.name)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formatting Toolbar */}
          <div className="p-3 border-t flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="font-bold">B</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="italic">I</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="underline">U</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Underline</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleAttachFile}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach file</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={onClose}>Discard</Button>
              <Button onClick={handleSend}>Send</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ComposeEmail;
