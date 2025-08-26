
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CalendarPlus, CheckCircle, UserCheck, Mail, PhoneCall, MessageSquare, AlertTriangle } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityTabProps {
  user: { name: string; } | null;
}

const activities = [
  { id: 1, title: "Application Submitted", description: "Initial application received and processed.", icon: FileText, label: "Application", date: "May 01, 2025", time: "02:30 PM", color: "bg-blue-500" },
  { id: 2, title: "Intake Assessment Completed", description: "Client completed the initial intake assessment.", icon: CheckCircle, label: "Assessment", date: "May 05, 2025", time: "10:00 AM", color: "bg-green-500" },
  { id: 3, title: "Paired with Provider", description: "Client paired with Dr. Anya Sharma.", icon: UserCheck, label: "Pairing", date: "May 07, 2025", time: "03:00 PM", color: "bg-purple-500" },
  { id: 4, title: "Appointment Scheduled", description: "First therapy session scheduled.", icon: CalendarPlus, label: "Appointment", date: "May 08, 2025", time: "11:00 AM", color: "bg-teal-500" },
  { id: 5, title: "Email Sent: Welcome Pack", description: "Welcome email with program details sent.", icon: Mail, label: "Email", date: "May 08, 2025", time: "11:05 AM", color: "bg-sky-500" },
  { id: 6, title: "Appointment Attended", description: "Attended first therapy session with Dr. Sharma.", icon: CheckCircle, label: "Appointment", date: "May 15, 2025", time: "01:00 PM", color: "bg-green-500" },
  { id: 7, title: "Phone Call: Check-in", description: "Brief check-in call with case manager.", icon: PhoneCall, label: "Call", date: "May 20, 2025", time: "04:15 PM", color: "bg-orange-500" },
  { id: 8, title: "SMS Reminder Sent", description: "Reminder for upcoming appointment sent via SMS.", icon: MessageSquare, label: "SMS", date: "May 21, 2025", time: "09:00 AM", color: "bg-indigo-500" },
  { id: 9, title: "Appointment Missed", description: "Client missed scheduled appointment.", icon: AlertTriangle, label: "Appointment", date: "May 22, 2025", time: "02:00 PM", color: "bg-red-500" },
];

// Newest at the TOP for timeline (reverse array order)
const timelineActivities = [...activities].reverse();

const ActivityTab: React.FC<ActivityTabProps> = ({ user }) => {
  return (
    <ScrollArea className="h-full">
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6">
              {/* Timeline line */}
              <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {timelineActivities.map((activity, index) => (
                <div key={activity.id} className="relative mb-6 pl-8 group hover:bg-gray-50/50 p-2 rounded-md transition-colors duration-150">
                  {/* Dot on the timeline */}
                  <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full ${activity.color} transform -translate-x-1/2 border-2 border-white group-hover:scale-110 transition-transform`}></div>
                  <div className="flex items-center mb-1">
                    <activity.icon className={`h-5 w-5 mr-2 ${activity.color.replace('bg-', 'text-')}`} />
                    <h4 className="font-semibold text-md">{activity.title}</h4>
                    <Badge variant="outline" className="ml-auto text-xs">{activity.label}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                  <p className="text-xs text-gray-400">{activity.date} at {activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default ActivityTab;
