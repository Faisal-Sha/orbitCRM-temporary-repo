
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown, DollarSign, Users, Clock, Activity } from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";

interface RevenueAnalyticsProps {
  dateRange: string;
  customDateRange: {from?: Date; to?: Date};
}

const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({ dateRange, customDateRange }) => {
  const [tableFilter, setTableFilter] = useState("this-year");

  // Dummy data for widgets
  const widgetData = [
    { title: "Total Revenue", value: "$2,847,293", change: "+15%", trend: "up", icon: DollarSign },
    { title: "Total Services", value: "3", change: "0%", trend: "neutral", icon: Activity },
    { title: "Total Clients (All)", value: "1,247", change: "+12%", trend: "up", icon: Users },
    { title: "Total Clients (Engaged)", value: "923", change: "+18%", trend: "up", icon: Users },
    { title: "Hours/Client/Month (All)", value: "8.5", change: "+5%", trend: "up", icon: Clock },
    { title: "Hours/Client/Month (Engaged)", value: "11.2", change: "+8%", trend: "up", icon: Clock },
    { title: "Sessions/Client/Month (All)", value: "4.2", change: "+3%", trend: "up", icon: Activity },
    { title: "Sessions/Client/Month (Engaged)", value: "5.8", change: "+12%", trend: "up", icon: Activity },
    { title: "Revenue/Client (All)", value: "$2,284", change: "+7%", trend: "up", icon: DollarSign },
    { title: "Revenue/Client (Engaged)", value: "$3,087", change: "+15%", trend: "up", icon: DollarSign },
    { title: "Service Providers (All)", value: "47", change: "+6%", trend: "up", icon: Users },
    { title: "Revenue/Provider", value: "$60,581", change: "+9%", trend: "up", icon: DollarSign },
  ];

  // Chart data
  const chartData = [
    { 
      month: 'Jan', 
      totalRevenue: 185000, 
      assessments: 45000, 
      sud: 85000, 
      cpst: 55000,
      allClients: 1120,
      engagedClients: 840
    },
    { 
      month: 'Feb', 
      totalRevenue: 210000, 
      assessments: 52000, 
      sud: 95000, 
      cpst: 63000,
      allClients: 1145,
      engagedClients: 858
    },
    { 
      month: 'Mar', 
      totalRevenue: 195000, 
      assessments: 48000, 
      sud: 88000, 
      cpst: 59000,
      allClients: 1167,
      engagedClients: 875
    },
    { 
      month: 'Apr', 
      totalRevenue: 225000, 
      assessments: 55000, 
      sud: 102000, 
      cpst: 68000,
      allClients: 1189,
      engagedClients: 892
    },
    { 
      month: 'May', 
      totalRevenue: 240000, 
      assessments: 58000, 
      sud: 108000, 
      cpst: 74000,
      allClients: 1208,
      engagedClients: 906
    },
    { 
      month: 'Jun', 
      totalRevenue: 255000, 
      assessments: 62000, 
      sud: 115000, 
      cpst: 78000,
      allClients: 1247,
      engagedClients: 923
    }
  ];

  const revenueChartSeries = [
    { dataKey: 'assessments', name: 'Assessments', color: '#3b82f6' },
    { dataKey: 'sud', name: 'SUD', color: '#10b981' },
    { dataKey: 'cpst', name: 'CPST', color: '#f59e0b' }
  ];

  const clientChartSeries = [
    { dataKey: 'allClients', name: 'All Clients', color: '#6366f1' },
    { dataKey: 'engagedClients', name: 'Engaged Clients', color: '#14b8a6' }
  ];

  // Comprehensive table data with proper segmentation
  const tableData = [
    // Revenue Section
    { metric: "Total Revenue", jan: "$185K", feb: "$210K", mar: "$195K", apr: "$225K", may: "$240K", jun: "$255K", jul: "$270K", aug: "$285K", sep: "$290K", oct: "$305K", nov: "$320K", dec: "$335K" },
    { metric: "Total Services", jan: "3", feb: "3", mar: "3", apr: "3", may: "3", jun: "3", jul: "3", aug: "3", sep: "3", oct: "3", nov: "3", dec: "3" },
    { metric: "Assessments Revenue", jan: "$45K", feb: "$52K", mar: "$48K", apr: "$55K", may: "$58K", jun: "$62K", jul: "$65K", aug: "$68K", sep: "$70K", oct: "$73K", nov: "$76K", dec: "$79K" },
    { metric: "SUD Revenue", jan: "$85K", feb: "$95K", mar: "$88K", apr: "$102K", may: "$108K", jun: "$115K", jul: "$122K", aug: "$129K", sep: "$131K", oct: "$138K", nov: "$145K", dec: "$152K" },
    { metric: "CPST Revenue", jan: "$55K", feb: "$63K", mar: "$59K", apr: "$68K", may: "$74K", jun: "$78K", jul: "$83K", aug: "$88K", sep: "$89K", oct: "$94K", nov: "$99K", dec: "$104K" },
    // Separator row for visual organization
    { metric: "--- CLIENT METRICS ---", jan: "---", feb: "---", mar: "---", apr: "---", may: "---", jun: "---", jul: "---", aug: "---", sep: "---", oct: "---", nov: "---", dec: "---" },
    { metric: "New Clients", jan: "67", feb: "72", mar: "68", apr: "81", may: "76", jun: "89", jul: "78", aug: "84", sep: "79", oct: "85", nov: "82", dec: "88" },
    { metric: "Total Clients (All)", jan: "1,120", feb: "1,145", mar: "1,167", apr: "1,189", may: "1,208", jun: "1,247", jul: "1,265", aug: "1,283", sep: "1,301", oct: "1,319", nov: "1,337", dec: "1,355" },
    { metric: "Total Clients (Engaged)", jan: "840", feb: "858", mar: "875", apr: "892", may: "906", jun: "923", jul: "938", aug: "952", sep: "967", oct: "981", nov: "996", dec: "1,010" },
    { metric: "Hours/Client/Month (All)", jan: "8.2", feb: "8.3", mar: "8.1", apr: "8.4", may: "8.3", jun: "8.5", jul: "8.6", aug: "8.7", sep: "8.6", oct: "8.8", nov: "8.9", dec: "9.0" },
    { metric: "Hours/Client/Month (Engaged)", jan: "10.8", feb: "10.9", mar: "10.7", apr: "11.0", may: "11.0", jun: "11.2", jul: "11.3", aug: "11.4", sep: "11.3", oct: "11.5", nov: "11.6", dec: "11.7" },
    { metric: "Hours/Client/Week (All)", jan: "2.1", feb: "2.1", mar: "2.0", apr: "2.1", may: "2.1", jun: "2.1", jul: "2.2", aug: "2.2", sep: "2.2", oct: "2.2", nov: "2.2", dec: "2.3" },
    { metric: "Hours/Client/Week (Engaged)", jan: "2.7", feb: "2.7", mar: "2.7", apr: "2.8", may: "2.8", jun: "2.8", jul: "2.8", aug: "2.9", sep: "2.8", oct: "2.9", nov: "2.9", dec: "2.9" },
    { metric: "Sessions/Client/Month (All)", jan: "4.0", feb: "4.1", mar: "3.9", apr: "4.1", may: "4.1", jun: "4.2", jul: "4.2", aug: "4.3", sep: "4.2", oct: "4.3", nov: "4.4", dec: "4.4" },
    { metric: "Sessions/Client/Month (Engaged)", jan: "5.5", feb: "5.6", mar: "5.4", apr: "5.7", may: "5.6", jun: "5.8", jul: "5.8", aug: "5.9", sep: "5.8", oct: "5.9", nov: "6.0", dec: "6.0" },
    { metric: "Sessions/Client/Week (All)", jan: "1.0", feb: "1.0", mar: "1.0", apr: "1.0", may: "1.0", jun: "1.1", jul: "1.1", aug: "1.1", sep: "1.1", oct: "1.1", nov: "1.1", dec: "1.1" },
    { metric: "Sessions/Client/Week (Engaged)", jan: "1.4", feb: "1.4", mar: "1.4", apr: "1.4", may: "1.4", jun: "1.5", jul: "1.5", aug: "1.5", sep: "1.5", oct: "1.5", nov: "1.5", dec: "1.5" },
    { metric: "Revenue/Client (All)", jan: "$2,120", feb: "$2,180", mar: "$2,140", apr: "$2,240", may: "$2,260", jun: "$2,284", jul: "$2,310", aug: "$2,335", sep: "$2,350", oct: "$2,375", nov: "$2,400", dec: "$2,425" },
    { metric: "Revenue/Client (Engaged)", jan: "$2,850", feb: "$2,920", mar: "$2,880", apr: "$3,010", may: "$3,040", jun: "$3,087", jul: "$3,120", aug: "$3,155", sep: "$3,175", oct: "$3,205", nov: "$3,240", dec: "$3,275" },
    // Separator row for visual organization
    { metric: "--- PROVIDER METRICS ---", jan: "---", feb: "---", mar: "---", apr: "---", may: "---", jun: "---", jul: "---", aug: "---", sep: "---", oct: "---", nov: "---", dec: "---" },
    { metric: "Total Service Providers (All)", jan: "42", feb: "43", mar: "44", apr: "45", may: "46", jun: "47", jul: "48", aug: "49", sep: "50", oct: "51", nov: "52", dec: "53" },
    { metric: "Total Service Providers (Engaged)", jan: "38", feb: "39", mar: "40", apr: "41", may: "42", jun: "43", jul: "44", aug: "45", sep: "46", oct: "47", nov: "48", dec: "49" },
    { metric: "Hours/Service Provider (All)", jan: "102", feb: "105", mar: "103", apr: "108", may: "106", jun: "109", jul: "112", aug: "115", sep: "113", oct: "116", nov: "119", dec: "122" },
    { metric: "Hours/Service Provider (Engaged)", jan: "113", feb: "116", mar: "114", apr: "119", may: "117", jun: "120", jul: "123", aug: "126", sep: "124", oct: "127", nov: "130", dec: "133" },
    { metric: "Sessions/Service Provider (All)", jan: "48", feb: "50", mar: "49", apr: "52", may: "50", jun: "53", jul: "54", aug: "56", sep: "55", oct: "57", nov: "58", dec: "60" },
    { metric: "Sessions/Service Provider (Engaged)", jan: "54", feb: "56", mar: "55", apr: "58", may: "56", jun: "59", jul: "60", aug: "62", sep: "61", oct: "63", nov: "64", dec: "66" },
    { metric: "Revenue/Service Provider (All)", jan: "$55K", feb: "$57K", mar: "$56K", apr: "$59K", may: "$58K", jun: "$61K", jul: "$62K", aug: "$64K", sep: "$63K", oct: "$65K", nov: "$67K", dec: "$69K" },
    { metric: "Revenue/Service Provider (Engaged)", jan: "$61K", feb: "$63K", mar: "$62K", apr: "$65K", may: "$64K", jun: "$67K", jul: "$68K", aug: "$70K", sep: "$69K", oct: "$71K", nov: "$73K", dec: "$75K" },
  ];

  return (
    <div className="space-y-6">
      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgetData.slice(0, 8).map((widget, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
              <widget.icon className={`h-4 w-4 ${widget.trend === 'up' ? 'text-green-600' : widget.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{widget.value}</div>
              <p className={`text-xs ${widget.trend === 'up' ? 'text-green-600' : widget.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                {widget.change} vs. Previous Period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Second row of widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgetData.slice(8).map((widget, index) => (
          <Card key={index + 8}>
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
          series={revenueChartSeries}
          xAxisDataKey="month"
          chartTitle="Revenue by Service Type"
          height={300}
        />
        <LineChart
          data={chartData}
          series={clientChartSeries}
          xAxisDataKey="month"
          chartTitle="All vs Engaged Clients"
          height={300}
        />
      </div>

      {/* Download Report Button */}
      <Card>
        <CardContent className="pt-6">
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Revenue Report (PDF)
          </Button>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revenue Analytics</CardTitle>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Metric</TableHead>
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
                  <TableRow key={index} className={row.metric.includes('---') ? 'bg-muted/50 font-semibold' : ''}>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueAnalytics;
