
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Brain, Lightbulb, Target, Users, MessageSquare, FileText, Sparkles, ThumbsUp, ThumbsDown, Edit, RefreshCw, Trash2, Plus } from "lucide-react";

const ActionPlanTab = () => {
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [showTemplateSelect, setShowTemplateSelect] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [planNotes, setPlanNotes] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState(false);

  const templates = [
    "First-time client assessment",
    "Career transition support", 
    "Financial planning focus",
    "Mental health priority",
    "Goal-setting intensive"
  ];

  const handleGeneratePlan = (type: string) => {
    console.log(`Generating ${type} plan`);
    setGeneratedPlan(true);
    setShowNotesInput(false);
    setShowTemplateSelect(false);
  };

  const handleClearPlan = () => {
    setGeneratedPlan(false);
    setPlanNotes("");
    setSelectedTemplate("");
  };

  return (
    <div className="app-card">
      <div className="space-y-6">
        
        {/* Client Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Client Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong>Client Profile:</strong> Highly motivated individual currently seeking career advancement with financial goals. 
                Shows strong engagement in therapy sessions and demonstrates commitment to personal growth. Primary focus areas 
                include job search support, financial planning, and maintaining mental wellness during transition periods. 
                Client has shown 75% progress toward employment goals and maintains regular session attendance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Potential Challenges & Experience Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Working Experience & Predictable Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Communication Style */}
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Communication Style
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Direct and goal-oriented communication preferred
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Responds well to structured feedback
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Appreciates practical, actionable advice
                  </li>
                </ul>
              </div>

              {/* Potential Challenges */}
              <div>
                <h4 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Potential Challenges
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    May experience anxiety during job interviews
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    Financial stress could impact session focus
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    Unrealistic timeline expectations need management
                  </li>
                </ul>
              </div>

              {/* Experience Indicators */}
              <div>
                <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Working Experience
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    High engagement and motivation level
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Consistent session attendance (95%)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Follows through on homework assignments
                  </li>
                </ul>
              </div>

              {/* Performance Stats */}
              <div>
                <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Performance Indicators
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Goal Completion Rate</span>
                    <Badge variant="secondary">75%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Session Engagement</span>
                    <Badge variant="secondary">High</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Progress Velocity</span>
                    <Badge variant="secondary">Above Average</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Plan Generation Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Plan Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 mb-4">
              <Button 
                onClick={() => handleGeneratePlan("initial")} 
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                Generate Initial Plan
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowNotesInput(!showNotesInput)}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Initial Plan with Notes
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
                onClick={() => handleGeneratePlan("refine")}
                disabled={!generatedPlan}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refine Plan
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={handleClearPlan}
                disabled={!generatedPlan}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Plan
              </Button>
            </div>

            {/* Notes Input */}
            {showNotesInput && (
              <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                <label className="block text-sm font-medium mb-2">Additional Notes for Plan Generation:</label>
                <Textarea
                  placeholder="Enter any specific notes, concerns, or focus areas for the action plan..."
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  className="mb-3"
                />
                <Button onClick={() => handleGeneratePlan("notes")} size="sm">
                  Generate Plan with Notes
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
                  onClick={() => handleGeneratePlan("template")} 
                  size="sm"
                  disabled={!selectedTemplate}
                >
                  Generate from Template
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generated Action Plan Sections */}
        {generatedPlan && (
          <div className="space-y-6">
            
            {/* Session Plans */}
            {[1, 2, 3].map((sessionNum) => (
              <Card key={sessionNum}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-500" />
                      Session {sessionNum} Action Plan
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    
                    {/* Communication Approach */}
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Communication Approach
                      </h4>
                      <div className="bg-green-50 p-3 rounded-lg text-sm">
                        {sessionNum === 1 && "Start with warm welcome and goal review. Use direct, encouraging language. Focus on building rapport while establishing clear session objectives."}
                        {sessionNum === 2 && "Begin with progress check-in. Maintain supportive but results-oriented tone. Address any concerns from previous session."}
                        {sessionNum === 3 && "Open with accomplishment recognition. Use motivational language to maintain momentum. Prepare for potential mid-point challenges."}
                      </div>
                    </div>

                    {/* What to Say */}
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">Key Talking Points</h4>
                      <ul className="text-sm space-y-1 ml-4">
                        {sessionNum === 1 && (
                          <>
                            <li>• "Let's focus on your immediate job search priorities"</li>
                            <li>• "What specific support do you need this week?"</li>
                            <li>• "Your progress on financial goals shows great discipline"</li>
                          </>
                        )}
                        {sessionNum === 2 && (
                          <>
                            <li>• "How did the networking strategies work for you?"</li>
                            <li>• "Let's refine your interview preparation approach"</li>
                            <li>• "Your consistency is really paying off"</li>
                          </>
                        )}
                        {sessionNum === 3 && (
                          <>
                            <li>• "You've made significant progress in key areas"</li>
                            <li>• "Let's address any obstacles you're facing"</li>
                            <li>• "What adjustments can we make to accelerate progress?"</li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* What to Avoid */}
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Avoid Saying</h4>
                      <ul className="text-sm space-y-1 ml-4 text-red-600">
                        <li>• Avoid rushing timeline discussions</li>
                        <li>• Don't minimize financial stress concerns</li>
                        <li>• Avoid overwhelming with too many new strategies</li>
                      </ul>
                    </div>

                    {/* Resources to Suggest */}
                    <div>
                      <h4 className="font-semibold text-purple-700 mb-2">Recommended Resources</h4>
                      <div className="flex flex-wrap gap-2">
                        {sessionNum === 1 && (
                          <>
                            <Badge variant="outline">Job Search Checklist</Badge>
                            <Badge variant="outline">Interview Prep Guide</Badge>
                            <Badge variant="outline">LinkedIn Optimization</Badge>
                          </>
                        )}
                        {sessionNum === 2 && (
                          <>
                            <Badge variant="outline">Networking Templates</Badge>
                            <Badge variant="outline">Salary Negotiation Tips</Badge>
                            <Badge variant="outline">Stress Management Tools</Badge>
                          </>
                        )}
                        {sessionNum === 3 && (
                          <>
                            <Badge variant="outline">Financial Planning App</Badge>
                            <Badge variant="outline">Career Development Plan</Badge>
                            <Badge variant="outline">Motivation Maintenance</Badge>
                          </>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* AI Feedback */}
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm text-muted-foreground">Was this session plan helpful?</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          Yes
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <ThumbsDown className="h-3 w-3" />
                          Improve
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Templates Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  Custom Templates & Favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Save Current Plan as Template
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Career Transition Template</h4>
                      <p className="text-xs text-muted-foreground">Saved 2 weeks ago</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Goal Setting Intensive</h4>
                      <p className="text-xs text-muted-foreground">Saved 1 month ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionPlanTab;
