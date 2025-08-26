
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Mail, Smartphone, Mic, Target, Users } from "lucide-react";
import CompanionedAIChat from "@/components/CompanionedAIChat";
import LeadCampaignsTab from "./LeadCampaignsTab";
import EmailCampaignsTab from "./EmailCampaignsTab";
import SMSCampaignsTab from "./SMSCampaignsTab";
import AIVoiceCampaignsTab from "./AIVoiceCampaignsTab";
import AdCampaignsTab from "./AdCampaignsTab";

const Dashboard = () => {
  const [showAIChat, setShowAIChat] = useState(false);

  // Dummy data for widgets
  const dashboardData = {
    leadCampaigns: 24,
    emailCampaigns: 18,
    smsCampaigns: 12,
    aiVoiceCampaigns: 8,
    adCampaigns: 15
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "leads":
        return <Users className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <Smartphone className="h-4 w-4" />;
      case "voice":
        return <Mic className="h-4 w-4" />;
      case "ads":
        return <Target className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketing Dashboard</h1>
          <p className="text-muted-foreground">AI-powered insights for your marketing campaigns</p>
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
            <CardDescription>Get insights about your marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <CompanionedAIChat />
          </CardContent>
        </Card>
      )}

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Campaigns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.leadCampaigns}</div>
            <p className="text-xs text-muted-foreground">Active campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.emailCampaigns}</div>
            <p className="text-xs text-muted-foreground">Active campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Campaigns</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.smsCampaigns}</div>
            <p className="text-xs text-muted-foreground">Active campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Voice Campaigns</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.aiVoiceCampaigns}</div>
            <p className="text-xs text-muted-foreground">Active campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ad Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.adCampaigns}</div>
            <p className="text-xs text-muted-foreground">Active campaigns</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            {getTabIcon("leads")}
            Lead Campaigns
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            {getTabIcon("email")}
            Email Campaigns
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            {getTabIcon("sms")}
            SMS Campaigns
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            {getTabIcon("voice")}
            AI Voice Campaigns
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center gap-2">
            {getTabIcon("ads")}
            Ad Campaigns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <LeadCampaignsTab />
        </TabsContent>

        <TabsContent value="email">
          <EmailCampaignsTab />
        </TabsContent>

        <TabsContent value="sms">
          <SMSCampaignsTab />
        </TabsContent>

        <TabsContent value="voice">
          <AIVoiceCampaignsTab />
        </TabsContent>

        <TabsContent value="ads">
          <AdCampaignsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
