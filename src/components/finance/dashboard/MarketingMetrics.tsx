
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown, DollarSign, Users, Calendar, Target } from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";

interface MarketingMetricsProps {
  dateRange: string;
  customDateRange: {from?: Date; to?: Date};
}

const MarketingMetrics: React.FC<MarketingMetricsProps> = ({ dateRange, customDateRange }) => {
  const [tableFilter, setTableFilter] = useState("this-year");

  // Dummy data for widgets
  const widgetData = [
    { title: "Total Marketing Spend", value: "$127,450", change: "+8%", trend: "up", icon: DollarSign },
    { title: "Leads Generated", value: "2,847", change: "+23%", trend: "up", icon: Users },
    { title: "Appointments Booked", value: "1,293", change: "+15%", trend: "up", icon: Calendar },
    { title: "Clients Enrolled", value: "456", change: "+28%", trend: "up", icon: Target },
    { title: "Cost per Lead (CPL)", value: "$45", change: "-12%", trend: "down", icon: TrendingDown },
    { title: "Cost per Appointment (CPApp)", value: "$99", change: "-8%", trend: "down", icon: TrendingDown },
    { title: "Cost per Client (CAC)", value: "$279", change: "-15%", trend: "down", icon: TrendingDown },
    { title: "LTV:CAC Ratio", value: "4.2:1", change: "+0.3", trend: "up", icon: TrendingUp },
  ];

  // Chart data
  const chartData = [
    { month: 'Jan', spend: 18500, leads: 410, appointments: 180, clients: 62 },
    { month: 'Feb', spend: 21000, leads: 467, appointments: 205, clients: 71 },
    { month: 'Mar', spend: 19500, leads: 433, appointments: 192, clients: 66 },
    { month: 'Apr', spend: 22500, leads: 500, appointments: 220, clients: 76 },
    { month: 'May', spend: 24000, leads: 533, appointments: 235, clients: 81 },
    { month: 'Jun', spend: 25500, leads: 567, appointments: 250, clients: 86 }
  ];

  const chartSeries = [
    { dataKey: 'spend', name: 'Marketing Spend', color: '#ef4444' },
    { dataKey: 'leads', name: 'Leads Generated', color: '#3b82f6' },
    { dataKey: 'appointments', name: 'Appointments', color: '#f59e0b' },
    { dataKey: 'clients', name: 'Clients Enrolled', color: '#10b981' }
  ];

  // Table data
  const tableData = [
    { metric: "Total Marketing Spend", jan: "$18.5K", feb: "$21K", mar: "$19.5K", apr: "$22.5K", may: "$24K", jun: "$25.5K", jul: "$26K", aug: "$27.5K", sep: "$28K", oct: "$29K", nov: "$30K", dec: "$31K" },
    { metric: "Leads Generated", jan: "410", feb: "467", mar: "433", apr: "500", may: "533", jun: "567", jul: "580", aug: "612", sep: "635", oct: "658", nov: "672", dec: "695" },
    { metric: "Appointments Booked", jan: "180", feb: "205", mar: "192", apr: "220", may: "235", jun: "250", jul: "260", aug: "275", sep: "285", oct: "295", nov: "305", dec: "315" },
    { metric: "Clients Enrolled", jan: "62", feb: "71", mar: "66", apr: "76", may: "81", jun: "86", jul: "89", aug: "94", sep: "98", oct: "102", nov: "106", dec: "110" },
    { metric: "Cost per Lead (CPL)", jan: "$45", feb: "$45", mar: "$45", apr: "$45", may: "$45", jun: "$45", jul: "$45", aug: "$45", sep: "$44", oct: "$44", nov: "$45", dec: "$45" },
    { metric: "Cost per Appointment (CPApp)", jan: "$103", feb: "$102", mar: "$102", apr: "$102", may: "$102", jun: "$102", jul: "$100", aug: "$100", sep: "$98", oct: "$98", nov: "$98", dec: "$98" },
    { metric: "Cost per Client (CAC)", jan: "$298", feb: "$296", mar: "$295", apr: "$296", may: "$296", jun: "$297", jul: "$292", aug: "$293", sep: "$286", oct: "$284", nov: "$283", dec: "$282" },
    { metric: "Lifetime Value (LTV)", jan: "$1,250", feb: "$1,275", mar: "$1,290", apr: "$1,310", may: "$1,325", jun: "$1,340", jul: "$1,355", aug: "$1,370", sep: "$1,385", oct: "$1,400", nov: "$1,415", dec: "$1,430" },
    { metric: "CAC Ratio", jan: "4.2", feb: "4.3", mar: "4.4", apr: "4.4", may: "4.5", jun: "4.5", jul: "4.6", aug: "4.7", sep: "4.8", oct: "4.9", nov: "5.0", dec: "5.1" },
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
            { dataKey: 'spend', name: 'Marketing Spend', color: '#ef4444' },
            { dataKey: 'leads', name: 'Leads Generated', color: '#3b82f6' }
          ]}
          xAxisDataKey="month"
          chartTitle="Marketing Spend vs Leads"
          height={300}
        />
        <LineChart
          data={chartData}
          series={[
            { dataKey: 'appointments', name: 'Appointments', color: '#f59e0b' },
            { dataKey: 'clients', name: 'Clients Enrolled', color: '#10b981' }
          ]}
          xAxisDataKey="month"
          chartTitle="Conversion Funnel"
          height={300}
        />
      </div>

      {/* Download Report Button */}
      <Card>
        <CardContent className="pt-6">
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Marketing Report (PDF)
          </Button>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Marketing Metrics</CardTitle>
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

export default MarketingMetrics;
