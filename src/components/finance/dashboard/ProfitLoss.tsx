
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";

interface ProfitLossProps {
  dateRange: string;
  customDateRange: {from?: Date; to?: Date};
}

const ProfitLoss: React.FC<ProfitLossProps> = ({ dateRange, customDateRange }) => {
  const [tableFilter, setTableFilter] = useState("this-year");

  // Dummy data for widgets
  const widgetData = [
    { title: "Gross Revenue", value: "$2,847,293", change: "+15%", trend: "up", icon: DollarSign },
    { title: "Costs of Service", value: "$1,284,560", change: "+12%", trend: "up", icon: TrendingUp },
    { title: "Operating Expenses", value: "$547,287", change: "+5%", trend: "up", icon: TrendingUp },
    { title: "Gross Margin %", value: "54.9%", change: "+1.2%", trend: "up", icon: Percent },
    { title: "Net Income", value: "$923,446", change: "+28%", trend: "up", icon: TrendingUp },
    { title: "EBITDA", value: "$1,015,446", change: "+24%", trend: "up", icon: TrendingUp },
  ];

  // Chart data
  const chartData = [
    { 
      month: 'Jan', 
      grossRevenue: 185000, 
      costsOfService: 95000, 
      operatingExpenses: 38000,
      grossMargin: 48.6,
      netIncome: 52000,
      ebitda: 61000
    },
    { 
      month: 'Feb', 
      grossRevenue: 210000, 
      costsOfService: 104000, 
      operatingExpenses: 42000,
      grossMargin: 50.5,
      netIncome: 64000,
      ebitda: 74000
    },
    { 
      month: 'Mar', 
      grossRevenue: 195000, 
      costsOfService: 99000, 
      operatingExpenses: 40000,
      grossMargin: 49.2,
      netIncome: 56000,
      ebitda: 65000
    },
    { 
      month: 'Apr', 
      grossRevenue: 225000, 
      costsOfService: 109000, 
      operatingExpenses: 45000,
      grossMargin: 51.6,
      netIncome: 71000,
      ebitda: 81000
    },
    { 
      month: 'May', 
      grossRevenue: 240000, 
      costsOfService: 113000, 
      operatingExpenses: 47000,
      grossMargin: 52.9,
      netIncome: 80000,
      ebitda: 90000
    },
    { 
      month: 'Jun', 
      grossRevenue: 255000, 
      costsOfService: 117000, 
      operatingExpenses: 49000,
      grossMargin: 54.1,
      netIncome: 89000,
      ebitda: 99000
    }
  ];

  const revenueChartSeries = [
    { dataKey: 'grossRevenue', name: 'Gross Revenue', color: '#10b981' },
    { dataKey: 'costsOfService', name: 'Costs of Service', color: '#ef4444' },
    { dataKey: 'operatingExpenses', name: 'Operating Expenses', color: '#f59e0b' }
  ];

  const profitChartSeries = [
    { dataKey: 'netIncome', name: 'Net Income', color: '#3b82f6' },
    { dataKey: 'ebitda', name: 'EBITDA', color: '#8b5cf6' }
  ];

  // Table data
  const tableData = [
    { metric: "Gross Revenue", jan: "$185K", feb: "$210K", mar: "$195K", apr: "$225K", may: "$240K", jun: "$255K", jul: "$270K", aug: "$285K", sep: "$290K", oct: "$305K", nov: "$320K", dec: "$335K" },
    { metric: "Costs of Service", jan: "$95K", feb: "$104K", mar: "$99K", apr: "$109K", may: "$113K", jun: "$117K", jul: "$121K", aug: "$125K", sep: "$129K", oct: "$133K", nov: "$137K", dec: "$141K" },
    { metric: "Operating Expenses", jan: "$38K", feb: "$42K", mar: "$40K", apr: "$45K", may: "$47K", jun: "$49K", jul: "$51K", aug: "$53K", sep: "$55K", oct: "$57K", nov: "$59K", dec: "$61K" },
    { metric: "Gross Margin %", jan: "48.6%", feb: "50.5%", mar: "49.2%", apr: "51.6%", may: "52.9%", jun: "54.1%", jul: "55.2%", aug: "56.1%", sep: "55.5%", oct: "56.4%", nov: "57.2%", dec: "57.9%" },
    { metric: "Net Income", jan: "$52K", feb: "$64K", mar: "$56K", apr: "$71K", may: "$80K", jun: "$89K", jul: "$98K", aug: "$107K", sep: "$106K", oct: "$115K", nov: "$124K", dec: "$133K" },
    { metric: "EBITDA", jan: "$61K", feb: "$74K", mar: "$65K", apr: "$81K", may: "$90K", jun: "$99K", jul: "$108K", aug: "$117K", sep: "$116K", oct: "$125K", nov: "$134K", dec: "$143K" },
  ];

  return (
    <div className="space-y-6">
      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          series={revenueChartSeries}
          xAxisDataKey="month"
          chartTitle="P&L Components"
          height={300}
        />
        <LineChart
          data={chartData}
          series={profitChartSeries}
          xAxisDataKey="month"
          chartTitle="Profitability Metrics"
          height={300}
        />
      </div>

      {/* Download Report Button */}
      <Card>
        <CardContent className="pt-6">
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download P&L Report (PDF)
          </Button>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profit & Loss Statement</CardTitle>
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
                <TableHead className="w-[200px]">P&L Item</TableHead>
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

export default ProfitLoss;
