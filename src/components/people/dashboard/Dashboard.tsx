
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Users, BarChart3 } from "lucide-react";
import CompanionedAIChat from "@/components/CompanionedAIChat";
import { generateDashboardData } from "./data";
import DashboardWidgets from "./DashboardWidgets";
import GeneralTab from "./GeneralTab";
import PerformanceTab from "./PerformanceTab";

const Dashboard = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [peopleType, setPeopleType] = useState("leads");
  const [dateRange, setDateRange] = useState("last30days");

  const currentData = generateDashboardData(peopleType, dateRange);

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "general":
        return <BarChart3 className="h-4 w-4" />;
      case "performance":
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">People Overview Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your people data</p>
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
            <CardDescription>Get insights about your people data</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <CompanionedAIChat />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={peopleType} onValueChange={setPeopleType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select people type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leads">Leads</SelectItem>
            <SelectItem value="clients">Clients</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last7days">Last 7 Days</SelectItem>
            <SelectItem value="last30days">Last 30 Days</SelectItem>
            <SelectItem value="last3months">Last 3 Months</SelectItem>
            <SelectItem value="last6months">Last 6 Months</SelectItem>
            <SelectItem value="lastyear">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Widgets */}
      <DashboardWidgets peopleType={peopleType} currentData={currentData} />

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            {getTabIcon("general")}
            General
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            {getTabIcon("performance")}
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab peopleType={peopleType} currentData={currentData} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceTab peopleType={peopleType} currentData={currentData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
