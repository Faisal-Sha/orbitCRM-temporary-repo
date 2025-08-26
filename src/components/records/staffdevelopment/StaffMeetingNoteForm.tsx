
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Star, CheckCircle, FileText, Calendar, Clock, Users } from "lucide-react";
import GrowthStatusIndicator from "@/components/Growthstatus";
import StaffMeetingNoteContent from "./StaffMeetingNoteContent";
import StaffMeetingTranscriptSubtabs from "./StaffMeetingTranscriptSubtabs";

interface StaffMeetingNoteFormProps {
  onClose: () => void;
}

const StaffMeetingNoteForm = ({ onClose }: StaffMeetingNoteFormProps) => {
  const [activeTab, setActiveTab] = useState("meeting-note");
  const [sessionData, setSessionData] = useState({
    sessionDate: "",
    startTime: "",
    endTime: "",
    sessionType: "",
    topicCode: "",
    participants: "",
    growthStage: "foundation" as "foundation" | "developing" | "established",
    program: "",
    managerRating: 0,
    needsSupervision: false
  });

  const handleSave = () => {
    console.log("Saving new staff meeting note:", sessionData);
    // In a real app, this would save to a backend
    onClose();
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

  const calculateDuration = () => {
    if (sessionData.startTime && sessionData.endTime) {
      const start = new Date(`2024-01-01 ${sessionData.startTime}`);
      const end = new Date(`2024-01-01 ${sessionData.endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.round(diffMs / (1000 * 60));
      return diffMins > 0 ? `${diffMins} min` : "";
    }
    return "";
  };

  // Create a dummy note structure for the content component
  const dummyNote = {
    content: {
      sessionSummary: "",
      goalsAlignment: "",
      developmentPlan: ""
    }
  };

  return (
    <div className="app-card">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onClose} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Notes
            </Button>
            <div>
              <h2 className="text-2xl font-semibold">New Development Meeting Note</h2>
              <p className="text-muted-foreground">Create a new staff development session record</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-3 w-3" />
              Save Draft
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3" />
              Sign & Complete
            </Button>
          </div>
        </div>

        {/* Session Demographics & Context */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Session Demographics & Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Date & Time */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Session Date</label>
                  <Input
                    type="date"
                    value={sessionData.sessionDate}
                    onChange={(e) => setSessionData({...sessionData, sessionDate: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <Input
                      type="time"
                      value={sessionData.startTime}
                      onChange={(e) => setSessionData({...sessionData, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Time</label>
                    <Input
                      type="time"
                      value={sessionData.endTime}
                      onChange={(e) => setSessionData({...sessionData, endTime: e.target.value})}
                    />
                  </div>
                </div>
                
                {calculateDuration() && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Duration: {calculateDuration()}
                  </div>
                )}
              </div>

              {/* Session Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Session Type</label>
                  <Select value={sessionData.sessionType} onValueChange={(value) => setSessionData({...sessionData, sessionType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Performance Review">Performance Review</SelectItem>
                      <SelectItem value="Mentoring Session">Mentoring Session</SelectItem>
                      <SelectItem value="1-on-1 Check-in">1-on-1 Check-in</SelectItem>
                      <SelectItem value="Team Meeting">Team Meeting</SelectItem>
                      <SelectItem value="Skills Assessment">Skills Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Topic Code</label>
                  <Select value={sessionData.topicCode} onValueChange={(value) => setSessionData({...sessionData, topicCode: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Career Growth">Career Growth</SelectItem>
                      <SelectItem value="Project Feedback">Project Feedback</SelectItem>
                      <SelectItem value="Skill Development">Skill Development</SelectItem>
                      <SelectItem value="Performance Issues">Performance Issues</SelectItem>
                      <SelectItem value="Training & Development">Training & Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Participants (if applicable)</label>
                  <Textarea
                    placeholder="List other participants (colleagues, supervisors, etc.)"
                    value={sessionData.participants}
                    onChange={(e) => setSessionData({...sessionData, participants: e.target.value})}
                    className="min-h-[60px]"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Staff Growth Status</label>
                  <Select 
                    value={sessionData.growthStage} 
                    onValueChange={(value: "foundation" | "developing" | "established") => 
                      setSessionData({...sessionData, growthStage: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="foundation">
                        <div className="flex items-center gap-2">
                          <GrowthStatusIndicator growthStage="foundation" showText={false} />
                          Foundation
                        </div>
                      </SelectItem>
                      <SelectItem value="developing">
                        <div className="flex items-center gap-2">
                          <GrowthStatusIndicator growthStage="developing" showText={false} />
                          Developing
                        </div>
                      </SelectItem>
                      <SelectItem value="established">
                        <div className="flex items-center gap-2">
                          <GrowthStatusIndicator growthStage="established" showText={false} />
                          Established
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Staff Role/Program</label>
                  <Select value={sessionData.program} onValueChange={(value) => setSessionData({...sessionData, program: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Provider">Provider</SelectItem>
                      <SelectItem value="Clinician">Clinician</SelectItem>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                      <SelectItem value="Support Staff">Support Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Rate Session Quality</label>
                  <div className="flex items-center gap-2">
                    {renderStars(sessionData.managerRating, (rating) => 
                      setSessionData({...sessionData, managerRating: rating})
                    )}
                    <span className="text-sm text-muted-foreground">
                      ({sessionData.managerRating}/5)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="supervision"
                  checked={sessionData.needsSupervision}
                  onCheckedChange={(checked) => 
                    setSessionData({...sessionData, needsSupervision: checked as boolean})
                  }
                />
                <label htmlFor="supervision" className="text-sm font-medium">
                  Needs Follow-up/Supervision
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Quick Actions will appear after saving</span>
              </div>
              
              <div className="flex items-center gap-2 justify-end">
                <Button variant="outline" size="sm">Edit Note</Button>
                <Button variant="outline" size="sm">Delete</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note Content Tabs */}
        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="meeting-note" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Meeting Note
                </TabsTrigger>
                <TabsTrigger value="transcript" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Transcript
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="meeting-note" className="mt-6">
                <StaffMeetingNoteContent note={dummyNote} />
              </TabsContent>
              
              <TabsContent value="transcript" className="mt-6">
                <StaffMeetingTranscriptSubtabs />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffMeetingNoteForm;
