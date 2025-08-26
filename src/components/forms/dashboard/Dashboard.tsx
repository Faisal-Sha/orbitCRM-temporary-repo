
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MessageCircle, FileText, Send, BarChart3, PieChart } from "lucide-react";
import CompanionedAIChat from "@/components/CompanionedAIChat";
import { generateFormsDashboardData } from "./data";
import FormsWidgets from "./FormsWidgets";
import FormsOverviewSection from "./FormsOverviewSection";
import SubmissionInsightsSection from "./SubmissionInsightsSection";

const Dashboard = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [dateRange, setDateRange] = useState("all-time");
  const [formSearchFilter, setFormSearchFilter] = useState("");

  const currentData = generateFormsDashboardData(dateRange);

  const clearAllFilters = () => {
    setFormSearchFilter("");
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Forms Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive overview of your forms and submissions</p>
        </div>
        <Button 
          onClick={() => setShowAIChat(!showAIChat)}
          className={`flex items-center gap-2 ${
            showAIChat 
              ? "bg-white text-primary border border-primary hover:bg-gray-50" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          {showAIChat ? "Close Chat" : "CompanionedAI"}
        </Button>
      </div>

      {/* AI Chat Section */}
      {showAIChat && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              AI Assistant
            </CardTitle>
            <CardDescription>Get insights and analytics about your forms and submissions</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <CompanionedAIChat />
          </CardContent>
        </Card>
      )}

      {/* Global Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Date Range:</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Form Search:</label>
              <Input
                placeholder="Search forms..."
                value={formSearchFilter}
                onChange={(e) => setFormSearchFilter(e.target.value)}
                className="w-[200px]"
              />
            </div>

            <Button onClick={clearAllFilters} variant="outline" size="sm">
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Core Metrics Widgets */}
      <FormsWidgets currentData={currentData} />

      {/* Forms Overview Section */}
      <FormsOverviewSection 
        currentData={currentData} 
        formSearchFilter={formSearchFilter}
      />

      {/* Submission Insights Section */}
      <SubmissionInsightsSection 
        currentData={currentData} 
        formSearchFilter={formSearchFilter}
      />
    </div>
  );
};

export default Dashboard;
