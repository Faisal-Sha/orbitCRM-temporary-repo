
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Phone, MapPin, Facebook, Instagram, Pencil, X, User, Calendar, Briefcase, ShieldCheck, Home, Users, Heart, Languages } from 'lucide-react';

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  iconColor?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value, iconColor = "text-muted-foreground" }) => (
  <div className="flex items-start space-x-3">
    <Icon className={`h-5 w-5 mt-0.5 ${iconColor}`} />
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-500">{value}</p>
    </div>
  </div>
);

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

interface GeneralTabProps {
  user: any;
  hideUpcomingAppointments?: boolean;
  showApplicationInfo?: boolean;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ user, hideUpcomingAppointments = false, showApplicationInfo = false }) => {
  const dummyAppointments = [
    { date: "Jun 18, 2025", time: "11:00 AM", clinician: "Dr. Emily Clark" },
    { date: "Jun 22, 2025", time: "3:30 PM", clinician: "Dr. Mike Evans" },
  ];

  return (
    <ScrollArea className="h-full">
      <div>
        {/* Upcoming Appointments - conditionally rendered */}
        {!hideUpcomingAppointments && (
          <SectionCard title="Upcoming Appointments">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Clinician</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyAppointments.map((appt, index) => (
                  <TableRow key={index}>
                    <TableCell>{appt.date}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.clinician}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" className="hover:bg-blue-100">
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-red-100">
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        )}

        {/* Contact Information */}
        <SectionCard title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <DetailItem icon={Mail} label="Email" value={user?.email || "john.doe@example.com"} iconColor="text-blue-500" />
            <DetailItem icon={Phone} label="Phone" value={user?.phone || "555-123-4567"} iconColor="text-green-500" />
            <DetailItem icon={MapPin} label="Address" value="123 Main St, Anytown, USA 12345" iconColor="text-red-500" />
            <DetailItem icon={ShieldCheck} label="Portal Account" value={<Badge variant="secondary">Active</Badge>} iconColor="text-purple-500" />
            <DetailItem icon={Facebook} label="Facebook" value={<Badge variant="secondary">Connected</Badge>} iconColor="text-blue-600" />
            <DetailItem icon={Instagram} label="Instagram" value={<Badge variant="secondary">Connected</Badge>} iconColor="text-pink-500" />
          </div>
        </SectionCard>

        {/* Additional Information */}
        <SectionCard title="Additional Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <DetailItem icon={Calendar} label="Date of Birth" value="Jan 1, 1990" />
            <DetailItem icon={Briefcase} label="Service" value="Therapy" />
            <DetailItem icon={User} label="SSN" value="***-**-1234" />
            <DetailItem icon={Home} label="Living Situation" value="Alone" />
            <DetailItem icon={Users} label="Referred By" value="Dr. Jane Smith" />
            <DetailItem icon={User} label="Gender Identity" value="Female" />
            <DetailItem icon={ShieldCheck} label="Insurance ID" value={<>MED123456 <span className="text-xs text-gray-400">(Exp: 12/2025)</span></>} />
            <DetailItem icon={Heart} label="Marital Status" value="Single" />
            <DetailItem icon={Languages} label="Preferred Language" value="English" />
          </div>
        </SectionCard>

        {/* Emergency Contact */}
        <SectionCard title="Emergency Contact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <DetailItem icon={User} label="Name" value="Jane Doe" />
            <DetailItem icon={Mail} label="Email" value="jane.contact@example.com" />
            <DetailItem icon={Phone} label="Phone" value="555-987-6543" />
            <DetailItem icon={Users} label="Relationship" value="Spouse" />
          </div>
        </SectionCard>
      </div>
    </ScrollArea>
  );
};

export default GeneralTab;
