
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, FileText, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import GrowthStatusIndicator from "@/components/Growthstatus";
import ProgressNoteContent from "./ProgressNoteContent";
import TranscriptSubtabs from "./TranscriptSubtabs";

interface ProgressNoteDetailProps {
  note: {
    id: string;
    date: string;
    time: string;
    duration: string;
    type: string;
    author: string;
    status: string;
    providerRating: number;
    clientRating: number;
    preview: string;
    growthStage: "foundation" | "developing" | "established";
    program: string;
    content: {
      sessionSummary: string;
      goalsAlignment: string;
      treatmentPlan: string;
    };
  };
  onClose: () => void;
}

const ProgressNoteDetail = ({ note, onClose }: ProgressNoteDetailProps) => {
  const [activeTab, setActiveTab] = useState("progress-note");
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "signed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "signed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending review":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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
              <h2 className="text-2xl font-semibold">Progress Note Details</h2>
              <p className="text-muted-foreground">{note.date} at {note.time}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Edit className="h-3 w-3" />
              Edit Note
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          </div>
        </div>

        {/* Session Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(note.status)}
              Session Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Session Details
                </label>
                <div className="space-y-1">
                  <p className="font-medium">{note.type}</p>
                  <p className="text-sm text-muted-foreground">Duration: {note.duration}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Provider
                </label>
                <div className="space-y-1">
                  <p className="font-medium">{note.author}</p>
                  <p className="text-sm text-muted-foreground">Rating: {note.providerRating}/5</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Status & Program
                </label>
                <div className="space-y-2">
                  <Badge className={getStatusColor(note.status)}>
                    {note.status}
                  </Badge>
                  <Badge variant="secondary">{note.program}</Badge>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Client Growth
                </label>
                <div className="space-y-2">
                  <GrowthStatusIndicator growthStage={note.growthStage} />
                  <p className="text-sm text-muted-foreground">Client Rating: {note.clientRating}/5</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note Content Tabs */}
        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="progress-note" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Progress Note
                </TabsTrigger>
                <TabsTrigger value="transcript" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Transcript
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="progress-note" className="mt-6">
                <ProgressNoteContent note={note} />
              </TabsContent>
              
              <TabsContent value="transcript" className="mt-6">
                <TranscriptSubtabs />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressNoteDetail;
