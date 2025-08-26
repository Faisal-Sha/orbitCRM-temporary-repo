import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, RefreshCw, Edit, Star, Plus, ThumbsUp, ThumbsDown, FileText, Trash2 } from "lucide-react";

interface ProgressNoteContentProps {
  note: {
    content: {
      sessionSummary: string;
      goalsAlignment: string;
      treatmentPlan: string;
    };
  };
}

const ProgressNoteContent = ({ note }: ProgressNoteContentProps) => {
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [showTemplateSelect, setShowTemplateSelect] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [personalComments, setPersonalComments] = useState("");
  const [generatedNote, setGeneratedNote] = useState(true); // Show content since this is viewing an existing note

  const templates = [
    "Individual Therapy Session",
    "Group Therapy Session", 
    "Family Session",
    "Mentoring Session",
    "Crisis Intervention"
  ];

  const handleGenerateNote = (type: string) => {
    console.log(`Generating ${type} note`);
    setGeneratedNote(true);
    setShowNotesInput(false);
    setShowTemplateSelect(false);
  };

  const renderStars = (rating: number, onChange?: (rating: number) => void) => {
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
            onClick={() => onChange && onChange(star)}
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
            <Brain className="h-5 w-5 text-purple-500" />
            AI Note Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button 
              onClick={() => handleGenerateNote("initial")} 
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              Generate Note
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowNotesInput(!showNotesInput)}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              With Personal Comments
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowTemplateSelect(!showTemplateSelect)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              From Template
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleGenerateNote("refine")}
              disabled={!generatedNote}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refine Note
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={() => setGeneratedNote(false)}
              disabled={!generatedNote}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Note
            </Button>
          </div>

          {/* Personal Comments Input */}
          {showNotesInput && (
            <div className="mb-4 p-4 border rounded-lg bg-gray-50">
              <label className="block text-sm font-medium mb-2">Personal Comments:</label>
              <Textarea
                placeholder="Enter any specific notes, observations, or focus areas..."
                value={personalComments}
                onChange={(e) => setPersonalComments(e.target.value)}
                className="mb-3"
              />
              <Button onClick={() => handleGenerateNote("comments")} size="sm">
                Generate Note with Comments
              </Button>
            </div>
          )}

          {/* Template Selection */}
          {showTemplateSelect && (
            <div className="mb-4 p-4 border rounded-lg bg-gray-50">
              <label className="block text-sm font-medium mb-2">Select Template:</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="mb-3">
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template} value={template}>
                      {template}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={() => handleGenerateNote("template")} 
                size="sm"
                disabled={!selectedTemplate}
              >
                Generate from Template
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Note Sections */}
      {generatedNote && (
        <div className="space-y-6">
          
          {/* Session Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Session Summary</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea 
                defaultValue={note.content.sessionSummary}
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-muted-foreground">Was this section helpful?</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals Alignment */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Goals Alignment</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea 
                defaultValue={note.content.goalsAlignment}
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-muted-foreground">Was this section helpful?</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Plan Alignment */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Treatment Plan Alignment</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea 
                defaultValue={note.content.treatmentPlan}
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-muted-foreground">Was this section helpful?</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggested Next Steps */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Suggested Next Steps</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea 
                defaultValue="1. Continue with cognitive behavioral therapy techniques focusing on anxiety management
2. Assign homework: daily mindfulness practice for 10 minutes
3. Schedule follow-up session in 1 week to review progress
4. Consider referral to psychiatrist if symptoms persist"
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-muted-foreground">Was this section helpful?</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggested Questions for Next Session */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Suggested Questions for Next Session</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea 
                defaultValue="1. How did the mindfulness exercises work for you this week?
2. What situations triggered your anxiety the most?
3. Which coping strategies felt most helpful?
4. How has your sleep pattern been since our last session?
5. What would you like to focus on in today's session?"
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-muted-foreground">Was this section helpful?</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Goals Progress</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Goal 1: Anxiety Management</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">Progress:</span>
                      <Badge variant="secondary">75% Complete</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Significant improvement in daily anxiety levels</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Goal 2: Social Engagement</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">Progress:</span>
                      <Badge variant="secondary">50% Complete</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Making progress with social activities</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Goal 3: Sleep Hygiene</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">Progress:</span>
                      <Badge variant="secondary">90% Complete</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Excellent adherence to sleep routine</p>
                  </div>
                </div>
                <Textarea 
                  defaultValue="Client has made excellent progress on sleep hygiene goals and is maintaining consistent bedtime routine. Anxiety management shows significant improvement with 75% reduction in panic episodes. Social engagement remains challenging but client is motivated to continue working on this area."
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-muted-foreground">Was this section helpful?</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mental Health Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mental Health Progress</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Anxiety Level</label>
                    <div className="flex items-center gap-2">
                      {renderStars(3)}
                      <span className="text-sm text-muted-foreground">(3/5)</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Depression Level</label>
                    <div className="flex items-center gap-2">
                      {renderStars(2)}
                      <span className="text-sm text-muted-foreground">(2/5)</span>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">Overall Wellbeing</label>
                    <div className="flex items-center gap-2">
                      {renderStars(4)}
                      <span className="text-sm text-muted-foreground">(4/5)</span>
                    </div>
                  </div>
                </div>
                <Textarea 
                  defaultValue="Client reports moderate anxiety levels (3/5) with noticeable improvement from previous sessions. Depression symptoms are mild (2/5) and client feels more hopeful about the future. Overall wellbeing has improved significantly (4/5) with better sleep, appetite, and energy levels."
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-muted-foreground">Was this section helpful?</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recommendations</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Recommendation Entries */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Mindfulness Meditation App</h4>
                      <div className="flex items-center gap-2">
                        {renderStars(5)}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Recommended Headspace app for daily anxiety management practice</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Local Support Group</h4>
                      <div className="flex items-center gap-2">
                        {renderStars(4)}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Anxiety support group meets Tuesdays at Community Center</p>
                  </div>
                </div>
                
                {/* Add New Recommendation */}
                <div className="p-3 border-2 border-dashed rounded-lg">
                  <div className="space-y-3">
                    <Input placeholder="Recommendation title..." />
                    <Textarea placeholder="Description and details..." className="min-h-[60px]" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Rating:</span>
                        {renderStars(0)}
                      </div>
                      <Button size="sm">Add Recommendation</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Referrals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Client Referrals</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Existing Referrals */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground">Name</label>
                        <p className="font-medium">Dr. James Wilson</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground">Relationship</label>
                        <p>Psychiatrist</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground">Email</label>
                        <p>j.wilson@mentalhealth.com</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground">Phone</label>
                        <p>(555) 123-4567</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-muted-foreground">Note</label>
                      <p className="text-sm">Medication evaluation scheduled for next week</p>
                    </div>
                  </div>
                </div>
                
                {/* Add New Referral */}
                <div className="p-3 border-2 border-dashed rounded-lg">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input placeholder="Full name..." />
                      <Input placeholder="Email address..." />
                      <Input placeholder="Phone number..." />
                      <Input placeholder="Relationship..." />
                    </div>
                    <Textarea placeholder="Notes about referral..." className="min-h-[60px]" />
                    <Button size="sm">Add Referral</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save as Template */}
          <Card>
            <CardHeader>
              <CardTitle>Save as Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Input placeholder="Template name..." className="flex-1" />
                <Button className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Save Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProgressNoteContent;
