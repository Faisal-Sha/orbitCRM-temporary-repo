
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Archive, Save, RotateCcw } from "lucide-react";
import BarChart from "@/components/charts/BarChart";

// Dummy data for clients feedback entries
const generateClientsFeedbackData = () => {
  const feedbackEntries = [
    "No comments, happy with the service",
    "Excellent support experience throughout",
    "Suggestions for improvement in communication",
    "Very professional and caring staff",
    "Service quality exceeded expectations",
    "Would benefit from more frequent check-ins",
    "Outstanding customer service",
    "Process was clear and well-organized",
    "Staff showed genuine concern for my needs",
    "Appreciate the personalized approach",
    "Quick response times to my questions",
    "Felt heard and understood",
    "Great progress made with my goals",
    "Flexible scheduling was very helpful",
    "High quality of care provided",
    "Could use better coordination between services",
    "Very satisfied with the outcomes",
    "Professional and compassionate team",
    "Services met all my expectations",
    "Smooth experience from start to finish",
    "Excellent value for the services received",
    "Staff was knowledgeable and supportive",
    "Would definitely recommend to others",
    "Positive impact on my overall well-being",
    "Thorough and comprehensive care approach"
  ];

  return {
    new: feedbackEntries.slice(0, 24).map((text, i) => ({ id: i + 1, text, date: new Date(2024, 0, i + 1).toLocaleDateString() })),
    saved: feedbackEntries.slice(5, 28).map((text, i) => ({ id: i + 1, text, date: new Date(2024, 1, i + 1).toLocaleDateString() })),
    archived: feedbackEntries.slice(10, 33).map((text, i) => ({ id: i + 1, text, date: new Date(2024, 2, i + 1).toLocaleDateString() }))
  };
};

