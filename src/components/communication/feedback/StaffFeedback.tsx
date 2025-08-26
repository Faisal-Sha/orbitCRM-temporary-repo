import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Archive, Save, RotateCcw } from "lucide-react";

// Dummy data for staff feedback entries
const generateStaffFeedbackData = () => {
  const feedbackEntries = [
    "No comments, happy with the company",
    "Great team collaboration and support",
    "Suggestions for program improvements needed",
    "Excellent work-life balance provided",
    "Management is supportive and understanding",
    "Could use better training resources",
    "Positive work environment overall",
    "Clear communication from leadership",
    "Appreciate the professional development opportunities",
    "Good benefits package and compensation",
    "Team meetings are productive and valuable",
    "Office facilities are well-maintained",
    "Flexible working arrangements are helpful",
    "Recognition programs motivate the team",
    "Process improvements would increase efficiency",
    "Strong sense of purpose in our work",
    "Colleagues are professional and helpful",
    "Regular feedback helps with growth",
    "Technology tools support our productivity",
    "Company culture aligns with my values",
    "Career advancement opportunities are available",
    "Workload is manageable and fair",
    "Leadership is transparent and honest",
    "Training sessions are relevant and useful",
    "Happy to be part of this organization"
  ];

  return {
    new: feedbackEntries.slice(0, 23).map((text, i) => ({ id: i + 1, text, date: new Date(2024, 0, i + 1).toLocaleDateString() })),
    saved: feedbackEntries.slice(5, 27).map((text, i) => ({ id: i + 1, text, date: new Date(2024, 1, i + 1).toLocaleDateString() })),
    archived: feedbackEntries.slice(10, 32).map((text, i) => ({ id: i + 1, text, date: new Date(2024, 2, i + 1).toLocaleDateString() }))
  };
};

const StaffFeedback = () => {
  const [feedbackData, setFeedbackData] = useState(generateStaffFeedbackData());
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

  // Extracted staff feedback data from FeedbackTab
  const programSatisfaction = [
    { rating: "Excellent", count: 35, percentage: 58 },
    { rating: "Good", count: 15, percentage: 25 },
    { rating: "Average", count: 8, percentage: 13 },
    { rating: "Poor", count: 2, percentage: 4 }
  ];

  const likelihood = [
    { rating: "Very Likely", count: 28, percentage: 47 },
    { rating: "Likely", count: 18, percentage: 30 },
    { rating: "Neutral", count: 10, percentage: 17 },
    { rating: "Unlikely", count: 4, percentage: 6 }
  ];

  return (
    <div className="app-card">
      <div className="space-y-6">
        {/* Existing Program Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Program Satisfaction
              {renderTooltipIcon("Staff satisfaction with current programs and initiatives")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {programSatisfaction.map((item, index) => (
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

        {/* Existing Likelihood to Recommend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Likelihood to Recommend
              {renderTooltipIcon("How likely staff are to recommend working here to others")}
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

        {/* New Feedback Received from Staff Section */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Received from Staff</CardTitle>
            <CardDescription>Manage and categorize feedback from staff members</CardDescription>
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

export default StaffFeedback;
