
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";

interface ExecutivePanelProps {
  dateRange: string;
  customDateRange: {from?: Date; to?: Date};
}

const ExecutivePanel: React.FC<ExecutivePanelProps> = ({ dateRange, customDateRange }) => {
  const [tableFilter, setTableFilter] = useState("this-year");

  // Dummy data for widgets
  const widgetData = [
    { title: "Total Revenue", value: "$2,847,293", change: "+15%", trend: "up", icon: TrendingUp },
    { title: "Total Expenses", value: "$1,923,847", change: "-3%", trend: "down", icon: TrendingDown },
    { title: "Net Profit", value: "$923,446", change: "+28%", trend: "up", icon: TrendingUp },
    { title: "Margin %", value: "32.4%", change: "+2.1%", trend: "up", icon: TrendingUp },
    { title: "Cash on Hand", value: "$1,245,789", change: "+8%", trend: "up", icon: TrendingUp },
    { title: "Cost per Lead (CPL)", value: "$127", change: "-12%", trend: "down", icon: TrendingDown },
    { title: "Cost per Client (CAC)", value: "$1,847", change: "-5%", trend: "down", icon: TrendingDown },
    { title: "Revenue per Client (ARPU)", value: "$4,293", change: "+18%", trend: "up", icon: TrendingUp },
    { title: "Revenue per Service Provider", value: "$87,432", change: "+12%", trend: "up", icon: TrendingUp },
    { title: "Outstanding Invoices", value: "$234,567 (47)", change: "+4%", trend: "up", icon: TrendingUp },
    { title: "Projected Runway", value: "18 months", change: "+2 months", trend: "up", icon: TrendingUp },
  ];

  // Chart data
  const chartData = [
    { month: 'Jan', revenue: 185000, expenses: 125000, profit: 60000 },
    { month: 'Feb', revenue: 210000, expenses: 140000, profit: 70000 },
    { month: 'Mar', revenue: 195000, expenses: 135000, profit: 60000 },
    { month: 'Apr', revenue: 225000, expenses: 150000, profit: 75000 },
    { month: 'May', revenue: 240000, expenses: 165000, profit: 75000 },
    { month: 'Jun', revenue: 255000, expenses: 170000, profit: 85000 }
  ];

  const chartSeries = [
    { dataKey: 'revenue', name: 'Revenue', color: '#3b82f6' },
    { dataKey: 'expenses', name: 'Expenses', color: '#ef4444' },
    { dataKey: 'profit', name: 'Net Profit', color: '#10b981' }
  ];

  // Table data
  const tableData = [
    { metric: "Total Revenue", jan: "$185K", feb: "$210K", mar: "$195K", apr: "$225K", may: "$240K", jun: "$255K", jul: "$270K", aug: "$285K", sep: "$290K", oct: "$305K", nov: "$320K", dec: "$335K" },
    { metric: "Total Expenses", jan: "$125K", feb: "$140K", mar: "$135K", apr: "$150K", may: "$165K", jun: "$170K", jul: "$175K", aug: "$180K", sep: "$185K", oct: "$190K", nov: "$195K", dec: "$200K" },
    { metric: "Net Profit", jan: "$60K", feb: "$70K", mar: "$60K", apr: "$75K", may: "$75K", jun: "$85K", jul: "$95K", aug: "$105K", sep: "$105K", oct: "$115K", nov: "$125K", dec: "$135K" },
    { metric: "Margin %", jan: "32.4%", feb: "33.3%", mar: "30.8%", apr: "33.3%", may: "31.3%", jun: "33.3%", jul: "35.2%", aug: "36.8%", sep: "36.2%", oct: "37.7%", nov: "39.1%", dec: "40.3%" },
    { metric: "Cash on Hand", jan: "$850K", feb: "$920K", mar: "$980K", apr: "$1.05M", may: "$1.13M", jun: "$1.21M", jul: "$1.31M", aug: "$1.41M", sep: "$1.52M", oct: "$1.64M", nov: "$1.76M", dec: "$1.90M" },
    { metric: "Cost per Lead (CPL)", jan: "$145", feb: "$138", mar: "$142", apr: "$135", may: "$129", jun: "$127", jul: "$124", aug: "$121", sep: "$118", oct: "$115", nov: "$112", dec: "$109" },
    { metric: "Cost per Client (CAC)", jan: "$2,100", feb: "$2,050", mar: "$2,025", apr: "$1,975", may: "$1,925", jun: "$1,847", jul: "$1,800", aug: "$1,750", sep: "$1,700", oct: "$1,650", nov: "$1,600", dec: "$1,550" },
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
          series={chartSeries}
          xAxisDataKey="month"
          chartTitle="Revenue vs Expenses"
          height={300}
        />
        <LineChart
          data={chartData}
          series={[{ dataKey: 'profit', name: 'Net Profit', color: '#10b981' }]}
          xAxisDataKey="month"
          chartTitle="Net Profit Trend"
          height={300}
        />
      </div>

      {/* Download Report Button */}
      <Card>
        <CardContent className="pt-6">
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Executive Report (PDF)
          </Button>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Financial Metrics</CardTitle>
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

export default ExecutivePanel;
