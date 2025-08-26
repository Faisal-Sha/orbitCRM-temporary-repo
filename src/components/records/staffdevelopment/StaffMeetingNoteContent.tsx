import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  MessageSquare, 
  FileText, 
  RefreshCw, 
  Trash2, 
  ThumbsUp, 
  ThumbsDown,
  Star,
  Save,
  Search,
  Plus
} from "lucide-react";

interface StaffMeetingNoteContentProps {
  note: {
    content: {
      sessionSummary: string;
      goalsAlignment: string;
      developmentPlan: string;
    };
  };
}

const StaffMeetingNoteContent = ({ note }: StaffMeetingNoteContentProps) => {
  const [activeSection, setActiveSection] = useState("session-summary");
  
  const [noteContent, setNoteContent] = useState({
    sessionSummary: note.content.sessionSummary || "Staff member demonstrated improved engagement with clients and showed better understanding of documentation requirements. Discussion focused on recent cases and areas for continued growth.",
    goalsAlignment: note.content.goalsAlignment || "Current progress aligns well with quarterly development goals. Staff member is on track with clinical competencies and showing improvement in time management skills.",
    developmentPlan: note.content.developmentPlan || "Continue with current mentoring approach. Recommend additional training in trauma-informed care and consider peer mentoring opportunities.",
    aiSuggestedSteps: "1. Schedule follow-up training session on documentation best practices\n2. Pair with senior staff member for shadowing opportunity\n3. Review case load to ensure manageable workload\n4. Set up peer feedback session",
    aiSuggestedQuestions: "1. How do you feel about your current case load?\n2. What additional support would be most helpful?\n3. Are there specific areas where you'd like more training?\n4. How can we improve team collaboration?",
    competencyProgress: "Communication: Excellent (5/5)\nTechnical Skills: Good (4/5)\nLeadership: Developing (3/5)\nTime Management: Needs Improvement (2/5)",
    managerRecommendations: "Staff member should attend the upcoming trauma-informed care workshop. Consider enrollment in leadership development program for future growth opportunities.",
    staffFeedback: "Staff member expressed interest in additional training opportunities and appreciates the regular feedback sessions. Feels confident in clinical skills but wants to improve administrative efficiency."
  });

  const [competencyRatings, setCompetencyRatings] = useState({
    communication: 5,
    technical: 4,
    leadership: 3,
    timeManagement: 2
  });

  const [resources, setResources] = useState([
    { id: 1, name: "Trauma-Informed Care Workshop", type: "Training", rating: 5, status: "Completed" },
    { id: 2, name: "Documentation Best Practices Guide", type: "Article", rating: 4, status: "In Progress" },
    { id: 3, name: "Leadership Development Program", type: "Course", rating: 0, status: "Recommended" }
  ]);

  const handleContentChange = (section: string, value: string) => {
    setNoteContent(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const handleGenerateNote = () => {
    console.log("Generating AI note...");
    // Simulate AI generation
  };

  const handleGenerateWithComments = () => {
    console.log("Generating AI note with personal comments...");
    // Simulate AI generation with personal input
  };

  const handleGenerateFromTemplate = () => {
    console.log("Generating AI note from template...");
    // Simulate template selection
  };

  const handleRefineNote = () => {
    console.log("Refining note with AI...");
    // Simulate AI refinement
  };

  const handleClearNote = () => {
    setNoteContent({
      sessionSummary: "",
      goalsAlignment: "",
      developmentPlan: "",
      aiSuggestedSteps: "",
      aiSuggestedQuestions: "",
      competencyProgress: "",
      managerRecommendations: "",
      staffFeedback: ""
    });
  };

  const renderStars = (rating: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 cursor-pointer ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* AI Note Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Note Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleGenerateNote} className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate a note
            </Button>
            <Button variant="outline" onClick={handleGenerateWithComments} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              With personal comments
            </Button>
            <Button variant="outline" onClick={handleGenerateFromTemplate} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              From a template
            </Button>
            <Button variant="outline" onClick={handleRefineNote} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refine note
            </Button>
            <Button variant="outline" onClick={handleClearNote} className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Clear note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Note Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Session Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Session Summary</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={noteContent.sessionSummary}
              onChange={(e) => handleContentChange("sessionSummary", e.target.value)}
              className="min-h-[120px]"
              placeholder="Enter session summary..."
            />
          </CardContent>
        </Card>

        {/* Goals Alignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Goals Alignment</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={noteContent.goalsAlignment}
              onChange={(e) => handleContentChange("goalsAlignment", e.target.value)}
              className="min-h-[120px]"
              placeholder="Enter goals alignment..."
            />
          </CardContent>
        </Card>

        {/* Development Plan Alignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Development Plan Alignment</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={noteContent.developmentPlan}
              onChange={(e) => handleContentChange("developmentPlan", e.target.value)}
              className="min-h-[120px]"
              placeholder="Enter development plan alignment..."
            />
          </CardContent>
        </Card>

        {/* AI Suggested Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>AI Suggested Next Steps</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={noteContent.aiSuggestedSteps}
              onChange={(e) => handleContentChange("aiSuggestedSteps", e.target.value)}
              className="min-h-[120px]"
              placeholder="AI will suggest next steps..."
            />
          </CardContent>
        </Card>

        {/* AI Suggested Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>AI Suggested Questions for Next Meeting</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={noteContent.aiSuggestedQuestions}
              onChange={(e) => handleContentChange("aiSuggestedQuestions", e.target.value)}
              className="min-h-[120px]"
              placeholder="AI will suggest questions..."
            />
          </CardContent>
        </Card>

        {/* Competency Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Competency Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Communication</span>
                {renderStars(competencyRatings.communication, (rating) => 
                  setCompetencyRatings(prev => ({...prev, communication: rating}))
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Technical Skills</span>
                {renderStars(competencyRatings.technical, (rating) => 
                  setCompetencyRatings(prev => ({...prev, technical: rating}))
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Leadership</span>
                {renderStars(competencyRatings.leadership, (rating) => 
                  setCompetencyRatings(prev => ({...prev, leadership: rating}))
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Time Management</span>
                {renderStars(competencyRatings.timeManagement, (rating) => 
                  setCompetencyRatings(prev => ({...prev, timeManagement: rating}))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resources</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Search className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{resource.name}</p>
                    <p className="text-xs text-muted-foreground">{resource.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{resource.status}</Badge>
                    {resource.rating > 0 && renderStars(resource.rating, () => {})}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manager Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Manager Recommendations</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={noteContent.managerRecommendations}
            onChange={(e) => handleContentChange("managerRecommendations", e.target.value)}
            className="min-h-[100px]"
            placeholder="Enter manager recommendations..."
          />
        </CardContent>
      </Card>

      {/* Staff Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Staff Feedback</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={noteContent.staffFeedback}
            onChange={(e) => handleContentChange("staffFeedback", e.target.value)}
            className="min-h-[100px]"
            placeholder="Enter staff feedback..."
          />
        </CardContent>
      </Card>

      {/* Save Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Save as Template
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save & Sign
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffMeetingNoteContent;
