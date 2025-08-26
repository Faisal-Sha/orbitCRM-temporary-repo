
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Play, FileText, Video, Users, Calendar, Award } from "lucide-react";

// Dummy data for onboarding tasks
const initialTasks = [
  { id: "intake-app", title: "Fill out the Intake Application", completed: true, category: "Core Intake" },
  { id: "schedule-intake", title: "Schedule your intake appointment", completed: true, category: "Core Intake" },
  { id: "initial-assessment", title: "Complete the initial assessment", completed: false, category: "Core Intake" },
  { id: "consent-form", title: "Sign the Client Consent Form", completed: true, category: "Essential Documents" },
  { id: "hipaa-policy", title: "Review the HIPAA Privacy Policy", completed: false, category: "Essential Documents" },
  { id: "welcome-video", title: "Watch the \"Welcome\" video", completed: true, category: "Learning & Foundation" },
  { id: "company-overview", title: "Watch the \"Company Overview\" video", completed: false, category: "Learning & Foundation" },
  { id: "find-match", title: "Watch the \"Find Your Match\" video", completed: false, category: "Learning & Foundation" },
  { id: "select-matches", title: "Select your 3 best matches", completed: true, category: "Interactive & Matching" },
  { id: "schedule-appointments", title: "Schedule the appointments with your matches", completed: false, category: "Interactive & Matching" },
  { id: "attend-appointments", title: "Attend the appointments with your matches", completed: false, category: "Interactive & Matching" },
  { id: "decide-match", title: "Decide on your best match choice", completed: false, category: "Interactive & Matching" },
  { id: "second-appointment", title: "Schedule a second appointment with your favorite provider", completed: false, category: "Interactive & Matching" },
];

const PersonalOnboarding = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [learningProgress, setLearningProgress] = useState({
    welcomeVideo: true,
    companyOverview: false,
    companyValues: false,
    companyValuesAgreed: false,
    findMatchVideo: false,
    matchesSelected: true,
    firstAppointmentScheduled: false,
  });

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const markLearningComplete = (item: string) => {
    setLearningProgress(prev => ({ ...prev, [item]: true }));
    
    // Update corresponding task in checklist
    setTasks(prev => prev.map(task => {
      if (item === 'welcomeVideo' && task.id === 'welcome-video') return { ...task, completed: true };
      if (item === 'companyOverview' && task.id === 'company-overview') return { ...task, completed: true };
      if (item === 'findMatchVideo' && task.id === 'find-match') return { ...task, completed: true };
      return task;
    }));
  };

  const isSection1Complete = learningProgress.welcomeVideo && learningProgress.companyOverview && learningProgress.companyValuesAgreed;

  return (
    <div className="app-card space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Onboarding Progress
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Complete all tasks to finish your onboarding
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {completedTasks}/{totalTasks} Complete
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="checklist" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Checklist
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Learning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Tasks</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete all tasks to finish your onboarding. Tasks are automatically checked when completed in other sections.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold text-lg text-primary">{category}</h3>
                  <div className="space-y-2">
                    {categoryTasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                          task.completed ? 'bg-green-500' : 'bg-gray-200'
                        }`}>
                          {task.completed && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                          {task.title}
                        </span>
                        {task.completed && (
                          <Badge variant="secondary" className="ml-auto">Complete</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sequential Learning Modules</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete each section in order. New sections unlock as you progress.
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="section-1">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <div>
                        <div className="font-medium">Welcome</div>
                        <div className="text-sm text-muted-foreground">Get started with your journey</div>
                      </div>
                      {isSection1Complete && (
                        <Badge variant="secondary" className="ml-auto">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          <span className="font-medium">Welcome Video</span>
                          {learningProgress.welcomeVideo && (
                            <Badge variant="secondary">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Done
                            </Badge>
                          )}
                        </div>
                        <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                          <Play className="h-8 w-8 text-gray-400" />
                        </div>
                        <Button 
                          onClick={() => markLearningComplete('welcomeVideo')}
                          disabled={learningProgress.welcomeVideo}
                          size="sm"
                        >
                          {learningProgress.welcomeVideo ? 'Completed' : 'Mark as Done'}
                        </Button>
                      </div>

                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          <span className="font-medium">Company Overview</span>
                          {learningProgress.companyOverview && (
                            <Badge variant="secondary">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Done
                            </Badge>
                          )}
                        </div>
                        <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                          <Play className="h-8 w-8 text-gray-400" />
                        </div>
                        <Button 
                          onClick={() => markLearningComplete('companyOverview')}
                          disabled={learningProgress.companyOverview}
                          size="sm"
                        >
                          {learningProgress.companyOverview ? 'Completed' : 'Mark as Done'}
                        </Button>
                      </div>

                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          <span className="font-medium">Company Values</span>
                          {learningProgress.companyValues && (
                            <Badge variant="secondary">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Done
                            </Badge>
                          )}
                        </div>
                        <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                          <Play className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                          <Button 
                            onClick={() => markLearningComplete('companyValues')}
                            disabled={learningProgress.companyValues}
                            size="sm"
                          >
                            {learningProgress.companyValues ? 'Completed' : 'Mark as Done'}
                          </Button>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="values-agreement"
                              checked={learningProgress.companyValuesAgreed}
                              onCheckedChange={(checked) => 
                                setLearningProgress(prev => ({ ...prev, companyValuesAgreed: !!checked }))
                              }
                            />
                            <label htmlFor="values-agreement" className="text-sm">
                              I agree with these company values
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="section-2" className={!isSection1Complete ? 'opacity-50 pointer-events-none' : ''}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <div>
                        <div className="font-medium">Finding Your Match</div>
                        <div className="text-sm text-muted-foreground">Learn how to find the right provider</div>
                      </div>
                      {!isSection1Complete && (
                        <Badge variant="outline">Locked</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        <span className="font-medium">Find Your Match Video</span>
                        {learningProgress.findMatchVideo && (
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Done
                          </Badge>
                        )}
                      </div>
                      <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                        <Play className="h-8 w-8 text-gray-400" />
                      </div>
                      <Button 
                        onClick={() => markLearningComplete('findMatchVideo')}
                        disabled={learningProgress.findMatchVideo}
                        size="sm"
                      >
                        {learningProgress.findMatchVideo ? 'Completed' : 'Mark as Done'}
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-medium">Interactive Checklist</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className={`h-4 w-4 rounded-full ${learningProgress.matchesSelected ? 'bg-green-500' : 'bg-gray-200'}`}>
                            {learningProgress.matchesSelected && <CheckCircle className="h-3 w-3 text-white" />}
                          </div>
                          <span className={learningProgress.matchesSelected ? 'line-through text-muted-foreground' : ''}>
                            Select your 3 best matches
                          </span>
                          {learningProgress.matchesSelected && <Badge variant="secondary">Auto-checked</Badge>}
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`h-4 w-4 rounded-full ${learningProgress.firstAppointmentScheduled ? 'bg-green-500' : 'bg-gray-200'}`}>
                            {learningProgress.firstAppointmentScheduled && <CheckCircle className="h-3 w-3 text-white" />}
                          </div>
                          <span>Schedule the appointment with your first match</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalOnboarding;
