
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Volume2, 
  SkipBack, 
  SkipForward, 
  Clock,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Target
} from "lucide-react";

const StaffMeetingTranscriptSubtabs = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [volume, setVolume] = useState(75);

  const transcriptSummary = `
This 45-minute development meeting focused on staff performance review and growth planning. 
Key topics discussed included:

• Performance metrics and achievements over the past quarter
• Areas for improvement and skill development opportunities
• Career advancement goals and pathways
• Training and mentorship recommendations
• Resource allocation for professional development

The staff member demonstrated strong engagement and receptiveness to feedback, showing particular interest in leadership development opportunities. Manager provided constructive feedback on time management and client communication skills.

Action items identified:
1. Enroll in leadership development program
2. Schedule bi-weekly check-ins for progress monitoring
3. Implement new documentation workflow
4. Attend upcoming trauma-informed care training
  `;

  const fullTranscript = `
[00:00:15] Manager: Good morning, Sarah. Thank you for meeting with me today. How are you feeling about your progress this quarter?

[00:00:22] Staff: Good morning! I'm doing well, thank you. I feel like I've made some good strides, especially with client engagement. I've been implementing some of the techniques we discussed last time.

[00:00:35] Manager: That's great to hear. I've noticed the improvement in your documentation quality as well. Your case notes have become much more comprehensive and timely.

[00:00:45] Staff: Thank you, that means a lot. I've been working really hard on that. The new system is starting to feel more natural.

[00:01:02] Manager: Let's talk about your goals for the next quarter. What areas would you like to focus on?

[00:01:08] Staff: I'd really like to work on my leadership skills. I feel ready to take on more responsibility and maybe mentor some of the newer staff members.

[00:01:18] Manager: That's an excellent goal. I think you'd be a great mentor. Your clinical skills are strong, and you have good rapport with the team.

[00:01:30] Staff: I also want to continue improving my time management. Some days I still feel like I'm rushing to complete everything.

[00:01:38] Manager: Time management is something we can definitely work on together. Have you considered using the priority matrix we discussed?

[00:01:46] Staff: I've tried it a few times, but I think I need to be more consistent with it.

[00:01:52] Manager: That's understandable. Let's set up some check-in points to help you stay on track...

[Transcript continues with detailed conversation about goals, feedback, and development plans]
  `;

  const significantMoments = [
    {
      id: 1,
      timestamp: "00:01:08",
      type: "Goal Setting",
      description: "Staff expresses interest in leadership development and mentoring opportunities",
      icon: <Target className="h-4 w-4 text-blue-500" />
    },
    {
      id: 2,
      timestamp: "00:01:30",
      type: "Area for Improvement",
      description: "Staff identifies time management as a continued focus area",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />
    },
    {
      id: 3,
      timestamp: "00:02:15",
      type: "Positive Feedback",
      description: "Manager acknowledges improvement in documentation quality",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    },
    {
      id: 4,
      timestamp: "00:03:22",
      type: "Action Item",
      description: "Decision made to enroll in leadership development program",
      icon: <Lightbulb className="h-4 w-4 text-purple-500" />
    },
    {
      id: 5,
      timestamp: "00:04:45",
      type: "Skill Development",
      description: "Discussion about trauma-informed care training opportunity",
      icon: <Target className="h-4 w-4 text-blue-500" />
    },
    {
      id: 6,
      timestamp: "00:05:10",
      type: "Feedback Loop",
      description: "Staff requests more frequent check-ins for progress monitoring",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6">
      {/* Transcript Deletion Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Data Retention Notice</span>
          </div>
          <p className="text-sm text-orange-700 mt-2">
            Meeting transcript records will be kept for 7 days and then automatically deleted from the system for privacy protection.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="full-transcript">Full Transcript</TabsTrigger>
          <TabsTrigger value="moments">Moments</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI-Generated Meeting Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {transcriptSummary}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="full-transcript" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Full Meeting Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Audio Controls */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlayPause}
                      className="flex items-center gap-2"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${volume}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{currentTime} / 45:32</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "15%" }} />
                </div>
              </div>

              {/* Transcript Content */}
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {fullTranscript}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Significant Moments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {significantMoments.map((moment) => (
                  <div key={moment.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-2 min-w-0">
                      {moment.icon}
                      <Badge variant="outline" className="text-xs">
                        {moment.timestamp}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {moment.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{moment.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Jump to
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffMeetingTranscriptSubtabs;
