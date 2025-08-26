
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, User } from "lucide-react";
import { format } from "date-fns";
import { generatePendingAppointments, Appointment } from './data';

interface DashboardPendingAppointmentsProps {
  appointmentType: string;
  filteredAppointments: Appointment[];
}

const DashboardPendingAppointments: React.FC<DashboardPendingAppointmentsProps> = ({
  appointmentType,
  filteredAppointments
}) => {
  const pendingAppointments = useMemo(() => {
    return generatePendingAppointments(filteredAppointments);
  }, [filteredAppointments]);

  if ((appointmentType !== 'Intakes' && appointmentType !== 'Clients') || pendingAppointments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          Appointments Needing Outcome/Follow-up
        </CardTitle>
        <CardDescription>Past appointments with pending outcomes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{appointment.clientName}</p>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span>Provider: {appointment.providerName}</span>
                  <span>Type: {appointment.type}</span>
                  <span>Date: {format(appointment.date, 'MMM dd, yyyy')}</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Needs Follow-up
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardPendingAppointments;
