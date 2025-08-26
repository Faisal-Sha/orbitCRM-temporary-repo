import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import { Clock, Eye } from "lucide-react";

interface GeneralTabProps {
  peopleType: string;
  currentData: any;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ peopleType, currentData }) => {
  const [chartDataType, setChartDataType] = useState("total");

  // Client metrics dummy data
  const clientMetrics = {
    avgTimeToSolve: "2.3 weeks",
    sessionBookings: {
      firstSession: { count: 450, percentage: 89 },
      secondSession: { count: 380, percentage: 75 },
      thirdSession: { count: 320, percentage: 63 },
      tenthSession: { count: 180, percentage: 36 }
    },
    avgPerClient: {
      weeks: "8.2 weeks",
      hours: "15.6 hours",
      sessions: "7.4 sessions",
      value: "$1,240"
    }
  };

  // Pending client issues dummy data
  const pendingIssues = [
    { id: 1, issue: "Missed appointments without prior notice", severity: "High", clientCount: 23 },
    { id: 2, issue: "Payment processing delays", severity: "Medium", clientCount: 18 },
    { id: 3, issue: "Communication response delays", severity: "Medium", clientCount: 15 },
    { id: 4, issue: "Documentation completion issues", severity: "Low", clientCount: 12 },
    { id: 5, issue: "Provider scheduling conflicts", severity: "High", clientCount: 8 }
  ];

  const renderLeadsContent = () => {
    const metrics = currentData.metrics as {
      avgApplicationToAssessment: string;
      avgAssessmentToProviderPick: string;
      avgProviderPickToMeeting: string;
    };
    const otherData = currentData.otherData;
    const chartData = currentData.charts.leadsOverview;

    return (
      <div className="space-y-6">
        {/* Leads Overview Chart */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Leads Overview</CardTitle>
              <Select value={chartDataType} onValueChange={setChartDataType}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Total</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart
              data={chartData}
              series={[
                { dataKey: "leads", name: "Leads", color: "#3b82f6", enabled: true },
                { dataKey: "noShows", name: "No Shows", color: "#ef4444", enabled: true },
                { dataKey: "referrals", name: "Referrals", color: "#22c55e", enabled: true }
              ]}
              xAxisDataKey="month"
              height={300}
              showSeriesToggle={true}
            />
          </CardContent>
        </Card>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Application to Assessment Time</p>
                  <p className="text-xl font-bold">{metrics.avgApplicationToAssessment}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Assessment to Provider Pick Time</p>
                  <p className="text-xl font-bold">{metrics.avgAssessmentToProviderPick}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Provider Pick to Meeting Time</p>
                  <p className="text-xl font-bold">{metrics.avgProviderPickToMeeting}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Other Data Section */}
        <Card>
          <CardHeader>
            <CardTitle>Other Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Leads Source */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Leads Source</h4>
              <BarChart
                data={otherData.leadsSource}
                series={[{ dataKey: "percentage", name: "Percentage", color: "#3b82f6", enabled: true }]}
                xAxisDataKey="source"
                height={250}
                showSeriesToggle={false}
              />
            </div>

            {/* Application Times */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-4">Application Days</h4>
                <BarChart
                  data={otherData.applicationTimes.weekdays}
                  series={[{ dataKey: "percentage", name: "Percentage", color: "#22c55e", enabled: true }]}
                  xAxisDataKey="day"
                  height={200}
                  showSeriesToggle={false}
                />
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Application Hours</h4>
                <BarChart
                  data={otherData.applicationTimes.hours}
                  series={[{ dataKey: "percentage", name: "Percentage", color: "#f59e0b", enabled: true }]}
                  xAxisDataKey="time"
                  height={200}
                  showSeriesToggle={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderClientsContent = () => {
    const charts = currentData.charts;

    return (
      <div className="space-y-6">
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Clients vs Attending</CardTitle>
                <Select value={chartDataType} onValueChange={setChartDataType}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Total</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <LineChart
                data={charts.clientsVsAttending}
                series={[
                  { dataKey: "clients", name: "Clients", color: "#3b82f6", enabled: true },
                  { dataKey: "attending", name: "Attending", color: "#22c55e", enabled: true }
                ]}
                xAxisDataKey="month"
                height={250}
                showSeriesToggle={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Discharged vs Issues</CardTitle>
                <Select value={chartDataType} onValueChange={setChartDataType}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Total</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <LineChart
                data={charts.dischargedVsIssues}
                series={[
                  { dataKey: "discharged", name: "Discharged", color: "#ef4444", enabled: true },
                  { dataKey: "issues", name: "Issues", color: "#f59e0b", enabled: true }
                ]}
                xAxisDataKey="month"
                height={250}
                showSeriesToggle={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Client Metrics Widget Group */}
        <Card>
          <CardHeader>
            <CardTitle>Client Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Avg Time to Solve Issue</div>
                  <div className="text-2xl font-bold">{clientMetrics.avgTimeToSolve}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Avg Weeks per Client</div>
                  <div className="text-2xl font-bold">{clientMetrics.avgPerClient.weeks}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Avg Hours per Client</div>
                  <div className="text-2xl font-bold">{clientMetrics.avgPerClient.hours}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Avg Value per Client</div>
                  <div className="text-2xl font-bold">{clientMetrics.avgPerClient.value}</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Session Booking Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">1st Session Bookings</div>
                  <div className="text-xl font-bold">{clientMetrics.sessionBookings.firstSession.count}</div>
                  <div className="text-sm text-green-600">{clientMetrics.sessionBookings.firstSession.percentage}% of all clients</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">2nd Session Bookings</div>
                  <div className="text-xl font-bold">{clientMetrics.sessionBookings.secondSession.count}</div>
                  <div className="text-sm text-green-600">{clientMetrics.sessionBookings.secondSession.percentage}% of all clients</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">3rd Session Bookings</div>
                  <div className="text-xl font-bold">{clientMetrics.sessionBookings.thirdSession.count}</div>
                  <div className="text-sm text-green-600">{clientMetrics.sessionBookings.thirdSession.percentage}% of all clients</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">10th Session Bookings</div>
                  <div className="text-xl font-bold">{clientMetrics.sessionBookings.tenthSession.count}</div>
                  <div className="text-sm text-green-600">{clientMetrics.sessionBookings.tenthSession.percentage}% of all clients</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Pending Client Issues Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pending Client Issues</CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View all issues
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Affected Clients</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">{issue.issue}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        issue.severity === 'High' ? 'bg-red-100 text-red-700' :
                        issue.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {issue.severity}
                      </span>
                    </TableCell>
                    <TableCell>{issue.clientCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Client Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Client Demographics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Age Groups - Keep as chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Age Groups</h4>
                <BarChart
                  data={currentData.demographics.ageGroups}
                  series={[{ dataKey: "count", name: "Count", color: "#3b82f6", enabled: true }]}
                  xAxisDataKey="group"
                  height={200}
                  showSeriesToggle={false}
                />
              </div>

              {/* Gender Identity - Keep as chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Gender Identity</h4>
                <BarChart
                  data={currentData.demographics.genderIdentity}
                  series={[{ dataKey: "count", name: "Count", color: "#22c55e", enabled: true }]}
                  xAxisDataKey="identity"
                  height={200}
                  showSeriesToggle={false}
                />
              </div>

              {/* Ethnicity - Convert to text format */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Ethnicity</h4>
                <div className="space-y-2">
                  {currentData.demographics.ethnicity.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-medium">{item.ethnicity}</span>
                      <span className="text-sm text-muted-foreground">{item.count} clients</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Locations - Convert to text format */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Geographic Locations</h4>
                <div className="space-y-2">
                  {currentData.demographics.locations.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-medium">{item.region}</span>
                      <span className="text-sm text-muted-foreground">{item.count} clients</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language Preferences - Convert to text format */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Language Preferences</h4>
                <div className="space-y-2">
                  {currentData.demographics.languages.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-medium">{item.language}</span>
                      <span className="text-sm text-muted-foreground">{item.count} clients</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insurance - Convert to text format */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Insurance</h4>
                <div className="space-y-2">
                  {currentData.demographics.insurance.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-medium">{item.provider}</span>
                      <span className="text-sm text-muted-foreground">{item.count} clients</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderStaffContent = () => {
    const charts = currentData.charts;
    
    // Add inactive data to the staff chart
    const staffChartData = charts.activeVsOnboarding.map((item: any) => ({
      ...item,
      inactive: Math.floor(item.active * 0.1) + Math.floor(Math.random() * 5) // Add some dummy inactive data
    }));

    return (
      <div className="space-y-6">
        {/* Staff Overview Chart with Inactive data */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Staff Overview</CardTitle>
              <Select value={chartDataType} onValueChange={setChartDataType}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Total</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart
              data={staffChartData}
              series={[
                { dataKey: "active", name: "Active", color: "#3b82f6", enabled: true },
                { dataKey: "inactive", name: "Inactive", color: "#ef4444", enabled: true },
                { dataKey: "onboarding", name: "Onboarding", color: "#22c55e", enabled: true }
              ]}
              xAxisDataKey="month"
              height={300}
              showSeriesToggle={true}
            />
          </CardContent>
        </Card>

        {/* Staff Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Demographics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Age Groups - Keep as chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Age Groups</h4>
                <BarChart
                  data={currentData.demographics.ageGroups}
                  series={[{ dataKey: "count", name: "Count", color: "#3b82f6", enabled: true }]}
                  xAxisDataKey="group"
                  height={200}
                  showSeriesToggle={false}
                />
              </div>

              {/* Gender Identity - Keep as chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Gender Identity</h4>
                <BarChart
                  data={currentData.demographics.genderIdentity}
                  series={[{ dataKey: "count", name: "Count", color: "#22c55e", enabled: true }]}
                  xAxisDataKey="identity"
                  height={200}
                  showSeriesToggle={false}
                />
              </div>

              {/* Years of Service - Keep as chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Years of Service/Tenure</h4>
                <BarChart
                  data={currentData.demographics.tenure}
                  series={[{ dataKey: "count", name: "Count", color: "#10b981", enabled: true }]}
                  xAxisDataKey="years"
                  height={200}
                  showSeriesToggle={false}
                />
              </div>

              {/* Ethnicity - Convert to text format */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Ethnicity</h4>
                <div className="space-y-2">
                  {currentData.demographics.ethnicity.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-medium">{item.ethnicity}</span>
                      <span className="text-sm text-muted-foreground">{item.count} staff</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Locations - Convert to text format */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Geographic Locations</h4>
                <div className="space-y-2">
                  {currentData.demographics.locations.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-medium">{item.region}</span>
                      <span className="text-sm text-muted-foreground">{item.count} staff</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spoken Languages - Convert to text format */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Spoken Languages</h4>
                <div className="space-y-2">
                  {currentData.demographics.languages.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-medium">{item.language}</span>
                      <span className="text-sm text-muted-foreground">{item.count} staff</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role/Job Titles - Convert to text format */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Role/Job Titles</h4>
                <div className="space-y-2">
                  {currentData.demographics.roles.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-medium">{item.role}</span>
                      <span className="text-sm text-muted-foreground">{item.count} staff</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div>
      {peopleType === "leads" && renderLeadsContent()}
      {peopleType === "clients" && renderClientsContent()}
      {peopleType === "staff" && renderStaffContent()}
    </div>
  );
};

export default GeneralTab;
