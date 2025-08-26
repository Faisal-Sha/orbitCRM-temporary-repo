import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Play, FileText, Video, BookOpen, Download, Plus, Award } from "lucide-react";

const PersonalTraining = () => {
  const [curriculumProgress, setCurriculumProgress] = useState({
    // Section 1: Getting Started
    navigatingPortal: false,
    providerProfile: false,
    createProfile: true, // auto-checked
    
    // Section 2: Maximizing Sessions
    prepareFirstSession: false,
    effectiveCommunication: false,
    setGoal: false, // auto-checked when completed
    
    // Section 3: Beyond Sessions
    communityForum: false,
    crisisResources: false,
    introduceYourself: false, // auto-checked when completed
  });

  const [journalNotes, setJournalNotes] = useState([
    {
      id: 1,
      title: "Reflection on Portal Navigation",
      content: "The client portal is very intuitive. I especially like how easy it is to schedule appointments and access resources.",
      date: "2024-12-10",
    },
    {
      id: 2,
      title: "Preparing for My First Session",
      content: "I'm feeling nervous but excited about my first session. The preparation video really helped me understand what to expect.",
      date: "2024-12-08",
    },
    {
      id: 3,
      title: "Communication Tips Learning",
      content: "The article on effective communication gave me great insights on how to express my feelings and needs clearly during sessions.",
      date: "2024-12-06",
    },
    {
      id: 4,
      title: "Goal Setting Exercise",
      content: "I set a goal to be more open about my anxiety triggers in the next session. Writing this down helps me stay focused.",
      date: "2024-12-04",
    },
    {
      id: 5,
      title: "Community Forum Guidelines",
      content: "I appreciate the safety guidelines for the community forum. It makes me feel more comfortable about participating.",
      date: "2024-12-02",
    },
  ]);

  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const completedItems = Object.values(curriculumProgress).filter(Boolean).length;
  const totalItems = Object.keys(curriculumProgress).length;
  const progressPercentage = Math.round((completedItems / totalItems) * 100);

  const markComplete = (item: string) => {
    setCurriculumProgress(prev => ({ ...prev, [item]: true }));
  };

  const isSection1Complete = curriculumProgress.navigatingPortal && curriculumProgress.providerProfile && curriculumProgress.createProfile;
  const isSection2Complete = curriculumProgress.prepareFirstSession && curriculumProgress.effectiveCommunication && curriculumProgress.setGoal;

  const addJournalNote = () => {
    if (newNote.title && newNote.content) {
      const note = {
        id: journalNotes.length + 1,
        title: newNote.title,
        content: newNote.content,
        date: new Date().toISOString().split('T')[0],
      };
      setJournalNotes([note, ...journalNotes]);
      setNewNote({ title: "", content: "" });
    }
  };

  return (
    <div className="app-card space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Training Progress
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your training curriculum to maximize your care experience
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {completedItems}/{totalItems} Complete
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Curriculum Progress</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="curriculum" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Curriculum
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            My Journal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sequential Training Modules</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete each section in order to unlock the next module.
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
                        <div className="font-medium">Getting Started with Your Care</div>
                        <div className="text-sm text-muted-foreground">Learn to navigate your client experience</div>
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
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        <span className="font-medium">Navigating Your Client Portal</span>
                        {curriculumProgress.navigatingPortal && (
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
                        onClick={() => markComplete('navigatingPortal')}
                        disabled={curriculumProgress.navigatingPortal}
                        size="sm"
                      >
                        {curriculumProgress.navigatingPortal ? 'Completed' : 'Mark as Done'}
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Your Service Provider's Profile & Bio</span>
                        {curriculumProgress.providerProfile && (
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Reviewed
                          </Badge>
                        )}
                      </div>
                      <div className="bg-gray-50 p-4 rounded text-sm">
                        Resource document with provider information and background details.
                      </div>
                      <Button 
                        onClick={() => markComplete('providerProfile')}
                        disabled={curriculumProgress.providerProfile}
                        size="sm"
                        variant="outline"
                      >
                        {curriculumProgress.providerProfile ? 'Reviewed' : 'Mark as Reviewed'}
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Create your profile bio</span>
                        {curriculumProgress.createProfile && (
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Auto-completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This task is automatically marked complete when you create your profile.
                      </p>
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
                        <div className="font-medium">Maximizing Your Sessions</div>
                        <div className="text-sm text-muted-foreground">Learn to get the most from your appointments</div>
                      </div>
                      {!isSection1Complete && (
                        <Badge variant="outline">Locked</Badge>
                      )}
                      {isSection2Complete && (
                        <Badge variant="secondary" className="ml-auto">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        <span className="font-medium">How to Prepare for Your First Session</span>
                        {curriculumProgress.prepareFirstSession && (
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
                        onClick={() => markComplete('prepareFirstSession')}
                        disabled={curriculumProgress.prepareFirstSession}
                        size="sm"
                      >
                        {curriculumProgress.prepareFirstSession ? 'Completed' : 'Mark as Done'}
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Tips for Effective Communication</span>
                        {curriculumProgress.effectiveCommunication && (
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Done
                          </Badge>
                        )}
                      </div>
                      <div className="bg-gray-50 p-4 rounded text-sm">
                        Article covering communication strategies, active listening, and expressing needs clearly during therapy sessions.
                      </div>
                      <Button 
                        onClick={() => markComplete('effectiveCommunication')}
                        disabled={curriculumProgress.effectiveCommunication}
                        size="sm"
                      >
                        {curriculumProgress.effectiveCommunication ? 'Completed' : 'Mark as Done'}
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Set a goal for your next session</span>
                        {curriculumProgress.setGoal && (
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Auto-completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This task is automatically marked complete when you set a session goal.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="section-3" className={!isSection2Complete ? 'opacity-50 pointer-events-none' : ''}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <div>
                        <div className="font-medium">Beyond Your Sessions</div>
                        <div className="text-sm text-muted-foreground">Connect with community and resources</div>
                      </div>
                      {!isSection2Complete && (
                        <Badge variant="outline">Locked</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        <span className="font-medium">Using the Community Forum Safely</span>
                        {curriculumProgress.communityForum && (
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
                        onClick={() => markComplete('communityForum')}
                        disabled={curriculumProgress.communityForum}
                        size="sm"
                      >
                        {curriculumProgress.communityForum ? 'Completed' : 'Mark as Done'}
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span className="font-medium">Crisis & Emergency Resources PDF</span>
                        {curriculumProgress.crisisResources && (
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Downloaded
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Important contact information and resources for crisis situations.
                      </p>
                      <Button 
                        onClick={() => markComplete('crisisResources')}
                        disabled={curriculumProgress.crisisResources}
                        size="sm"
                        variant="outline"
                      >
                        {curriculumProgress.crisisResources ? 'Downloaded' : 'Download PDF'}
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Introduce yourself to the community</span>
                        {curriculumProgress.introduceYourself && (
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Auto-completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This task is automatically marked complete when you post your introduction.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {progressPercentage === 100 && (
                <Card className="mt-6 bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Award className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">Congratulations!</h3>
                        <p className="text-green-700 text-sm">You've completed all training modules.</p>
                      </div>
                      <Button className="ml-auto" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Training Journal</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Reflect on your training experience and track your thoughts.
                  </p>
                </div>
                <Button onClick={addJournalNote} size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Note Form */}
              <Card className="border-dashed">
                <CardContent className="pt-6 space-y-4">
                  <input
                    type="text"
                    placeholder="Note title..."
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                  <Textarea
                    placeholder="Write your reflection..."
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    rows={3}
                  />
                  <Button onClick={addJournalNote} disabled={!newNote.title || !newNote.content}>
                    Save Note
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Notes */}
              <div className="space-y-4">
                {journalNotes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{note.title}</CardTitle>
                        <Badge variant="outline">{note.date}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalTraining;
