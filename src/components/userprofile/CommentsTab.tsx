
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, MailPlus, PhoneCall, MessageSquarePlus, MessagesSquare, User, CalendarDays, MessageCircle, CheckCircle } from 'lucide-react';

const SectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <Card className={`mb-6 ${className}`}>
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

interface ConversationItemProps {
  icon: React.ElementType;
  title: string;
  preview: string;
  date: string;
  content: string;
  id: string;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ icon: Icon, title, preview, date, content, id }) => (
  <AccordionItem value={id} className="border-b">
    {/* REMOVE UNDERLINE on hover: remove hover:underline etc */}
    <AccordionTrigger className="py-3 px-2 rounded-md transition-colors hover:bg-muted/30">
      <div className="flex items-center w-full">
        <Icon className="h-5 w-5 mr-3 text-primary shrink-0" />
        <div className="flex-grow text-left">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground truncate max-w-xs md:max-w-md">{preview}</p>
        </div>
        <span className="text-xs text-muted-foreground ml-auto shrink-0">{date}</span>
      </div>
    </AccordionTrigger>
    <AccordionContent className="pt-0 pb-3 px-2">
      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border">
        {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
      </div>
    </AccordionContent>
  </AccordionItem>
);

const baseConversations = [
  { id: "email1", icon: MailPlus, title: "Email: Follow-up on Session", preview: "Hi John, just wanted to follow up on our last session and see how you're doing with the new techniques...", date: "May 12, 2025", content: "Full email content here...\nThis includes multiple lines and details about the email." },
  { id: "call1", icon: PhoneCall, title: "Call Summary: Check-in", preview: "Discussed progress on stress management. Client reported feeling more positive...", date: "May 10, 2025", content: "Call Summary:\nCaller: Dr. Smith\nDuration: 15 mins\nNotes: Client is doing well, scheduled next appointment." },
  { id: "sms1", icon: MessageSquarePlus, title: "SMS: Appointment Reminder", preview: "Hi John, friendly reminder about your appointment tomorrow at 2 PM.", date: "May 09, 2025", content: "Full SMS thread could be displayed here if needed, or just the single message content." },
  { id: "portal1", icon: MessagesSquare, title: "Portal Chat: Question about resources", preview: "User asked for links to anxiety resources.", date: "May 07, 2025", content: "Portal Chat Transcript:\nUser: Can you send me some resources for anxiety?\nSupport: Absolutely, here are a few links..." },
  { id: "comment1", icon: MessageCircle, title: "Internal Comment: Case Review", preview: "Reviewed case with supervisor. Agreed on next steps for therapy plan.", date: "May 05, 2025", content: "Internal notes regarding case progress and supervisor feedback. This is not visible to the client." },
];

function generateDummyConversation(i: number): ConversationItemProps {
  // Rotating icons and kinds for deviation in dummy data
  const kinds = [
    { icon: MailPlus, type: "Email", color: "text-blue-500" },
    { icon: PhoneCall, type: "Call", color: "text-green-500" },
    { icon: MessageSquarePlus, type: "SMS", color: "text-purple-500" },
    { icon: MessagesSquare, type: "Portal Chat", color: "text-sky-600" },
    { icon: MessageCircle, type: "Internal", color: "text-gray-600" }
  ];
  const k = kinds[i % kinds.length];
  return {
    id: `dummy${i}`,
    icon: k.icon,
    title: `${k.type} Conversation #${i + 1}`,
    preview: `This is a preview for dummy conversation record #${i + 1}.`,
    date: `May ${15 - ((i + 1) % 12)}, 2025`,
    content: `Full details for dummy conversation record number ${i + 1}.\nGenerated for demo/testing purposes.`
  }
}

const DUMMY_TOTAL = 25;

const CommentsTab = ({ user }: { user: any }) => {
  // Total base = 5, DUMMY_TOTAL = how many you want maximum (for realistic demo), can increase/decrease
  const [visibleCount, setVisibleCount] = useState(5);
  // Prepare extra dummy conversations
  const extraConvos = Array.from({ length: DUMMY_TOTAL }, (_, i) => generateDummyConversation(i));
  // The full list when "all loaded"
  const allConvos = [...baseConversations, ...extraConvos];
  // Only show up to visibleCount
  const visibleConversations = allConvos.slice(0, visibleCount);
  const hasMore = visibleConversations.length < allConvos.length;

  const commStats = [
    { icon: MailPlus, label: "Emails", value: 12, color: "text-blue-500" },
    { icon: MessageSquarePlus, label: "SMS", value: 24, color: "text-green-500" },
    { icon: PhoneCall, label: "Calls", value: 8, color: "text-purple-600" },
    { icon: MessagesSquare, label: "Messages", value: 37, color: "text-sky-600" },
  ];

  return (
    <ScrollArea className="h-full">
      <div>
        {/* Filters and Actions */}
        <div className="mb-6 p-4 border rounded-lg bg-muted/30">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-1.5" /> Filter</Button>
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search conversations..." className="pl-8 sm:w-[200px] md:w-[250px]" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline"><MailPlus className="h-4 w-4 mr-1.5" />New Email</Button>
            <Button size="sm" variant="outline"><PhoneCall className="h-4 w-4 mr-1.5" />New Call</Button>
            <Button size="sm" variant="outline"><MessageSquarePlus className="h-4 w-4 mr-1.5" />New SMS</Button>
            <Button size="sm" variant="outline"><MessagesSquare className="h-4 w-4 mr-1.5" />Portal Chat</Button>
          </div>
        </div>

        {/* Recent Conversations */}
        <SectionCard title="Recent Conversations">
          <Accordion type="multiple" className="w-full">
            {visibleConversations.map(convo => <ConversationItem key={convo.id} {...convo} />)}
          </Accordion>
          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setVisibleCount((c) => c + 5)}
              >
                Load More
              </Button>
            </div>
          )}
        </SectionCard>

        {/* Communication Stats */}
        <SectionCard title="Communication Stats">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {commStats.map(stat => (
              <div key={stat.label} className="flex flex-col items-center p-3 bg-gray-50 rounded-md border">
                <stat.icon className={`h-6 w-6 mb-1.5 ${stat.color}`} />
                <span className="font-semibold text-xl">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-violet-500" />
              <span className="text-sm text-muted-foreground">Responsiveness:</span>
              <span className="font-semibold text-violet-500">67%</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Sentiment:</span>
              <span className="font-semibold text-green-500">Positive</span>
            </div>
          </div>
        </SectionCard>

        {/* Communication Preferences */}
        <SectionCard title="Communication Preferences">
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 rounded bg-gray-50 border">
              <span className="text-sm">Email</span>
              <Badge variant="outline" className="text-green-600 border-green-600">Preferred</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-gray-50 border">
              <span className="text-sm">SMS</span>
              <Badge variant="outline" className="text-blue-600 border-blue-600">Allowed</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-gray-50 border">
              <span className="text-sm">Phone Calls</span>
              <Badge variant="outline" className="text-blue-600 border-blue-600">Allowed</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-gray-50 border">
              <span className="text-sm">Appointment Reminders</span>
              <Badge variant="default" className="bg-green-500">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-gray-50 border">
              <span className="text-sm">Flows: Client Journey</span>
              <Badge variant="default" className="bg-green-500">Enabled</Badge>
            </div>
          </div>
        </SectionCard>
      </div>
    </ScrollArea>
  );
};

export default CommentsTab;