const ClientFeedback = () => {
  const [feedbackData, setFeedbackData] = useState(generateClientsFeedbackData());
  const [currentPage, setCurrentPage] = useState({ new: 1, saved: 1, archived: 1 });
  const itemsPerPage = 20;

  const renderTooltipIcon = (tooltip: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="h-4 w-4 text-muted-foreground ml-2" />
        </TooltipTrigger>
        <TooltipContent className="bg-white text-black border border-gray-200">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const handleAction = (id: number, fromTab: string, action: 'save' | 'archive' | 'restore') => {
    setFeedbackData(prev => {
      const newData = { ...prev };
      const item = newData[fromTab as keyof typeof newData].find(item => item.id === id);
      if (!item) return prev;

      newData[fromTab as keyof typeof newData] = newData[fromTab as keyof typeof newData].filter(item => item.id !== id);

      if (action === 'save') {
        newData.saved.unshift(item);
      } else if (action === 'archive') {
        newData.archived.unshift(item);
      } else if (action === 'restore') {
        newData.new.unshift(item);
      }

      return newData;
    });
  };

  const renderPagination = (tab: string, totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPageNum = currentPage[tab as keyof typeof currentPage];

    return (
      <div className="flex justify-center gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm"
          disabled={currentPageNum === 1}
          onClick={() => setCurrentPage(prev => ({ ...prev, [tab]: prev[tab as keyof typeof prev] - 1 }))}
        >
          Previous
        </Button>
        <span className="flex items-center px-3 text-sm">
          Page {currentPageNum} of {totalPages}
        </span>
        <Button 
          variant="outline" 
          size="sm"
          disabled={currentPageNum === totalPages}
          onClick={() => setCurrentPage(prev => ({ ...prev, [tab]: prev[tab as keyof typeof prev] + 1 }))}
        >
          Next
        </Button>
      </div>
    );
  };

  const renderFeedbackList = (tab: string, items: any[]) => {
    const startIndex = (currentPage[tab as keyof typeof currentPage] - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="space-y-3">
        {paginatedItems.map((item) => (
          <div key={item.id} className="flex justify-between items-start p-3 border rounded-lg">
            <div className="flex-1">
              <p className="text-sm">{item.text}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
            </div>
            <div className="flex gap-2 ml-4">
              {tab === 'new' && (
                <>
                  <Button size="sm" variant="outline" onClick={() => handleAction(item.id, tab, 'save')}>
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAction(item.id, tab, 'archive')}>
                    <Archive className="h-3 w-3 mr-1" />
                    Archive
                  </Button>
                </>
              )}
              {tab === 'saved' && (
                <Button size="sm" variant="outline" onClick={() => handleAction(item.id, tab, 'archive')}>
                  <Archive className="h-3 w-3 mr-1" />
                  Archive
                </Button>
              )}
              {tab === 'archived' && (
                <Button size="sm" variant="outline" onClick={() => handleAction(item.id, tab, 'restore')}>
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Restore
                </Button>
              )}
            </div>
          </div>
        ))}
        {renderPagination(tab, items.length)}
      </div>
    );
  };

  // Extracted client feedback data from FeedbackTab
  const serviceSatisfaction = [
    { rating: "Excellent", count: 85, percentage: 68 },
    { rating: "Good", count: 25, percentage: 20 },
    { rating: "Average", count: 10, percentage: 8 },
    { rating: "Poor", count: 5, percentage: 4 }
  ];

  const connectionFrequency = [
    { frequency: "Weekly", count: 45 },
    { frequency: "Bi-weekly", count: 30 },
    { frequency: "Monthly", count: 35 },
    { frequency: "As needed", count: 20 }
  ];

  const supportMethod = [
    { method: "Phone", count: 40 },
    { method: "Email", count: 25 },
    { method: "Video call", count: 35 },
    { method: "In-person", count: 30 }
  ];

  const likelihood = [
    { rating: "Very Likely", count: 60, percentage: 48 },
    { rating: "Likely", count: 35, percentage: 28 },
    { rating: "Neutral", count: 20, percentage: 16 },
    { rating: "Unlikely", count: 10, percentage: 8 }
  ];

  const anotherSession = [
    { response: "Definitely Yes", count: 70, percentage: 56 },
    { response: "Probably Yes", count: 30, percentage: 24 },
    { response: "Maybe", count: 15, percentage: 12 },
    { response: "Probably No", count: 10, percentage: 8 }
  ];

  return (
    <div className="app-card">
      <div className="space-y-6">
        {/* Service Satisfaction and Connection Frequency in 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Service Satisfaction
                {renderTooltipIcon("Overall satisfaction with the services provided to clients")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceSatisfaction.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.rating}</span>
                      <span className="text-muted-foreground">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className="w-[150px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Connection Frequency
                {renderTooltipIcon("How often clients prefer to connect with their providers")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={connectionFrequency}
                series={[{ dataKey: "count", name: "Count", color: "#3b82f6", enabled: true }]}
                xAxisDataKey="frequency"
                height={200}
                showSeriesToggle={false}
              />
            </CardContent>
          </Card>
        </div>

        {/* Remaining charts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Preferred Support Method
              {renderTooltipIcon("Communication methods clients prefer for receiving support")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={supportMethod}
              series={[{ dataKey: "count", name: "Count", color: "#22c55e", enabled: true }]}
              xAxisDataKey="method"
              height={250}
              showSeriesToggle={false}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Likelihood to Recommend
              {renderTooltipIcon("How likely clients are to recommend our services to others")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {likelihood.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.rating}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <Progress value={item.percentage} className="w-[200px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Another Session with Provider
              {renderTooltipIcon("Whether clients would book another session with their current provider")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anotherSession.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.response}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <Progress value={item.percentage} className="w-[200px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* New Feedback Received from Clients Section */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Received from Clients</CardTitle>
            <CardDescription>Manage and categorize feedback from clients</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="new" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="new">New ({feedbackData.new.length})</TabsTrigger>
                <TabsTrigger value="saved">Saved ({feedbackData.saved.length})</TabsTrigger>
                <TabsTrigger value="archived">Archived ({feedbackData.archived.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="new" className="mt-4">
                {renderFeedbackList('new', feedbackData.new)}
              </TabsContent>
              
              <TabsContent value="saved" className="mt-4">
                {renderFeedbackList('saved', feedbackData.saved)}
              </TabsContent>
              
              <TabsContent value="archived" className="mt-4">
                {renderFeedbackList('archived', feedbackData.archived)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientFeedback;
