
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, SkipBack, SkipForward, Clock, AlertTriangle, Heart, Lightbulb, MessageSquare } from "lucide-react";

const TranscriptSubtabs = () => {
  const [activeSubTab, setActiveSubTab] = useState("summary");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([50]);
  
  const totalDuration = 45; // 45 minutes

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const moments = [
    {
      id: 1,
      timestamp: "12:35",
      type: "key-question",
      icon: MessageSquare,
      color: "bg-blue-100 text-blue-800",
      title: "Key Question Asked",
      description: "Provider asked about client's anxiety triggers and coping mechanisms"
    },
    {
      id: 2,
      timestamp: "18:22",
      type: "health-concern",
      icon: Heart,
      color: "bg-red-100 text-red-800",
      title: "Health Concern Raised",
      description: "Client mentioned increased sleep difficulties and appetite changes"
    },
    {
      id: 3,
      timestamp: "25:10",
      type: "compliance",
      icon: AlertTriangle,
      color: "bg-yellow-100 text-yellow-800",
      title: "Compliance Issue",
      description: "Client admitted to missing medication doses over the weekend"
    },
    {
      id: 4,
      timestamp: "32:45",
      type: "breakthrough",
      icon: Lightbulb,
      color: "bg-green-100 text-green-800",
      title: "Breakthrough Moment",
      description: "Client had insight about connection between work stress and anxiety symptoms"
    },
    {
      id: 5,
      timestamp: "41:15",
      type: "positive",
      icon: Heart,
      color: "bg-purple-100 text-purple-800",
      title: "Positive Moment",
      description: "Client expressed gratitude and optimism about progress made"
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Transcript Notice */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Data Retention Notice</h4>
            <p className="text-sm text-amber-700">
              Phone call transcript records for this session will be automatically deleted from the system after 7 days for privacy and security compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Transcript Subtabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="full-transcript">Full Transcript</TabsTrigger>
              <TabsTrigger value="moments">Moments</TabsTrigger>
            </TabsList>
            
            {/* Summary Tab */}
            <TabsContent value="summary" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    AI Generated Call Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">45:32</div>
                        <div className="text-sm text-muted-foreground">Call Duration</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">85%</div>
                        <div className="text-sm text-muted-foreground">Engagement Level</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">7</div>
                        <div className="text-sm text-muted-foreground">Key Topics</div>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        <strong>Session Overview:</strong> This was a highly productive individual therapy session with the client showing excellent engagement and openness. 
                        The conversation focused primarily on anxiety management, recent stress triggers, and progress with previously assigned coping strategies.
                      </p>
                      
                      <p className="text-gray-700 leading-relaxed">
                        <strong>Key Discussion Points:</strong> Client reported significant improvement in sleep quality since implementing the relaxation techniques 
                        discussed in the previous session. However, they expressed concerns about increased work-related stress and its impact on overall anxiety levels. 
                        We explored the connection between perfectionism and anxiety, leading to valuable insights.
                      </p>
                      
                      <p className="text-gray-700 leading-relaxed">
                        <strong>Notable Progress:</strong> Client demonstrated excellent self-awareness and was able to identify specific anxiety triggers. 
                        They reported using grounding techniques successfully on three occasions this week. Medication compliance has improved, 
                        though there were missed doses over the weekend.
                      </p>
                      
                      <p className="text-gray-700 leading-relaxed">
                        <strong>Areas of Concern:</strong> Some regression in social engagement due to work pressures. Client expressed feeling overwhelmed 
                        by upcoming project deadlines. Sleep improvements are positive but appetite changes need monitoring.
                      </p>
                      
                      <p className="text-gray-700 leading-relaxed">
                        <strong>Next Steps:</strong> Agreed to focus on work-life balance strategies in the next session. Client will practice the new 
                        cognitive restructuring technique discussed today and complete the anxiety monitoring log. Follow-up scheduled for next week.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Full Transcript Tab */}
            <TabsContent value="full-transcript" className="mt-6">
              <div className="space-y-6">
                
                {/* Audio Player */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Session Recording
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      
                      {/* Time Display */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(totalDuration)}</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <Slider
                        value={[currentTime]}
                        onValueChange={(value) => setCurrentTime(value[0])}
                        max={totalDuration}
                        step={0.1}
                        className="w-full"
                      />
                      
                      {/* Controls */}
                      <div className="flex items-center justify-center gap-4">
                        <Button variant="outline" size="sm">
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button onClick={handlePlayPause} size="sm">
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <SkipForward className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex items-center gap-2 ml-6">
                          <Volume2 className="h-4 w-4" />
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="w-24"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transcript Content */}
                <Card>
                  <CardHeader>
                    <CardTitle>Full Session Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      
                      <div className="flex gap-3">
                        <div className="text-xs text-muted-foreground w-16">00:32</div>
                        <div className="flex-1">
                          <div className="font-medium text-blue-600 mb-1">Provider:</div>
                          <p className="text-sm">Good morning! How are you feeling today? I'd like to start by checking in on how this past week has been for you.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="text-xs text-muted-foreground w-16">01:15</div>
                        <div className="flex-1">
                          <div className="font-medium text-green-600 mb-1">Client:</div>
                          <p className="text-sm">Hi, thank you. This week has been... actually better than I expected. I've been using those breathing exercises you taught me, and they really helped when I felt that anxiety creeping in at work.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="text-xs text-muted-foreground w-16">02:45</div>
                        <div className="flex-1">
                          <div className="font-medium text-blue-600 mb-1">Provider:</div>
                          <p className="text-sm">That's wonderful to hear! Can you tell me more about those specific moments at work? What was happening when you felt the anxiety, and how did the breathing exercises help?</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="text-xs text-muted-foreground w-16">03:20</div>
                        <div className="flex-1">
                          <div className="font-medium text-green-600 mb-1">Client:</div>
                          <p className="text-sm">Well, there was this presentation I had to give on Tuesday. Usually, I would start panicking days before, but this time I caught myself and did the 4-7-8 breathing technique. It didn't make the anxiety disappear completely, but it made it manageable.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="text-xs text-muted-foreground w-16">04:50</div>
                        <div className="flex-1">
                          <div className="font-medium text-blue-600 mb-1">Provider:</div>
                          <p className="text-sm">That's significant progress. You're developing awareness of your anxiety patterns and actively using coping strategies. How did the presentation go?</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="text-xs text-muted-foreground w-16">05:30</div>
                        <div className="flex-1">
                          <div className="font-medium text-green-600 mb-1">Client:</div>
                          <p className="text-sm">It went better than I thought! I was nervous, but I got through it without the usual panic. My colleagues even complimented my delivery. I think the preparation and the breathing exercises really made a difference.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="text-xs text-muted-foreground w-16">12:35</div>
                        <div className="flex-1">
                          <div className="font-medium text-blue-600 mb-1">Provider:</div>
                          <p className="text-sm">I'd like to explore what specific situations or thoughts tend to trigger your anxiety. Can you think of patterns you've noticed this week?</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 ml-16">
                        <p className="text-xs text-blue-600 font-medium">Key Moment: Important question about anxiety triggers</p>
                      </div>

                      <div className="flex gap-3">
                        <div className="text-xs text-muted-foreground w-16">18:22</div>
                        <div className="flex-1">
                          <div className="font-medium text-green-600 mb-1">Client:</div>
                          <p className="text-sm">I've also been having trouble sleeping again, and my appetite has been off. I'm not sure if it's related to the stress or something else.</p>
                        </div>
                      </div>

                      <div className="bg-red-50 border-l-4 border-red-400 p-3 ml-16">
                        <p className="text-xs text-red-600 font-medium">Health Concern: Sleep and appetite issues mentioned</p>
                      </div>

                      <div className="flex gap-3">
                        <div className="text-xs text-muted-foreground w-16">25:10</div>
                        <div className="flex-1">
                          <div className="font-medium text-green-600 mb-1">Client:</div>
                          <p className="text-sm">I have to confess, I forgot to take my medication on Saturday and Sunday. I was visiting my parents and just got out of my routine.</p>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 ml-16">
                        <p className="text-xs text-yellow-600 font-medium">Compliance Issue: Missed weekend medication doses</p>
                      </div>

                      <div className="text-center text-muted-foreground text-sm py-4">
                        <Clock className="h-4 w-4 mx-auto mb-2" />
                        Transcript continues... (Showing key excerpts)
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Moments Tab */}
            <TabsContent value="moments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Key Session Moments
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    AI-identified significant moments during the session with timestamps for easy reference.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moments.map((moment) => {
                      const IconComponent = moment.icon;
                      return (
                        <div key={moment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {moment.timestamp}
                              </Badge>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`p-1 rounded ${moment.color}`}>
                                  <IconComponent className="h-4 w-4" />
                                </div>
                                <h4 className="font-medium">{moment.title}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">{moment.description}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setCurrentTime(parseInt(moment.timestamp.split(':')[0]))}>
                              Go to Time
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranscriptSubtabs;
