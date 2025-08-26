
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LineChart from "@/components/charts/LineChart";
import PerformanceAttendance from "@/components/userprofile/Performance-Attendance";
import PerformanceEngagement from "@/components/userprofile/Performance-Engagement";
import PerformanceProgress from "@/components/userprofile/Performance-Progress";
import { Activity, Users, TrendingUp } from "lucide-react";

interface PerformanceTabProps {
  peopleType: string;
  currentData: any;
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ peopleType, currentData }) => {
  // Interest chart data for different people types
  const getInterestChartData = (type: string) => {
    const baseData = [
      { month: "Jan", interest: 72 },
      { month: "Feb", interest: 75 },
      { month: "Mar", interest: 78 },
      { month: "Apr", interest: 74 },
      { month: "May", interest: 81 },
      { month: "Jun", interest: 83 },
      { month: "Jul", interest: 79 },
      { month: "Aug", interest: 85 },
      { month: "Sep", interest: 87 }
    ];

    // Adjust data slightly based on type
    if (type === "clients") {
      return baseData.map(item => ({ ...item, interest: item.interest + 5 }));
    } else if (type === "staff") {
      return baseData.map(item => ({ ...item, interest: item.interest - 3 }));
    }
    return baseData;
  };

  // Milestones data for leads
  const milestonesData = [
    { milestone: "Application", completed: 200, percentage: 100 },
    { milestone: "Verification", completed: 100, percentage: 50 },
    { milestone: "Eligible", completed: 85, percentage: 42.5 },
    { milestone: "Scheduled", completed: 65, percentage: 32.5 },
    { milestone: "Client", completed: 45, percentage: 22.5 }
  ];

  const renderLeadsPerformance = () => (
    <div className="space-y-8">
      {/* Attendance Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Attendance</h3>
        </div>
        <PerformanceAttendance dashboardView="leads" />
      </section>

      {/* Engagement Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Engagement</h3>
        </div>
        <PerformanceEngagement dashboardView="leads" />
        
        {/* Additional Interest Chart */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Interest % Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={getInterestChartData("leads")}
              series={[
                { dataKey: "interest", name: "Interest %", color: "#3b82f6", enabled: true }
              ]}
              xAxisDataKey="month"
              height={250}
              showSeriesToggle={false}
            />
          </CardContent>
        </Card>
      </section>

      {/* Progress Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Progress</h3>
        </div>
        <PerformanceProgress dashboardView="leads" />
        
        {/* Milestones Data Table */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Lead Milestones Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Milestone Name</TableHead>
                  <TableHead>Number Completed</TableHead>
                  <TableHead>% of All Leads</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {milestonesData.map((milestone) => (
                  <TableRow key={milestone.milestone}>
                    <TableCell className="font-medium">{milestone.milestone}</TableCell>
                    <TableCell>{milestone.completed}</TableCell>
                    <TableCell>{milestone.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );

  const renderClientsPerformance = () => (
    <div className="space-y-8">
      {/* Attendance Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Attendance</h3>
        </div>
        <PerformanceAttendance dashboardView="clients" />
      </section>

      {/* Engagement Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Engagement</h3>
        </div>
        <PerformanceEngagement dashboardView="clients" />
        
        {/* Additional Interest Chart */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Client Interest % Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={getInterestChartData("clients")}
              series={[
                { dataKey: "interest", name: "Interest %", color: "#22c55e", enabled: true }
              ]}
              xAxisDataKey="month"
              height={250}
              showSeriesToggle={false}
            />
          </CardContent>
        </Card>
      </section>

      {/* Progress Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Progress</h3>
        </div>
        <PerformanceProgress dashboardView="clients" />
      </section>
    </div>
  );

  const renderStaffPerformance = () => (
    <div className="space-y-8">
      {/* Attendance Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Attendance</h3>
        </div>
        <PerformanceAttendance dashboardView="staff" />
      </section>

      {/* Engagement Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Engagement</h3>
        </div>
        <PerformanceEngagement dashboardView="staff" />
        
        {/* Additional Interest Chart */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Staff Interest % Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={getInterestChartData("staff")}
              series={[
                { dataKey: "interest", name: "Interest %", color: "#8b5cf6", enabled: true }
              ]}
              xAxisDataKey="month"
              height={250}
              showSeriesToggle={false}
            />
          </CardContent>
        </Card>
      </section>

      {/* Progress Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Progress</h3>
        </div>
        <PerformanceProgress dashboardView="staff" />
      </section>
    </div>
  );

  return (
    <div className="space-y-6">
      {peopleType === "leads" && renderLeadsPerformance()}
      {peopleType === "clients" && renderClientsPerformance()}
      {peopleType === "staff" && renderStaffPerformance()}
    </div>
  );
};

export default PerformanceTab;
