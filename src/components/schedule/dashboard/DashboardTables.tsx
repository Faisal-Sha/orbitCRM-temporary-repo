
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { generateProviderStats, generateClientStats, Appointment } from './data';

interface DashboardTablesProps {
  appointmentType: string;
  filteredAppointments: Appointment[];
}

const DashboardTables: React.FC<DashboardTablesProps> = ({
  appointmentType,
  filteredAppointments
}) => {
  const providerStats = useMemo(() => {
    return generateProviderStats(filteredAppointments, appointmentType);
  }, [filteredAppointments, appointmentType]);

  const clientStats = useMemo(() => {
    return generateClientStats(filteredAppointments, appointmentType);
  }, [filteredAppointments, appointmentType]);

  return (
    <>
      {/* Provider Performance Table */}
      {appointmentType === 'Intakes' && providerStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Provider</th>
                    <th className="text-left p-2">Scheduled</th>
                    <th className="text-left p-2">Follow Ups</th>
                    <th className="text-left p-2">Completed</th>
                    <th className="text-left p-2">Completion %</th>
                    <th className="text-left p-2">Contribution %</th>
                    <th className="text-left p-2">Avg Duration</th>
                    <th className="text-left p-2">Referrals</th>
                    <th className="text-left p-2">Referrals %</th>
                  </tr>
                </thead>
                <tbody>
                  {providerStats.map((provider, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{provider.name}</td>
                      <td className="p-2">{provider.scheduled}</td>
                      <td className="p-2">{provider.followUps}</td>
                      <td className="p-2">{provider.completed}</td>
                      <td className="p-2">{provider.completionRate}%</td>
                      <td className="p-2">{provider.contributionRate}%</td>
                      <td className="p-2">{provider.avgDuration} min</td>
                      <td className="p-2">{provider.referrals}</td>
                      <td className="p-2">{provider.referralRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Client Performance Table */}
      {appointmentType === 'Clients' && clientStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Client</th>
                    <th className="text-left p-2">Scheduled</th>
                    <th className="text-left p-2">Completed</th>
                    <th className="text-left p-2">Completion %</th>
                    <th className="text-left p-2">Contribution %</th>
                  </tr>
                </thead>
                <tbody>
                  {clientStats.map((client, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{client.name}</td>
                      <td className="p-2">{client.scheduled}</td>
                      <td className="p-2">{client.completed}</td>
                      <td className="p-2">{client.completionRate}%</td>
                      <td className="p-2">{client.contributionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default DashboardTables;
