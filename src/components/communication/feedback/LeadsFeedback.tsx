import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Archive, Save, RotateCcw } from "lucide-react";

// Dummy data for leads feedback entries
const generateLeadsFeedbackData = () => {
  const feedbackEntries = [
    "No comments, happy with the process",
    "Application was smooth and straightforward",
    "Took too long to complete verification",
    "Great experience overall, very professional",
    "Some confusion during the eligibility check",
    "Documentation requirements were clear",
    "Scheduling was convenient and flexible",
    "Communication was excellent throughout",
    "Process could be more streamlined",
    "Support team was very helpful",
    "Instructions were easy to follow",
    "Timeline exceeded expectations",
    "Very satisfied with the service",
    "Minor delays but overall positive",
    "System was user-friendly",
    "Quick response to my questions",
    "Paperwork was manageable",
    "Staff was knowledgeable and kind",
    "Would recommend to others",
    "Efficient and professional process",
    "Clear communication at every step",
    "Appointment scheduling was easy",
    "Requirements were well explained",
    "Smooth transition between stages",
    "Excellent customer service experience"
  ];

  return {
    new: feedbackEntries.slice(0, 23).map((text, i) => ({ id: i + 1, text, date: new Date(2024, 0, i + 1).toLocaleDateString() })),
    saved: feedbackEntries.slice(5, 27).map((text, i) => ({ id: i + 1, text, date: new Date(2024, 1, i + 1).toLocaleDateString() })),
    archived: feedbackEntries.slice(10, 32).map((text, i) => ({ id: i + 1, text, date: new Date(2024, 2, i + 1).toLocaleDateString() }))
  };
};

const LeadsFeedback = () => {
  const [feedbackData, setFeedbackData] = useState(generateLeadsFeedbackData());
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

      // Remove from current tab
      newData[fromTab as keyof typeof newData] = newData[fromTab as keyof typeof newData].filter(item => item.id !== id);

      // Add to target tab
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

  // Application Process Feedback data (extracted from FeedbackTab)
  const applicationProcessFeedback = [
    { rating: "Excellent", count: 45, percentage: 60 },
    { rating: "Good", count: 20, percentage: 27 },
    { rating: "Average", count: 7, percentage: 9 },
    { rating: "Poor", count: 3, percentage: 4 }
  ];

  return (
    <div className="app-card">
      <div className="space-y-6">
        {/* Existing Application Process Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Application Process Feedback
              {renderTooltipIcon("Feedback collected from leads about their application experience")}
            </CardTitle>
            <CardDescription>How happy were leads with the application process?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicationProcessFeedback.map((item, index) => (
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

        {/* New Feedback Received from Leads Section */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Received from Leads</CardTitle>
            <CardDescription>Manage and categorize feedback from leads</CardDescription>
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

export default LeadsFeedback;
