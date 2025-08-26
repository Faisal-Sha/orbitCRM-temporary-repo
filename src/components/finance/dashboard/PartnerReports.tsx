
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown, Users, Clock } from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";

interface PartnerReportsProps {
  dateRange: string;
  customDateRange: {from?: Date; to?: Date};
}

const PartnerReports: React.FC<PartnerReportsProps> = ({ dateRange, customDateRange }) => {
  const [tableFilter, setTableFilter] = useState("this-year");

  // Dummy data for widgets
  const widgetData = [
    { title: "Total Clients", value: "1,247", change: "+12%", trend: "up", icon: Users },
    { title: "New Clients", value: "89", change: "+23%", trend: "up", icon: TrendingUp },
    { title: "Service Hours", value: "4,523", change: "+8%", trend: "up", icon: Clock },
    { title: "Total Revenue", value: "$2,847,293", change: "+15%", trend: "up", icon: TrendingUp },
    { title: "Service Providers", value: "47", change: "+2%", trend: "up", icon: Users },
    { title: "Revenue per Client (ARPU)", value: "$4,293", change: "+18%", trend: "up", icon: TrendingUp },
    { title: "Revenue per Service Provider", value: "$87,432", change: "+12%", trend: "up", icon: TrendingUp },
  ];

  // Chart data
  const chartData = [
    { month: 'Jan', clients: 1120, newClients: 67, serviceHours: 4200, revenue: 185000 },
    { month: 'Feb', clients: 1145, newClients: 72, serviceHours: 4350, revenue: 210000 },
    { month: 'Mar', clients: 1167, newClients: 68, serviceHours: 4280, revenue: 195000 },
    { month: 'Apr', clients: 1189, newClients: 81, serviceHours: 4450, revenue: 225000 },
    { month: 'May', clients: 1208, newClients: 76, serviceHours: 4380, revenue: 240000 },
    { month: 'Jun', clients: 1247, newClients: 89, serviceHours: 4523, revenue: 255000 }
  ];

  const chartSeries = [
    { dataKey: 'clients', name: 'Total Clients', color: '#3b82f6' },
    { dataKey: 'newClients', name: 'New Clients', color: '#10b981' },
    { dataKey: 'serviceHours', name: 'Service Hours', color: '#f59e0b' }
  ];

  // Table data
  const tableData = [
    { metric: "Total Clients", jan: "1,120", feb: "1,145", mar: "1,167", apr: "1,189", may: "1,208", jun: "1,247", jul: "1,265", aug: "1,283", sep: "1,301", oct: "1,319", nov: "1,337", dec: "1,355" },
    { metric: "New Clients", jan: "67", feb: "72", mar: "68", apr: "81", may: "76", jun: "89", jul: "78", aug: "84", sep: "79", oct: "85", nov: "82", dec: "88" },
    { metric: "Service Hours", jan: "4,200", feb: "4,350", mar: "4,280", apr: "4,450", may: "4,380", jun: "4,523", jul: "4,610", aug: "4,720", sep: "4,680", oct: "4,790", nov: "4,850", dec: "4,920" },
    { metric: "Total Revenue", jan: "$185K", feb: "$210K", mar: "$195K", apr: "$225K", may: "$240K", jun: "$255K", jul: "$270K", aug: "$285K", sep: "$290K", oct: "$305K", nov: "$320K", dec: "$335K" },
    { metric: "Service Providers", jan: "42", feb: "43", mar: "44", apr: "45", may: "46", jun: "47", jul: "48", aug: "49", sep: "50", oct: "51", nov: "52", dec: "53" },
    { metric: "Revenue per Client (ARPU)", jan: "$3,850", feb: "$4,020", mar: "$3,920", apr: "$4,180", may: "$4,280", jun: "$4,293", jul: "$4,350", aug: "$4,420", sep: "$4,380", oct: "$4,510", nov: "$4,580", dec: "$4,620" },
    { metric: "Revenue per Service Provider", jan: "$78,500", feb: "$82,450", mar: "$79,800", apr: "$85,200", may: "$86,700", jun: "$87,432", jul: "$88,750", aug: "$90,200", sep: "$89,600", oct: "$92,100", nov: "$93,800", dec: "$95,500" },
  ];

  return (
    <div className="space-y-6">
      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgetData.map((widget, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
              <widget.icon className={`h-4 w-4 ${widget.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{widget.value}</div>
              <p className={`text-xs ${widget.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {widget.change} vs. Previous Period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={chartData}
          series={[
            { dataKey: 'clients', name: 'Total Clients', color: '#3b82f6' },
            { dataKey: 'newClients', name: 'New Clients', color: '#10b981' }
          ]}
          xAxisDataKey="month"
          chartTitle="Client Growth"
          height={300}
        />
        <LineChart
          data={chartData}
          series={[{ dataKey: 'serviceHours', name: 'Service Hours', color: '#f59e0b' }]}
          xAxisDataKey="month"
          chartTitle="Service Hours Trend"
          height={300}
        />
      </div>

      {/* Download Report Button */}
      <Card>
        <CardContent className="pt-6">
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Partner Report (PDF)
          </Button>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Partner Metrics</CardTitle>
            <Select value={tableFilter} onValueChange={setTableFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Metric</TableHead>
                <TableHead>Jan</TableHead>
                <TableHead>Feb</TableHead>
                <TableHead>Mar</TableHead>
                <TableHead>Apr</TableHead>
                <TableHead>May</TableHead>
                <TableHead>Jun</TableHead>
                <TableHead>Jul</TableHead>
                <TableHead>Aug</TableHead>
                <TableHead>Sep</TableHead>
                <TableHead>Oct</TableHead>
                <TableHead>Nov</TableHead>
                <TableHead>Dec</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.metric}</TableCell>
                  <TableCell>{row.jan}</TableCell>
                  <TableCell>{row.feb}</TableCell>
                  <TableCell>{row.mar}</TableCell>
                  <TableCell>{row.apr}</TableCell>
                  <TableCell>{row.may}</TableCell>
                  <TableCell>{row.jun}</TableCell>
                  <TableCell>{row.jul}</TableCell>
                  <TableCell>{row.aug}</TableCell>
                  <TableCell>{row.sep}</TableCell>
                  <TableCell>{row.oct}</TableCell>
                  <TableCell>{row.nov}</TableCell>
                  <TableCell>{row.dec}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerReports;
