
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import { generateAppointmentsOverTimeData, generateStatusBreakdownData, Appointment } from './data';

interface DashboardChartsProps {
  appointmentType: string;
  dateRange: string;
  filteredAppointments: Appointment[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  appointmentType,
  dateRange,
  filteredAppointments
}) => {
  const appointmentsOverTimeData = useMemo(() => {
    return generateAppointmentsOverTimeData(dateRange, appointmentType);
  }, [dateRange, appointmentType]);

  const statusBreakdownData = useMemo(() => {
    return generateStatusBreakdownData(filteredAppointments);
  }, [filteredAppointments]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Appointments Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={appointmentsOverTimeData}
            series={
              (appointmentType === 'Personal' || appointmentType === 'Team') 
                ? [{ dataKey: "scheduled", name: "Scheduled", color: "#3b82f6", enabled: true }]
                : [
                    { dataKey: "scheduled", name: "Scheduled", color: "#3b82f6", enabled: true },
                    { dataKey: "completed", name: "Completed", color: "#22c55e", enabled: true }
                  ]
            }
            xAxisDataKey="day"
            height={300}
            showSeriesToggle={true}
          />
        </CardContent>
      </Card>

      {(appointmentType === 'Intakes' || appointmentType === 'Clients') && (
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={statusBreakdownData}
              series={[{ dataKey: "count", name: "Count", color: "#8b5cf6", enabled: true }]}
              xAxisDataKey="status"
              height={300}
              showSeriesToggle={false}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardCharts;
